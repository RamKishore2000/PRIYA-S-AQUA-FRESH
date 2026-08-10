const { pool } = require("../config/database");

function mapProductRows(rows) {
  const products = new Map();

  for (const row of rows) {
    if (!products.has(row.id)) {
      products.set(row.id, {
        id: row.id,
        name: row.name,
        slug: row.slug,
        sku: row.sku,
        description: row.description,
        rating: Number(row.rating),
        reviewCount: Number(row.review_count),
        status: row.status,
        category: {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
        },
        prices: {
          customerOriginalPrice: Number(row.customer_original_price),
          customerSellingPrice: Number(row.customer_selling_price),
          dealerOriginalPrice: Number(row.dealer_original_price),
          dealerSellingPrice: Number(row.dealer_selling_price),
        },
        images: [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }

    if (row.image_id) {
      products.get(row.id).images.push({
        id: row.image_id,
        imageUrl: row.image_url,
        altText: row.alt_text,
        sortOrder: row.sort_order,
        isPrimary: Boolean(row.is_primary),
      });
    }
  }

  return Array.from(products.values());
}

const productSelect = `
  SELECT p.id, p.category_id, p.name, p.slug, p.sku, p.description, p.rating, p.review_count, p.status, p.created_at, p.updated_at,
         c.name AS category_name, c.slug AS category_slug,
         pp.customer_original_price, pp.customer_selling_price, pp.dealer_original_price, pp.dealer_selling_price,
         pi.id AS image_id, pi.image_url, pi.alt_text, pi.sort_order, pi.is_primary
  FROM products p
  INNER JOIN categories c ON c.id = p.category_id
  INNER JOIN product_prices pp ON pp.product_id = p.id
  LEFT JOIN product_images pi ON pi.product_id = p.id
`;

async function findAll({ includeInactive = false, categorySlug, searchTerm } = {}) {
  const conditions = [];
  const params = [];

  if (!includeInactive) {
    conditions.push("p.status = 'ACTIVE'");
    conditions.push("c.status = 'ACTIVE'");
  }
  if (categorySlug) {
    conditions.push("c.slug = ?");
    params.push(categorySlug);
  }
  if (searchTerm) {
    conditions.push("(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ? OR c.name LIKE ?)");
    const likeTerm = `%${searchTerm}%`;
    params.push(likeTerm, likeTerm, likeTerm, likeTerm);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.execute(
    `${productSelect}
     ${where}
     ORDER BY p.created_at DESC, pi.sort_order ASC, pi.id ASC`,
    params,
  );
  return mapProductRows(rows);
}

async function findById(id) {
  const [rows] = await pool.execute(
    `${productSelect}
     WHERE p.id = ?
     ORDER BY pi.sort_order ASC, pi.id ASC`,
    [id],
  );
  return mapProductRows(rows)[0] || null;
}

async function findBySlug(slug) {
  const [rows] = await pool.execute(
    `${productSelect}
     WHERE p.slug = ?
     ORDER BY pi.sort_order ASC, pi.id ASC`,
    [slug],
  );
  return mapProductRows(rows)[0] || null;
}

async function findBySku(sku) {
  const [rows] = await pool.execute("SELECT id, sku FROM products WHERE sku = ? LIMIT 1", [sku]);
  return rows[0] || null;
}

async function createProduct(payload) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [productResult] = await connection.execute(
      `INSERT INTO products (category_id, name, slug, sku, description, rating, review_count, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [payload.categoryId, payload.name, payload.slug, payload.sku, payload.description, payload.rating, payload.reviewCount, payload.status],
    );
    const productId = productResult.insertId;

    await connection.execute(
      `INSERT INTO product_prices
       (product_id, customer_original_price, customer_selling_price, dealer_original_price, dealer_selling_price)
       VALUES (?, ?, ?, ?, ?)`,
      [
        productId,
        payload.customerOriginalPrice,
        payload.customerSellingPrice,
        payload.dealerOriginalPrice,
        payload.dealerSellingPrice,
      ],
    );

    await insertImages(connection, productId, payload.images || [], payload.name);
    await connection.commit();
    return findById(productId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateProduct(id, payload) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE products
       SET category_id = ?, name = ?, slug = ?, sku = ?, description = ?, rating = ?, review_count = ?, status = ?
       WHERE id = ?`,
      [payload.categoryId, payload.name, payload.slug, payload.sku, payload.description, payload.rating, payload.reviewCount, payload.status, id],
    );

    await connection.execute(
      `UPDATE product_prices
       SET customer_original_price = ?, customer_selling_price = ?, dealer_original_price = ?, dealer_selling_price = ?
       WHERE product_id = ?`,
      [
        payload.customerOriginalPrice,
        payload.customerSellingPrice,
        payload.dealerOriginalPrice,
        payload.dealerSellingPrice,
        id,
      ],
    );

    await connection.execute("DELETE FROM product_images WHERE product_id = ?", [id]);
    await insertImages(connection, id, payload.images || [], payload.name);
    await connection.commit();
    return findById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function insertImages(connection, productId, images, productName) {
  for (const [index, image] of images.entries()) {
    await connection.execute(
      `INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
       VALUES (?, ?, ?, ?, ?)`,
      [productId, image.imageUrl, image.altText || productName, index, index === 0],
    );
  }
}

async function deleteProduct(id) {
  const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  findBySlug,
  findBySku,
  createProduct,
  updateProduct,
  deleteProduct,
};
