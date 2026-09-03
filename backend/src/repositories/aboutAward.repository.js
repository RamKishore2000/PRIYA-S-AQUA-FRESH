const { pool } = require("../config/database");

function mapAward(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
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
    `SELECT * FROM about_awards ${where} ORDER BY sort_order ASC, created_at DESC`,
  );
  return rows.map(mapAward);
}

async function findById(id) {
  const [rows] = await pool.execute("SELECT * FROM about_awards WHERE id = ? LIMIT 1", [id]);
  return mapAward(rows[0]);
}

async function createAward(payload) {
  const [result] = await pool.execute(
    `INSERT INTO about_awards (title, description, image_url, sort_order, status)
     VALUES (?, ?, ?, ?, ?)`,
    [payload.title, payload.description, payload.imageUrl, payload.sortOrder, payload.status],
  );
  return findById(result.insertId);
}

async function updateAward(id, payload) {
  await pool.execute(
    `UPDATE about_awards
     SET title = ?, description = ?, image_url = ?, sort_order = ?, status = ?
     WHERE id = ?`,
    [payload.title, payload.description, payload.imageUrl, payload.sortOrder, payload.status, id],
  );
  return findById(id);
}

async function updateStatus(id, status) {
  await pool.execute("UPDATE about_awards SET status = ? WHERE id = ?", [status, id]);
  return findById(id);
}

async function deleteAward(id) {
  const [result] = await pool.execute("DELETE FROM about_awards WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createAward,
  updateAward,
  updateStatus,
  deleteAward,
};
