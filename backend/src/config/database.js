const mysql = require("mysql2/promise");
const env = require("./env");

function createServerConnection() {
  const { database, ...serverConfig } = env.db;
  return mysql.createConnection({
    ...serverConfig,
    multipleStatements: true,
  });
}

const pool = mysql.createPool({
  ...env.db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

module.exports = {
  pool,
  createServerConnection,
};
