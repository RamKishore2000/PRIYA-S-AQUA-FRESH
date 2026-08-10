const { pool } = require("../config/database");

function mapTestimonial(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    customerName: row.customer_name,
    role: row.role,
    rating: Number(row.rating),
    message: row.message,
    imageUrl: row.image_url,
    sortOrder: Number(row.sort_order || 0),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAll({ includeInactive = false } = {}) {
  const where = includeInactive ? "" : "WHERE status = 'ACTIVE'";
  const [rows] = await pool.execute(
    `SELECT * FROM testimonials ${where} ORDER BY sort_order ASC, created_at DESC`,
  );
  return rows.map(mapTestimonial);
}

async function findById(id) {
  const [rows] = await pool.execute("SELECT * FROM testimonials WHERE id = ? LIMIT 1", [id]);
  return mapTestimonial(rows[0]);
}

async function createTestimonial(payload) {
  const [result] = await pool.execute(
    `INSERT INTO testimonials
     (customer_name, role, rating, message, image_url, sort_order, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [payload.customerName, payload.role, payload.rating, payload.message, payload.imageUrl, payload.sortOrder, payload.status],
  );
  return findById(result.insertId);
}

async function updateTestimonial(id, payload) {
  await pool.execute(
    `UPDATE testimonials
     SET customer_name = ?, role = ?, rating = ?, message = ?, image_url = ?, sort_order = ?, status = ?
     WHERE id = ?`,
    [payload.customerName, payload.role, payload.rating, payload.message, payload.imageUrl, payload.sortOrder, payload.status, id],
  );
  return findById(id);
}

async function updateStatus(id, status) {
  await pool.execute("UPDATE testimonials SET status = ? WHERE id = ?", [status, id]);
  return findById(id);
}

async function deleteTestimonial(id) {
  const [result] = await pool.execute("DELETE FROM testimonials WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createTestimonial,
  updateTestimonial,
  updateStatus,
  deleteTestimonial,
};
