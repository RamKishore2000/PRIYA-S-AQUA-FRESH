const { pool } = require("../config/database");

const categories = [
  {
    name: "Alkaline Water Purifiers",
    slug: "alkaline-water-purifiers",
    imageUrl: "/images/hero/alkaline-purifier.png",
    description: "Alkaline water purifiers for healthy everyday drinking water.",
  },
  {
    name: "RO Water Purifiers",
    slug: "ro-water-purifiers",
    imageUrl: "/images/hero/ro-purifier.png",
    description: "RO water purifiers for safe, clean drinking water.",
  },
  {
    name: "Commercial Water Purifiers",
    slug: "commercial-water-purifiers",
    imageUrl: "/images/hero/commercial-ro.png",
    description: "High-capacity purification systems for business use.",
  },
  {
    name: "Electronics",
    slug: "electronics",
    imageUrl: "/images/hero/smart-tv.png",
    description: "Smart electronics and home essentials.",
  },
  {
    name: "Spare Parts",
    slug: "spare-parts",
    imageUrl: "/images/hero/spare-parts.png",
    description: "Filters, fittings, and purifier service parts.",
  },
];

const products = [
  {
    categorySlug: "alkaline-water-purifiers",
    name: "Priyas AquaFresh Alkaline Pro",
    slug: "priyas-aquafresh-alkaline-pro",
    sku: "PYA-ALK-001",
    description: "Advanced alkaline purifier designed for fresh-tasting water, balanced minerals, and reliable daily use.",
    rating: 4.8,
    reviewCount: 42,
    customerOriginalPrice: 24999,
    customerSellingPrice: 21999,
    dealerOriginalPrice: 22999,
    dealerSellingPrice: 19999,
    imageUrl: "/images/hero/alkaline-purifier.png",
  },
  {
    categorySlug: "ro-water-purifiers",
    name: "Priyas AquaFresh RO Classic",
    slug: "priyas-aquafresh-ro-classic",
    sku: "PYA-RO-001",
    description: "Compact RO water purifier for homes, built for dependable filtration and clean drinking water.",
    rating: 4.7,
    reviewCount: 36,
    customerOriginalPrice: 19999,
    customerSellingPrice: 16999,
    dealerOriginalPrice: 18499,
    dealerSellingPrice: 15499,
    imageUrl: "/images/hero/ro-purifier.png",
  },
  {
    categorySlug: "commercial-water-purifiers",
    name: "Priyas Commercial RO 100 LPH",
    slug: "priyas-commercial-ro-100-lph",
    sku: "PYA-COM-100",
    description: "Commercial RO purification system for offices, hotels, schools, hospitals, and high-usage facilities.",
    rating: 4.9,
    reviewCount: 28,
    customerOriginalPrice: 85000,
    customerSellingPrice: 78999,
    dealerOriginalPrice: 79999,
    dealerSellingPrice: 73500,
    imageUrl: "/images/hero/commercial-ro.png",
  },
  {
    categorySlug: "electronics",
    name: "Priyas Smart LED TV 32 Inch",
    slug: "priyas-smart-led-tv-32-inch",
    sku: "PYA-TV-032",
    description: "Smart LED TV with vivid display quality and practical connectivity for everyday home entertainment.",
    rating: 4.6,
    reviewCount: 31,
    customerOriginalPrice: 17999,
    customerSellingPrice: 14999,
    dealerOriginalPrice: 16499,
    dealerSellingPrice: 13499,
    imageUrl: "/images/hero/smart-tv.png",
  },
  {
    categorySlug: "spare-parts",
    name: "Priyas RO Service Filter Kit",
    slug: "priyas-ro-service-filter-kit",
    sku: "PYA-SPARE-001",
    description: "Genuine RO filter and spare-part kit for routine purifier service and maintenance.",
    rating: 4.7,
    reviewCount: 24,
    customerOriginalPrice: 3499,
    customerSellingPrice: 2999,
    dealerOriginalPrice: 3199,
    dealerSellingPrice: 2599,
    imageUrl: "/images/hero/spare-parts.png",
  },
];

async function seedProducts() {
  const connection = await pool.getConnection();
  let insertedProducts = 0;

  try {
    await connection.beginTransaction();

    for (const category of categories) {
      await connection.execute(
        `INSERT INTO categories (name, slug, image_url, description, status)
         VALUES (?, ?, ?, ?, 'ACTIVE')
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           image_url = COALESCE(image_url, VALUES(image_url)),
           description = COALESCE(description, VALUES(description)),
           status = 'ACTIVE'`,
        [category.name, category.slug, category.imageUrl, category.description],
      );
    }

    const categoryIds = await getCategoryIds(connection);

    for (const product of products) {
      const [existing] = await connection.execute("SELECT id FROM products WHERE sku = ? OR slug = ? LIMIT 1", [product.sku, product.slug]);
      if (existing.length > 0) continue;

      const categoryId = categoryIds.get(product.categorySlug);
      if (!categoryId) {
        throw new Error(`Missing category for ${product.categorySlug}`);
      }

      const [productResult] = await connection.execute(
        `INSERT INTO products (category_id, name, slug, sku, description, rating, review_count, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
        [categoryId, product.name, product.slug, product.sku, product.description, product.rating, product.reviewCount],
      );
      const productId = productResult.insertId;

      await connection.execute(
        `INSERT INTO product_prices
         (product_id, customer_original_price, customer_selling_price, dealer_original_price, dealer_selling_price)
         VALUES (?, ?, ?, ?, ?)`,
        [
          productId,
          product.customerOriginalPrice,
          product.customerSellingPrice,
          product.dealerOriginalPrice,
          product.dealerSellingPrice,
        ],
      );

      await connection.execute(
        `INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
         VALUES (?, ?, ?, 0, TRUE)`,
        [productId, product.imageUrl, product.name],
      );

      insertedProducts += 1;
    }

    await connection.commit();
    console.log(`Seed products complete. Inserted ${insertedProducts} new products.`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

async function getCategoryIds(connection) {
  const [rows] = await connection.execute("SELECT id, slug FROM categories WHERE slug IN (?, ?, ?, ?, ?)", categories.map((category) => category.slug));
  return new Map(rows.map((row) => [row.slug, row.id]));
}

if (require.main === module) {
  seedProducts().catch((error) => {
    console.error("Product seeding failed.");
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = seedProducts;
