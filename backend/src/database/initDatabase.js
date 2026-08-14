const fs = require("fs/promises");
const path = require("path");
const env = require("../config/env");
const { createServerConnection } = require("../config/database");

async function initDatabase() {
  let connection;

  try {
    connection = await createServerConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.database}\``);
    await connection.query(`USE \`${env.db.database}\``);

    const schemaPath = path.resolve(__dirname, "schema.sql");
    const schemaSql = await fs.readFile(schemaPath, "utf8");
    await connection.query(schemaSql);
    await addColumnIfMissing(connection, "products", "rating", "DECIMAL(2,1) NOT NULL DEFAULT 0.0");
    await addColumnIfMissing(connection, "products", "review_count", "INT UNSIGNED NOT NULL DEFAULT 0");
    await addColumnIfMissing(connection, "testimonials", "role", "VARCHAR(80) NULL AFTER customer_name");
    await addColumnIfMissing(connection, "testimonials", "image_url", "VARCHAR(500) NULL AFTER message");
    await addColumnIfMissing(connection, "testimonials", "sort_order", "INT UNSIGNED NOT NULL DEFAULT 0 AFTER image_url");
    await addColumnIfMissing(connection, "banners", "description", "TEXT NULL AFTER subtitle");
    await addColumnIfMissing(connection, "banners", "theme_color", "VARCHAR(40) NULL AFTER button_url");
    await addColumnIfMissing(connection, "banners", "glow_color", "VARCHAR(80) NULL AFTER theme_color");
    await addColumnIfMissing(connection, "coupons", "title", "VARCHAR(160) NULL AFTER code");
    await addColumnIfMissing(connection, "coupons", "subtitle", "VARCHAR(255) NULL AFTER title");
    await addColumnIfMissing(connection, "coupons", "image_url", "VARCHAR(500) NULL AFTER subtitle");
    await addColumnIfMissing(connection, "coupons", "sort_order", "INT UNSIGNED NOT NULL DEFAULT 0 AFTER usage_limit");
    await addColumnIfMissing(connection, "orders", "payment_method", "ENUM('ONLINE', 'COD') NOT NULL DEFAULT 'ONLINE' AFTER order_status");
    await addColumnIfMissing(connection, "orders", "advance_amount", "DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER payment_method");
    await addColumnIfMissing(connection, "orders", "balance_amount", "DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER advance_amount");
    await normalizeOrdersTable(connection);
    await normalizeTestimonialsTable(connection);

    console.log(`Database initialized: ${env.db.database}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function normalizeOrdersTable(connection) {
  await connection.query(
    "ALTER TABLE `orders` MODIFY COLUMN `payment_status` ENUM('PENDING', 'PARTIAL', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING'",
  );
}

async function normalizeTestimonialsTable(connection) {
  await connection.query(
    "ALTER TABLE `testimonials` MODIFY COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE'",
  );
  await connection.query(
    "UPDATE `testimonials` SET `status` = CASE WHEN `status` = 'APPROVED' THEN 'ACTIVE' ELSE 'INACTIVE' END WHERE `status` IN ('PENDING', 'APPROVED', 'REJECTED')",
  );
  await connection.query(
    "ALTER TABLE `testimonials` MODIFY COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE'",
  );
  await connection.query("ALTER TABLE `testimonials` MODIFY COLUMN `rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0");
}

async function addColumnIfMissing(connection, tableName, columnName, definition) {
  const [rows] = await connection.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [env.db.database, tableName, columnName],
  );
  if (rows.length === 0) {
    await connection.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`);
  }
}

if (require.main === module) {
  initDatabase().catch((error) => {
    console.error("Database initialization failed.");
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = initDatabase;
