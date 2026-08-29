const { pool } = require("../config/database");

function mapCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    imageUrl: row.image_url,
    description: row.description,
    status: row.status,
    productsCount: row.products_count ?? 0,
    subcategories: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSubcategory(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    status: row.status,
    productsCount: row.products_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function attachSubcategories(categories, { includeInactive = false } = {}) {
  if (!categories.length) return categories;
  const categoryIds = categories.map((category) => category.id);
  const placeholders = categoryIds.map(() => "?").join(", ");
  const statusWhere = includeInactive ? "" : "AND sc.status = 'ACTIVE'";
  const [rows] = await pool.execute(
    `SELECT sc.id, sc.category_id, sc.name, sc.slug, sc.image_url, sc.description, sc.status, sc.created_at, sc.updated_at,
            COUNT(p.id) AS products_count
     FROM subcategories sc
     LEFT JOIN products p ON p.subcategory_id = sc.id
     WHERE sc.category_id IN (${placeholders}) ${statusWhere}
     GROUP BY sc.id
     ORDER BY sc.created_at DESC`,
    categoryIds,
  );
  const byCategory = new Map();
  for (const row of rows) {
    const list = byCategory.get(row.category_id) || [];
    list.push(mapSubcategory(row));
    byCategory.set(row.category_id, list);
  }
  return categories.map((category) => ({ ...category, subcategories: byCategory.get(category.id) || [] }));
}

async function findAll({ includeInactive = false } = {}) {
  const where = includeInactive ? "" : "WHERE c.status = 'ACTIVE'";
  const [rows] = await pool.execute(
    `SELECT c.id, c.name, c.slug, c.image_url, c.description, c.status, c.created_at, c.updated_at,
            COUNT(p.id) AS products_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     ${where}
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
  );
  return attachSubcategories(rows.map(mapCategory), { includeInactive });
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT c.id, c.name, c.slug, c.image_url, c.description, c.status, c.created_at, c.updated_at,
            COUNT(p.id) AS products_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     WHERE c.id = ?
     GROUP BY c.id
     LIMIT 1`,
    [id],
  );
  const categories = await attachSubcategories(rows.map(mapCategory), { includeInactive: true });
  return categories[0] || null;
}

async function findBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT c.id, c.name, c.slug, c.image_url, c.description, c.status, c.created_at, c.updated_at,
            COUNT(p.id) AS products_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     WHERE c.slug = ?
     GROUP BY c.id
     LIMIT 1`,
    [slug],
  );
  const categories = await attachSubcategories(rows.map(mapCategory), { includeInactive: true });
  return categories[0] || null;
}

async function createCategory({ name, slug, imageUrl, description, status }) {
  const [result] = await pool.execute(
    `INSERT INTO categories (name, slug, image_url, description, status)
     VALUES (?, ?, ?, ?, ?)`,
    [name, slug, imageUrl || null, description || null, status],
  );
  return findById(result.insertId);
}

async function updateCategory(id, { name, slug, imageUrl, description, status }) {
  await pool.execute(
    `UPDATE categories
     SET name = ?, slug = ?, image_url = ?, description = ?, status = ?
     WHERE id = ?`,
    [name, slug, imageUrl || null, description || null, status, id],
  );
  return findById(id);
}

async function deleteCategory(id) {
  const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};