const crypto = require("crypto");
const cartRepository = require("../repositories/cart.repository");
const addressRepository = require("../repositories/address.repository");
const couponRepository = require("../repositories/coupon.repository");
const couponService = require("./coupon.service");
const orderRepository = require("../repositories/order.repository");
const webhookEventRepository = require("../repositories/webhookEvent.repository");
const productRepository = require("../repositories/product.repository");
const settingsRepository = require("../repositories/settings.repository");
const env = require("../config/env");
const { ApiError } = require("../utils/apiError");
const { normalizeSelection } = require("./cart.service");

async function createOrder(userId, payload, role) {
  const items = payload.buyNow
    ? await buildBuyNowItems(payload.buyNow, role)
    : await buildCartItems(userId, role);

  if (items.length === 0) {
    throw new ApiError(422, payload.buyNow ? "Product is not available." : "Cart has no active products.", {
      [payload.buyNow ? "buyNow" : "cart"]: payload.buyNow ? "Product is not available." : "Cart has no active products.",
    });
  }

  const shippingAddress = await resolveShippingAddress(userId, payload);
  const subtotalAmount = items.reduce((total, item) => total + item.lineTotal, 0);
  let coupon = null;
  let discountAmount = 0;
  if (payload.couponCode) {
    const validation = await couponService.validateCoupon({ code: payload.couponCode, subtotalAmount, lineItems: items.map((item) => ({ productId: item.product.id, lineTotal: item.lineTotal })) });
    coupon = validation.coupon;
    discountAmount = validation.discountAmount;
  }
  const shippingAmount = 0;
  const totalAmount = subtotalAmount - discountAmount + shippingAmount;
  const paymentMethod = payload.paymentMethod === "COD" ? "COD" : "ONLINE";
  const settings = await settingsRepository.getSiteSettings();
  const configuredAdvanceAmount = Math.max(1, Number(settings.orderAdvanceAmount || settingsRepository.defaultSiteSettings.orderAdvanceAmount));
  const advanceAmount = paymentMethod === "COD" ? Math.min(configuredAdvanceAmount, totalAmount) : totalAmount;
  const balanceAmount = Math.max(totalAmount - advanceAmount, 0);
  const orderNumber = `PAF${Date.now()}`;
  const connection = await orderRepository.pool.getConnection();

  try {
    await connection.beginTransaction();
    const [orderResult] = await connection.execute(
      `INSERT INTO orders
       (order_number, user_id, coupon_id, subtotal_amount, discount_amount, shipping_amount, total_amount, payment_method, advance_amount, balance_amount, shipping_address_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, userId, coupon?.id || null, subtotalAmount, discountAmount, shippingAmount, totalAmount, paymentMethod, advanceAmount, balanceAmount, JSON.stringify(shippingAddress)],
    );
    const orderId = orderResult.insertId;
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, product_name, product_sku, selected_color_name, selected_color_code, selected_image_url, selected_variant_key, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product.id,
          item.product.name,
          item.product.sku,
          item.selectedColorName || null,
          item.selectedColorCode || null,
          item.selectedImageUrl || null,
          item.selectedVariantKey || "",
          item.unitPrice,
          item.quantity,
          item.lineTotal,
        ],
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

async function buildCartItems(userId, role) {
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
      selectedColorName: row.selected_color_name || "",
      selectedColorCode: row.selected_color_code || "",
      selectedImageUrl: row.selected_image_url || "",
      selectedVariantKey: row.selected_variant_key || "",
      unitPrice,
      lineTotal: unitPrice * quantity,
    });
  }
  return items;
}

async function buildBuyNowItems(buyNow, role) {
  const productId = Number(buyNow.productId);
  const requestedQuantity = Number(buyNow.quantity || 1);
  const quantity = Number.isFinite(requestedQuantity) ? Math.max(1, Math.min(Math.floor(requestedQuantity), 99)) : 1;
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new ApiError(422, "Valid product is required.", { productId: "Valid product is required." });
  }
  const product = await productRepository.findById(productId);
  if (!product || product.status !== "ACTIVE") {
    throw new ApiError(422, "Product is not available.", { productId: "Product is not available." });
  }
  const selection = normalizeSelection(product, buyNow);
  const unitPrice = getSellingPrice(product, role);
  return [{
    product,
    quantity,
    selectedColorName: selection.colorName || "",
    selectedColorCode: selection.colorCode || "",
    selectedImageUrl: selection.imageUrl || "",
    selectedVariantKey: selection.variantKey || "",
    unitPrice,
    lineTotal: unitPrice * quantity,
  }];
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
  const payableAmount = order.paymentMethod === "COD" ? order.advanceAmount : order.totalAmount;
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${env.razorpay.keyId}:${env.razorpay.keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: Math.round(payableAmount * 100),
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: String(order.id),
        orderNumber: order.orderNumber,
        paymentMethod: order.paymentMethod,
        balanceAmount: String(order.balanceAmount || 0),
      },
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
  await recordCouponUsageIfNeeded(payload.orderId);

  if (payload.checkoutMode !== "BUY_NOW") {
    await cartRepository.clearCart(userId);
  }
  return getOrder(userId, payload.orderId);
}

async function markPaymentFailedByUser(userId, orderId, payload = {}) {
  const order = await getOrder(userId, orderId);
  if (order.paymentStatus !== "PENDING") return order;
  await orderRepository.markPaymentFailedWithoutProviderId(orderId, {
    reason: payload.reason || "checkout_dismissed",
    source: "frontend",
  });
  return getOrder(userId, orderId);
}

async function recordCouponUsageIfNeeded(orderId) {
  const couponRow = await orderRepository.findCouponIdByOrderId(orderId);
  if (!couponRow?.coupon_id || Number(couponRow.discount_amount) <= 0) return;
  try {
    await couponRepository.createUsage(orderRepository.pool, {
      couponId: couponRow.coupon_id,
      userId: couponRow.user_id,
      orderId,
      discountAmount: Number(couponRow.discount_amount),
    });
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") return;
    throw error;
  }
}

async function handleRazorpayWebhook(rawBody, signature) {
  if (!env.razorpay.webhookSecret) {
    throw new ApiError(503, "Razorpay webhook secret is not configured.");
  }
  if (!signature) {
    throw new ApiError(400, "Razorpay webhook signature is required.");
  }

  const expected = crypto.createHmac("sha256", env.razorpay.webhookSecret).update(rawBody).digest("hex");
  if (expected !== signature) {
    throw new ApiError(400, "Invalid Razorpay webhook signature.");
  }

  const event = JSON.parse(rawBody.toString("utf8"));
  const payment = event.payload?.payment?.entity;
  const orderId = Number(payment?.notes?.orderId || 0);
  const eventType = event.event || "unknown";
  const eventId = event.id || `${eventType}:${payment?.id || crypto.createHash("sha256").update(rawBody).digest("hex")}`;
  const webhookEvent = await webhookEventRepository.createEvent({
    provider: "RAZORPAY",
    eventId,
    eventType,
    orderId: orderId || null,
    rawPayload: event,
  });

  if (webhookEvent.duplicate) {
    return { handled: false, duplicate: true, event: eventType, orderId: orderId || null };
  }

  try {
    if (!orderId || !payment?.id) {
      await webhookEventRepository.markProcessed("RAZORPAY", eventId, orderId || null);
      return { handled: false, event: eventType };
    }

    if (eventType === "payment.captured" || eventType === "order.paid") {
      await orderRepository.markPaid(orderId, payment.id, event);
      await recordCouponUsageIfNeeded(orderId);
      await webhookEventRepository.markProcessed("RAZORPAY", eventId, orderId);
      return { handled: true, event: eventType, orderId };
    }

    if (eventType === "payment.failed") {
      await orderRepository.markPaymentFailed(orderId, payment.id, event);
      await webhookEventRepository.markProcessed("RAZORPAY", eventId, orderId);
      return { handled: true, event: eventType, orderId };
    }

    await webhookEventRepository.markProcessed("RAZORPAY", eventId, orderId);
    return { handled: false, event: eventType, orderId };
  } catch (error) {
    await webhookEventRepository.markFailed("RAZORPAY", eventId, error instanceof Error ? error.message : "Webhook processing failed.", orderId || null);
    throw error;
  }
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
  markPaymentFailedByUser,
  handleRazorpayWebhook,
};
