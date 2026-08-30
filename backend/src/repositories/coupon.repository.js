const { pool } = require("../config/database");

function mapCoupon(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    minimumOrderAmount: Number(row.minimum_order_amount),
    maximumDiscountAmount: row.maximum_discount_amount === null ? null : Number(row.maximum_discount_amount),
    startAt: row.start_at,
    endAt: row.end_at,
    usageLimit: row.usage_limit,
    sortOrder: Number(row.sort_order || 0),
    status: row.status,
    applicableProductIds: [],
    applicableProducts: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function attachCouponProducts(coupons) {
  const items = Array.isArray(coupons) ? coupons : coupons ? [coupons] : [];
  if (!items.length) return coupons;

  const ids = items.map((coupon) => coupon.id);
  const placeholders = ids.map(() => "?").join(", ");
  const [rows] = await pool.execute(
    `SELECT cp.coupon_id, p.id AS product_id, p.name, p.sku
     FROM coupon_products cp
     INNER JOIN products p ON p.id = cp.product_id
     WHERE cp.coupon_id IN (${placeholders})
     ORDER BY p.name ASC`,
    ids,
  );

  const byCoupon = new Map();
  for (const row of rows) {
    if (!byCoupon.has(row.coupon_id)) byCoupon.set(row.coupon_id, []);
    byCoupon.get(row.coupon_id).push({ id: row.product_id, name: row.name, sku: row.sku });
  }

  for (const coupon of items) {
    const products = byCoupon.get(coupon.id) || [];
    coupon.applicableProducts = products;
    coupon.applicableProductIds = products.map((product) => product.id);
  }

  return coupons;
}

async function findAll() {
  const [rows] = await pool.execute("SELECT * FROM coupons ORDER BY sort_order ASC, created_at DESC");
  return attachCouponProducts(rows.map(mapCoupon));
}

async function findActivePublic() {
  const [rows] = await pool.execute(
    `SELECT c.*, COUNT(cu.id) AS used_count
     FROM coupons c
     LEFT JOIN coupon_usages cu ON cu.coupon_id = c.id
     WHERE c.status = 'ACTIVE'
       AND NOW() BETWEEN c.start_at AND c.end_at
     GROUP BY c.id
     HAVING used_count < c.usage_limit
     ORDER BY c.sort_order ASC, c.created_at DESC`,
  );
  return attachCouponProducts(rows.map(mapCoupon));
}

async function findById(id) {
  const [rows] = await pool.execute("SELECT * FROM coupons WHERE id = ? LIMIT 1", [id]);
  return attachCouponProducts(mapCoupon(rows[0]));
}

async function findByCode(code) {
  const [rows] = await pool.execute("SELECT * FROM coupons WHERE code = ? LIMIT 1", [code]);
  return attachCouponProducts(mapCoupon(rows[0]));
}

async function replaceCouponProducts(connection, couponId, productIds = []) {
  await connection.execute("DELETE FROM coupon_products WHERE coupon_id = ?", [couponId]);
  const uniqueIds = [...new Set((productIds || []).map(Number).filter((id) => Number.isInteger(id) && id > 0))];
  for (const productId of uniqueIds) {
    await connection.execute(
      `INSERT IGNORE INTO coupon_products (coupon_id, product_id)
       VALUES (?, ?)`,
      [couponId, productId],
    );
  }
}

async function createCoupon(payload) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO coupons
       (code, title, subtitle, image_url, discount_type, discount_value, minimum_order_amount, maximum_discount_amount, start_at, end_at, usage_limit, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.code,
        payload.title,
        payload.subtitle,
        payload.imageUrl,
        payload.discountType,
        payload.discountValue,
        payload.minimumOrderAmount,
        payload.maximumDiscountAmount,
        payload.startAt,
        payload.endAt,
        payload.usageLimit,
        payload.sortOrder,
        payload.status,
      ],
    );
    await replaceCouponProducts(connection, result.insertId, payload.applicableProductIds);
    await connection.commit();
    return findById(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateCoupon(id, payload) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE coupons
       SET code = ?, title = ?, subtitle = ?, image_url = ?, discount_type = ?, discount_value = ?,
           minimum_order_amount = ?, maximum_discount_amount = ?, start_at = ?, end_at = ?,
           usage_limit = ?, sort_order = ?, status = ?
       WHERE id = ?`,
      [
        payload.code,
        payload.title,
        payload.subtitle,
        payload.imageUrl,
        payload.discountType,
        payload.discountValue,
        payload.minimumOrderAmount,
        payload.maximumDiscountAmount,
        payload.startAt,
        payload.endAt,
        payload.usageLimit,
        payload.sortOrder,
        payload.status,
        id,
      ],
    );
    await replaceCouponProducts(connection, id, payload.applicableProductIds);
    await connection.commit();
    return findById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
  findActivePublic,
  findById,
  findByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  updateStatus,
  countUsages,
  createUsage,
};