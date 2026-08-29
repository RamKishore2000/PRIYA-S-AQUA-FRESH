const { pool } = require("../config/database");

function mapSubcategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    categoryId: row.category_id,
    category: row.category_id ? {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
    } : undefined,
    name: row.name,
    slug: row.slug,
    imageUrl: row.image_url,
    description: row.description,
    status: row.status,
    productsCount: row.products_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const subcategorySelect = `
  SELECT sc.id, sc.category_id, sc.name, sc.slug, sc.image_url, sc.description, sc.status, sc.created_at, sc.updated_at,
         c.name AS category_name, c.slug AS category_slug,
         COUNT(p.id) AS products_count
  FROM subcategories sc
  INNER JOIN categories c ON c.id = sc.category_id
  LEFT JOIN products p ON p.subcategory_id = sc.id
`;

async function findAll({ includeInactive = false, categoryId, categorySlug } = {}) {
  const conditions = [];
  const params = [];

  if (!includeInactive) {
    conditions.push("sc.status = 'ACTIVE'");
    conditions.push("c.status = 'ACTIVE'");
  }
  if (categoryId) {
    conditions.push("sc.category_id = ?");
    params.push(categoryId);
  }
  if (categorySlug) {
    conditions.push("c.slug = ?");
    params.push(categorySlug);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.execute(
    `${subcategorySelect}
     ${where}
     GROUP BY sc.id
     ORDER BY c.name ASC, sc.created_at DESC`,
    params,
  );
  return rows.map(mapSubcategory);
}

async function findById(id) {
  const [rows] = await pool.execute(
    `${subcategorySelect}
     WHERE sc.id = ?
     GROUP BY sc.id
     LIMIT 1`,
    [id],
  );
  return mapSubcategory(rows[0]);
}

async function findBySlug(slug) {
  const [rows] = await pool.execute(
    `${subcategorySelect}
     WHERE sc.slug = ?
     GROUP BY sc.id
     LIMIT 1`,
    [slug],
  );
  return mapSubcategory(rows[0]);
}

async function findByCategoryAndSlug(categoryId, slug) {
  const [rows] = await pool.execute(
    `${subcategorySelect}
     WHERE sc.category_id = ? AND sc.slug = ?
     GROUP BY sc.id
     LIMIT 1`,
    [categoryId, slug],
  );
  return mapSubcategory(rows[0]);
}

async function createSubcategory({ categoryId, name, slug, imageUrl, description, status }) {
  const [result] = await pool.execute(
    `INSERT INTO subcategories (category_id, name, slug, image_url, description, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [categoryId, name, slug, imageUrl || null, description || null, status],
  );
  return findById(result.insertId);
}

async function updateSubcategory(id, { categoryId, name, slug, imageUrl, description, status }) {
  await pool.execute(
    `UPDATE subcategories
     SET category_id = ?, name = ?, slug = ?, image_url = ?, description = ?, status = ?
     WHERE id = ?`,
    [categoryId, name, slug, imageUrl || null, description || null, status, id],
  );
  return findById(id);
}

async function deleteSubcategory(id) {
  const [result] = await pool.execute("DELETE FROM subcategories WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findBySlug,
  findByCategoryAndSlug,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};