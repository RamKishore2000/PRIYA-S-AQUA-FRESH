const { pool } = require("../config/database");

function mapReview(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    role: row.role,
    rating: Number(row.rating),
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAll({ includeHidden = false, limit = 20 } = {}) {
  const where = includeHidden ? "" : "WHERE status = 'VISIBLE'";
  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 100));
  const [rows] = await pool.query(
    `SELECT * FROM reviews ${where} ORDER BY created_at DESC LIMIT ${safeLimit}`,
  );
  return rows.map(mapReview);
}

async function findById(id) {
  const [rows] = await pool.execute("SELECT * FROM reviews WHERE id = ? LIMIT 1", [id]);
  return mapReview(rows[0]);
}

async function createReview(payload) {
  const [result] = await pool.execute(
    `INSERT INTO reviews (user_id, customer_name, role, rating, message, status)
     VALUES (?, ?, ?, ?, ?, 'VISIBLE')`,
    [payload.userId, payload.customerName, payload.role, payload.rating, payload.message],
  );
  return findById(result.insertId);
}

async function updateStatus(id, status) {
  await pool.execute("UPDATE reviews SET status = ? WHERE id = ?", [status, id]);
  return findById(id);
}

async function deleteReview(id) {
  const [result] = await pool.execute("DELETE FROM reviews WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createReview,
  updateStatus,
  deleteReview,
};
