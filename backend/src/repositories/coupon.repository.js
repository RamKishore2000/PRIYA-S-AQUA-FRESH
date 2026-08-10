const { pool } = require("../config/database");

function mapCoupon(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    minimumOrderAmount: Number(row.minimum_order_amount),
    maximumDiscountAmount: row.maximum_discount_amount === null ? null : Number(row.maximum_discount_amount),
    startAt: row.start_at,
    endAt: row.end_at,
    usageLimit: row.usage_limit,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAll() {
  const [rows] = await pool.execute("SELECT * FROM coupons ORDER BY created_at DESC");
  return rows.map(mapCoupon);
}

async function findById(id) {
  const [rows] = await pool.execute("SELECT * FROM coupons WHERE id = ? LIMIT 1", [id]);
  return mapCoupon(rows[0]);
}

async function findByCode(code) {
  const [rows] = await pool.execute("SELECT * FROM coupons WHERE code = ? LIMIT 1", [code]);
  return mapCoupon(rows[0]);
}

async function createCoupon(payload) {
  const [result] = await pool.execute(
    `INSERT INTO coupons
     (code, discount_type, discount_value, minimum_order_amount, maximum_discount_amount, start_at, end_at, usage_limit, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [payload.code, payload.discountType, payload.discountValue, payload.minimumOrderAmount, payload.maximumDiscountAmount, payload.startAt, payload.endAt, payload.usageLimit, payload.status],
  );
  return findById(result.insertId);
}

async function updateCoupon(id, payload) {
  await pool.execute(
    `UPDATE coupons
     SET code = ?, discount_type = ?, discount_value = ?, minimum_order_amount = ?, maximum_discount_amount = ?,
         start_at = ?, end_at = ?, usage_limit = ?, status = ?
     WHERE id = ?`,
    [payload.code, payload.discountType, payload.discountValue, payload.minimumOrderAmount, payload.maximumDiscountAmount, payload.startAt, payload.endAt, payload.usageLimit, payload.status, id],
  );
  return findById(id);
}

async function deleteCoupon(id) {
  const [result] = await pool.execute("DELETE FROM coupons WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

async function updateStatus(id, status) {
  await pool.execute("UPDATE coupons SET status = ? WHERE id = ?", [status, id]);
  return findById(id);
}

async function countUsages(couponId) {
  const [rows] = await pool.execute("SELECT COUNT(*) AS total FROM coupon_usages WHERE coupon_id = ?", [couponId]);
  return Number(rows[0]?.total || 0);
}

async function createUsage(connection, payload) {
  await connection.execute(
    `INSERT INTO coupon_usages (coupon_id, user_id, order_id, discount_amount)
     VALUES (?, ?, ?, ?)`,
    [payload.couponId, payload.userId, payload.orderId, payload.discountAmount],
  );
}

module.exports = {
  findAll,
  findById,
  findByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  updateStatus,
  countUsages,
  createUsage,
};
