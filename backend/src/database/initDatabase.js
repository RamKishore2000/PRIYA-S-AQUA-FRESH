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

    console.log(`Database initialized: ${env.db.database}`);
  } finally {
    if (connection) {
      await connection.end();
    }
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
