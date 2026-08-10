const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");

async function createAdminUser() {
  const fullName = process.env.ADMIN_FULL_NAME || "Priya Admin";
  const mobile = process.env.ADMIN_MOBILE || "9999999999";
  const email = (process.env.ADMIN_EMAIL || "admin@priyasaquafresh.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "1234";
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.execute(
    `INSERT INTO users (full_name, mobile, email, password_hash, role, status)
     VALUES (?, ?, ?, ?, 'ADMIN', 'ACTIVE')
     ON DUPLICATE KEY UPDATE
       full_name = VALUES(full_name),
       password_hash = VALUES(password_hash),
       role = 'ADMIN',
       status = 'ACTIVE'`,
    [fullName, mobile, email, passwordHash],
  );

  console.log(`Admin user ready: ${email}`);
  await pool.end();
}

createAdminUser().catch((error) => {
  console.error("Admin user creation failed.");
  console.error(error.message);
  process.exit(1);
});
