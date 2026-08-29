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
    await addColumnIfMissing(connection, "products", "sort_order", "INT UNSIGNED NOT NULL DEFAULT 999 AFTER status");
    await addIndexIfMissing(connection, "products", "idx_products_sort_order", "sort_order");
    await normalizeSubcategoriesTable(connection);
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
    await normalizeWebhookEventsTable(connection);
    await normalizeTestimonialsTable(connection);
    await normalizeSettingsTable(connection);
    await normalizeTrainingEnquiriesTable(connection);

    console.log(`Database initialized: ${env.db.database}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


async function normalizeSubcategoriesTable(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS subcategories (` +
    `id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,` +
    `category_id BIGINT UNSIGNED NOT NULL,` +
    `name VARCHAR(120) NOT NULL,` +
    `slug VARCHAR(150) NOT NULL,` +
    `image_url VARCHAR(500) NULL,` +
    `description TEXT NULL,` +
    `status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',` +
    `created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,` +
    `updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,` +
    `PRIMARY KEY (id),` +
    `UNIQUE KEY uq_subcategories_category_slug (category_id, slug),` +
    `KEY idx_subcategories_category_id (category_id),` +
    `CONSTRAINT fk_subcategories_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT` +
  `)`);
  await addColumnIfMissing(connection, "subcategories", "image_url", "VARCHAR(500) NULL AFTER slug");
  await addColumnIfMissing(connection, "products", "subcategory_id", "BIGINT UNSIGNED NULL AFTER category_id");
  await addIndexIfMissing(connection, "products", "idx_products_subcategory_id", "subcategory_id");
  await addForeignKeyIfMissing(
    connection,
    "products",
    "fk_products_subcategory_id",
    "ALTER TABLE `products` ADD CONSTRAINT `fk_products_subcategory_id` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON DELETE SET NULL",
  );
}
async function normalizeWebhookEventsTable(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS webhook_events (` +
    `id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,` +
    `provider VARCHAR(60) NOT NULL,` +
    `event_id VARCHAR(160) NOT NULL,` +
    `event_type VARCHAR(120) NOT NULL,` +
    `status ENUM('RECEIVED', 'PROCESSED', 'FAILED') NOT NULL DEFAULT 'RECEIVED',` +
    `order_id BIGINT UNSIGNED NULL,` +
    `raw_payload JSON NULL,` +
    `error_message TEXT NULL,` +
    `received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,` +
    `processed_at DATETIME NULL,` +
    `PRIMARY KEY (id),` +
    `UNIQUE KEY uq_webhook_events_provider_event (provider, event_id),` +
    `KEY idx_webhook_events_order_id (order_id),` +
    `KEY idx_webhook_events_status_received (status, received_at),` +
    `CONSTRAINT fk_webhook_events_order_id FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL` +
  `)`);
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

async function normalizeSettingsTable(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS settings (` +
    `id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,` +
    `setting_key VARCHAR(120) NOT NULL,` +
    `setting_value JSON NOT NULL,` +
    `created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,` +
    `updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,` +
    `PRIMARY KEY (id),` +
    `UNIQUE KEY uq_settings_key (setting_key)` +
  `)`);
}

async function normalizeTrainingEnquiriesTable(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS training_enquiries (` +
    `id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,` +
    `enquiry_number VARCHAR(40) NOT NULL,` +
    `full_name VARCHAR(120) NOT NULL,` +
    `mobile VARCHAR(20) NOT NULL,` +
    `city VARCHAR(120) NOT NULL,` +
    `message TEXT NULL,` +
    `action_type ENUM('INTERESTED', 'PAYMENT') NOT NULL DEFAULT 'INTERESTED',` +
    `amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,` +
    `payment_status ENUM('NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'NOT_REQUIRED',` +
    `razorpay_order_id VARCHAR(120) NULL,` +
    `razorpay_payment_id VARCHAR(120) NULL,` +
    `created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,` +
    `updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,` +
    `PRIMARY KEY (id),` +
    `UNIQUE KEY uq_training_enquiries_number (enquiry_number),` +
    `KEY idx_training_enquiries_action_payment (action_type, payment_status),` +
    `KEY idx_training_enquiries_created_at (created_at)` +
  `)`);
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


async function addIndexIfMissing(connection, tableName, indexName, columnName) {
  const [rows] = await connection.query(
    `SELECT INDEX_NAME
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [env.db.database, tableName, indexName],
  );
  if (rows.length === 0) {
    await connection.query(`ALTER TABLE \`${tableName}\` ADD INDEX \`${indexName}\` (\`${columnName}\`)`);
  }
}

async function addForeignKeyIfMissing(connection, tableName, constraintName, alterSql) {
  const [rows] = await connection.query(
    `SELECT CONSTRAINT_NAME
     FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = ? AND CONSTRAINT_TYPE = 'FOREIGN KEY'`,
    [env.db.database, tableName, constraintName],
  );
  if (rows.length === 0) {
    await connection.query(alterSql);
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

