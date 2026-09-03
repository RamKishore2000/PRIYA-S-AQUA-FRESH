const { pool } = require("../config/database");

function mapOrderRows(rows) {
  const orders = new Map();
  for (const row of rows) {
    if (!orders.has(row.id)) {
      const paymentMethod = row.payment_method || "ONLINE";
      const totalAmount = Number(row.total_amount || 0);
      const advanceAmount = Number(row.advance_amount || 0);
      const balanceAmount = Number(row.balance_amount || 0);
      const paidAmount = row.payment_status === "PAID"
        ? totalAmount
        : row.payment_status === "PARTIAL"
          ? advanceAmount
          : 0;
      orders.set(row.id, {
        id: row.id,
        orderNumber: row.order_number,
        subtotalAmount: Number(row.subtotal_amount),
        discountAmount: Number(row.discount_amount),
        shippingAmount: Number(row.shipping_amount),
        totalAmount,
        paymentStatus: row.payment_status,
        paymentMethod,
        paymentType: paymentMethod === "COD" ? "ADVANCE_PAYMENT" : "FULL_PAYMENT",
        advanceAmount,
        paidAmount,
        balanceAmount,
        orderStatus: row.order_status,
        customer: row.customer_id
          ? {
              id: row.customer_id,
              fullName: row.customer_name,
              mobile: row.customer_mobile,
              email: row.customer_email,
              role: row.customer_role,
            }
          : null,
        shippingAddress: typeof row.shipping_address_json === "string" ? JSON.parse(row.shipping_address_json) : row.shipping_address_json,
        createdAt: row.created_at,
        items: [],
      });
    }
    if (row.item_id) {
      orders.get(row.id).items.push({
        id: row.item_id,
        productId: row.product_id,
        productName: row.product_name,
        productSku: row.product_sku,
        productSlug: row.product_slug,
        imageUrl: row.image_url,
        selectedColorName: row.selected_color_name || "",
        selectedColorCode: row.selected_color_code || "",
        selectedImageUrl: row.selected_image_url || "",
        selectedVariantKey: row.selected_variant_key || "",
        unitPrice: Number(row.unit_price),
        quantity: Number(row.quantity),
        lineTotal: Number(row.line_total),
      });
    }
  }
  return Array.from(orders.values());
}

const orderSelect = `
  SELECT o.id, o.order_number, o.subtotal_amount, o.discount_amount, o.shipping_amount, o.total_amount,
         o.payment_status, o.payment_method, o.advance_amount, o.balance_amount, o.order_status, o.shipping_address_json, o.created_at,
         u.id AS customer_id, u.full_name AS customer_name, u.mobile AS customer_mobile, u.email AS customer_email, u.role AS customer_role,
         oi.id AS item_id, oi.product_id, oi.product_name, oi.product_sku, oi.selected_color_name, oi.selected_color_code, oi.selected_image_url, oi.selected_variant_key, oi.unit_price, oi.quantity, oi.line_total,
         p.slug AS product_slug,
         COALESCE(oi.selected_image_url, (
           SELECT image_url
           FROM product_images pi
           WHERE pi.product_id = oi.product_id
           ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
           LIMIT 1
         )) AS image_url
  FROM orders o
  INNER JOIN users u ON u.id = o.user_id
  LEFT JOIN order_items oi ON oi.order_id = o.id
  LEFT JOIN products p ON p.id = oi.product_id
`;

async function findAll() {
  const [rows] = await pool.execute(
    `${orderSelect}
     ORDER BY o.created_at DESC, oi.id ASC`,
  );
  return mapOrderRows(rows);
}

async function findByUser(userId) {
  const [rows] = await pool.execute(
    `${orderSelect}
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC, oi.id ASC`,
    [userId],
  );
  return mapOrderRows(rows);
}

async function findById(orderId) {
  const [rows] = await pool.execute(
    `${orderSelect}
     WHERE o.id = ?
     ORDER BY oi.id ASC`,
    [orderId],
  );
  return mapOrderRows(rows)[0] || null;
}

async function findByIdForUser(orderId, userId) {
  const [rows] = await pool.execute(
    `${orderSelect}
     WHERE o.id = ? AND o.user_id = ?
     ORDER BY oi.id ASC`,
    [orderId, userId],
  );
  return mapOrderRows(rows)[0] || null;
}

async function updateStatus(orderId, status) {
  await pool.execute("UPDATE orders SET order_status = ? WHERE id = ?", [status, orderId]);
  return findById(orderId);
}

async function paymentExists(providerPaymentId) {
  if (!providerPaymentId) return false;
  const [rows] = await pool.execute(
    "SELECT id FROM payments WHERE provider = 'RAZORPAY' AND provider_payment_id = ? LIMIT 1",
    [providerPaymentId],
  );
  return rows.length > 0;
}

async function markPaid(orderId, paymentId, rawResponse) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [existingPayments] = await connection.execute(
      "SELECT id FROM payments WHERE provider = 'RAZORPAY' AND provider_payment_id = ? LIMIT 1",
      [paymentId],
    );
    if (existingPayments.length) {
      await connection.commit();
      return;
    }

    const [orders] = await connection.execute(
      "SELECT payment_method, total_amount, advance_amount, balance_amount FROM orders WHERE id = ? LIMIT 1",
      [orderId],
    );
    const order = orders[0];
    const paidAmount = Number(order?.payment_method === "COD" ? order.advance_amount : order?.total_amount || 0);
    const nextPaymentStatus = order?.payment_method === "COD" && Number(order.balance_amount || 0) > 0 ? "PARTIAL" : "PAID";
    await connection.execute(
      "UPDATE orders SET payment_status = ?, order_status = 'CONFIRMED' WHERE id = ?",
      [nextPaymentStatus, orderId],
    );
    await connection.execute(
      `INSERT INTO payments (order_id, provider, provider_payment_id, amount, status, raw_response)
       SELECT id, 'RAZORPAY', ?, ?, 'PAID', ?
       FROM orders WHERE id = ?`,
      [paymentId, paidAmount, JSON.stringify(rawResponse), orderId],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function markPaymentFailed(orderId, paymentId, rawResponse) {
  if (await paymentExists(paymentId)) return;
  await pool.execute(
    "UPDATE orders SET payment_status = 'FAILED' WHERE id = ? AND payment_status = 'PENDING'",
    [orderId],
  );
  await pool.execute(
    `INSERT INTO payments (order_id, provider, provider_payment_id, amount, status, raw_response)
     SELECT id, 'RAZORPAY', ?, 0, 'FAILED', ?
     FROM orders WHERE id = ?`,
    [paymentId, JSON.stringify(rawResponse), orderId],
  );
}

async function markPaymentFailedWithoutProviderId(orderId, rawResponse) {
  await pool.execute(
    "UPDATE orders SET payment_status = 'FAILED' WHERE id = ? AND payment_status = 'PENDING'",
    [orderId],
  );
  await pool.execute(
    `INSERT INTO payments (order_id, provider, provider_payment_id, amount, status, raw_response)
     SELECT id, 'RAZORPAY', NULL, 0, 'FAILED', ?
     FROM orders WHERE id = ?`,
    [JSON.stringify(rawResponse || { reason: "checkout_dismissed" }), orderId],
  );
}

async function findCouponIdByOrderId(orderId) {
  const [rows] = await pool.execute("SELECT coupon_id, user_id, discount_amount FROM orders WHERE id = ? LIMIT 1", [orderId]);
  return rows[0] || null;
}

module.exports = {
  findAll,
  findByUser,
  findById,
  findByIdForUser,
  updateStatus,
  markPaid,
  markPaymentFailed,
  markPaymentFailedWithoutProviderId,
  findCouponIdByOrderId,
  pool,
};
