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
    await normalizeTestimonialsTable(connection);

    console.log(`Database initialized: ${env.db.database}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
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
