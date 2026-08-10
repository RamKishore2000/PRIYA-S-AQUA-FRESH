const { pool } = require("../config/database");

function mapBanner(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    imageUrl: row.image_url,
    buttonText: row.button_label,
    buttonLink: row.button_url,
    themeColor: row.theme_color,
    glowColor: row.glow_color,
    sortOrder: Number(row.sort_order || 0),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAll({ includeInactive = false } = {}) {
  const where = includeInactive ? "" : "WHERE status = 'ACTIVE'";
  const [rows] = await pool.execute(
    `SELECT * FROM banners ${where} ORDER BY sort_order ASC, created_at DESC`,
  );
  return rows.map(mapBanner);
}

async function findById(id) {
  const [rows] = await pool.execute("SELECT * FROM banners WHERE id = ? LIMIT 1", [id]);
  return mapBanner(rows[0]);
}

async function createBanner(payload) {
  const [result] = await pool.execute(
    `INSERT INTO banners
     (title, subtitle, description, image_url, button_label, button_url, theme_color, glow_color, sort_order, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.title,
      payload.subtitle,
      payload.description,
      payload.imageUrl,
      payload.buttonText,
      payload.buttonLink,
      payload.themeColor,
      payload.glowColor,
      payload.sortOrder,
      payload.status,
    ],
  );
  return findById(result.insertId);
}

async function updateBanner(id, payload) {
  await pool.execute(
    `UPDATE banners
     SET title = ?, subtitle = ?, description = ?, image_url = ?, button_label = ?, button_url = ?,
         theme_color = ?, glow_color = ?, sort_order = ?, status = ?
     WHERE id = ?`,
    [
      payload.title,
      payload.subtitle,
      payload.description,
      payload.imageUrl,
      payload.buttonText,
      payload.buttonLink,
      payload.themeColor,
      payload.glowColor,
      payload.sortOrder,
      payload.status,
      id,
    ],
  );
  return findById(id);
}

async function updateStatus(id, status) {
  await pool.execute("UPDATE banners SET status = ? WHERE id = ?", [status, id]);
  return findById(id);
}

async function deleteBanner(id) {
  const [result] = await pool.execute("DELETE FROM banners WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  createBanner,
  updateBanner,
  updateStatus,
  deleteBanner,
};
