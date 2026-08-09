const { pool } = require("../config/database");
const { USER_ROLES, USER_STATUSES } = require("../models/user.model");

async function findByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT id, full_name, mobile, email, password_hash, role, status FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  return rows[0] || null;
}

async function findByMobile(mobile) {
  const [rows] = await pool.execute(
    "SELECT id, full_name, mobile, email, password_hash, role, status FROM users WHERE mobile = ? LIMIT 1",
    [mobile],
  );
  return rows[0] || null;
}

async function createCustomerUser({ fullName, mobile, email, passwordHash }) {
  const [result] = await pool.execute(
    `INSERT INTO users (full_name, mobile, email, password_hash, role, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [fullName, mobile, email, passwordHash, USER_ROLES.CUSTOMER, USER_STATUSES.ACTIVE],
  );

  return {
    id: result.insertId,
    full_name: fullName,
    mobile,
    email,
    role: USER_ROLES.CUSTOMER,
    status: USER_STATUSES.ACTIVE,
  };
}

module.exports = {
  findByEmail,
  findByMobile,
  createCustomerUser,
};
