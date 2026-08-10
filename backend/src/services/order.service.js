const crypto = require("crypto");
const cartRepository = require("../repositories/cart.repository");
const addressRepository = require("../repositories/address.repository");
const couponRepository = require("../repositories/coupon.repository");
const couponService = require("./coupon.service");
const orderRepository = require("../repositories/order.repository");
const productRepository = require("../repositories/product.repository");
const env = require("../config/env");
const { ApiError } = require("../utils/apiError");

async function createOrder(userId, payload, role) {
  const cartRows = await cartRepository.getCart(userId);
  if (cartRows.length === 0) {
    throw new ApiError(422, "Cart is empty.", { cart: "Cart is empty." });
  }

  const items = [];
  for (const row of cartRows) {
    const product = await productRepository.findById(row.product_id);
    if (!product || product.status !== "ACTIVE") continue;
    const quantity = Number(row.quantity);
    const unitPrice = getSellingPrice(product, role);
    items.push({
      product,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    });
  }

  if (items.length === 0) {
    throw new ApiError(422, "Cart has no active products.", { cart: "Cart has no active products." });
  }

  const shippingAddress = await resolveShippingAddress(userId, payload);
  const subtotalAmount = items.reduce((total, item) => total + item.lineTotal, 0);
  let coupon = null;
  let discountAmount = 0;
  if (payload.couponCode) {
    const validation = await couponService.validateCoupon({ code: payload.couponCode, subtotalAmount });
    coupon = validation.coupon;
    discountAmount = validation.discountAmount;
  }
  const shippingAmount = 0;
  const totalAmount = subtotalAmount - discountAmount + shippingAmount;
  const orderNumber = `PAF${Date.now()}`;
  const connection = await orderRepository.pool.getConnection();

  try {
    await connection.beginTransaction();
    const [orderResult] = await connection.execute(
      `INSERT INTO orders
       (order_number, user_id, coupon_id, subtotal_amount, discount_amount, shipping_amount, total_amount, shipping_address_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, userId, coupon?.id || null, subtotalAmount, discountAmount, shippingAmount, totalAmount, JSON.stringify(shippingAddress)],
    );
    const orderId = orderResult.insertId;
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, product_name, product_sku, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product.id, item.product.name, item.product.sku, item.unitPrice, item.quantity, item.lineTotal],
      );
    }
    await connection.commit();
    return getOrder(userId, orderId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function getSellingPrice(product, role) {
  return Number(role === "DEALER" ? product.prices.dealerSellingPrice : product.prices.customerSellingPrice);
}

async function listOrders(userId) {
  return orderRepository.findByUser(userId);
}

async function listAllOrders() {
  return orderRepository.findAll();
}

async function getOrder(userId, orderId) {
  const order = await orderRepository.findByIdForUser(orderId, userId);
  if (!order) throw new ApiError(404, "Order not found.");
  return order;
}

async function getAdminOrder(orderId) {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found.");
  return order;
}

async function updateAdminOrderStatus(orderId, status) {
  await getAdminOrder(orderId);
  return orderRepository.updateStatus(orderId, status);
}

async function createRazorpayOrder(userId, orderId) {
  const order = await getOrder(userId, orderId);
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    throw new ApiError(500, "Razorpay keys are not configured.");
  }
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${env.razorpay.keyId}:${env.razorpay.keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order.orderNumber,
      notes: { orderId: String(order.id), orderNumber: order.orderNumber },
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new ApiError(502, result.error?.description || "Unable to create Razorpay order.");
  }
  return {
    keyId: env.razorpay.keyId,
    razorpayOrder: result,
    order,
  };
}

async function verifyRazorpayPayment(userId, payload) {
  await getOrder(userId, payload.orderId);
  const expected = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
    .digest("hex");

  if (expected !== payload.razorpaySignature) {
    throw new ApiError(422, "Payment verification failed.", { payment: "Payment verification failed." });
  }

  await orderRepository.markPaid(payload.orderId, payload.razorpayPaymentId, payload);
  const couponRow = await orderRepository.findCouponIdByOrderId(payload.orderId);
  if (couponRow?.coupon_id && Number(couponRow.discount_amount) > 0) {
    await couponRepository.createUsage(orderRepository.pool, {
      couponId: couponRow.coupon_id,
      userId: couponRow.user_id,
      orderId: payload.orderId,
      discountAmount: Number(couponRow.discount_amount),
    });
  }
  await cartRepository.clearCart(userId);
  return getOrder(userId, payload.orderId);
}

async function resolveShippingAddress(userId, payload) {
  if (payload.addressId) {
    const savedAddress = await addressRepository.findByIdForUser(payload.addressId, userId);
    if (!savedAddress) {
      throw new ApiError(422, "Please select a valid delivery address.", { addressId: "Select a valid delivery address." });
    }
    return normalizeShippingAddress(savedAddress);
  }
  return normalizeShippingAddress(payload.shippingAddress || payload);
}

function normalizeShippingAddress(input) {
  const address = {
    fullName: String(input.fullName || "").trim(),
    mobile: String(input.mobile || "").trim(),
    addressLine1: String(input.addressLine1 || "").trim(),
    addressLine2: String(input.addressLine2 || "").trim(),
    city: String(input.city || "").trim(),
    state: String(input.state || "").trim(),
    pincode: String(input.pincode || "").trim(),
    landmark: String(input.landmark || "").trim(),
  };
  const errors = {};
  if (!address.fullName) errors.fullName = "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(address.mobile)) errors.mobile = "Enter a valid mobile number.";
  if (!address.addressLine1) errors.addressLine1 = "Address is required.";
  if (!address.city) errors.city = "City is required.";
  if (!address.state) errors.state = "State is required.";
  if (!/^\d{6}$/.test(address.pincode)) errors.pincode = "Enter a valid pincode.";
  if (Object.keys(errors).length) {
    throw new ApiError(422, "Please fix the highlighted fields.", errors);
  }
  return address;
}

module.exports = {
  createOrder,
  listOrders,
  listAllOrders,
  getOrder,
  getAdminOrder,
  updateAdminOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
};
