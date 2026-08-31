const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/database");
const { USER_ROLES } = require("../models/user.model");

function mapDealer(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name || row.full_name,
    mobile: row.mobile,
    email: row.email,
    status: row.status,
    dealerCode: row.dealer_code,
    businessName: row.business_name,
    gstNumber: row.gst_number,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    totalOrders: row.total_orders,
    totalPurchaseValue: Number(row.total_purchase_value),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const dealerSelect = `
  SELECT d.id, d.user_id, d.name, d.mobile, d.email, d.status, d.dealer_code, d.business_name, d.gst_number,
         d.address, d.city, d.state, d.pincode, d.total_orders, d.total_purchase_value, d.created_at, d.updated_at,
         u.full_name
  FROM dealers d
  LEFT JOIN users u ON u.id = d.user_id
`;

async function findAll() {
  const [rows] = await pool.execute(`${dealerSelect} ORDER BY d.created_at DESC`);
  return rows.map(mapDealer);
}

async function findById(id) {
  const [rows] = await pool.execute(`${dealerSelect} WHERE d.id = ? LIMIT 1`, [id]);
  return mapDealer(rows[0]);
}

async function findByDealerCode(dealerCode) {
  const [rows] = await pool.execute(`${dealerSelect} WHERE d.dealer_code = ? LIMIT 1`, [dealerCode]);
  return mapDealer(rows[0]);
}

async function findByMobile(mobile) {
  const [rows] = await pool.execute(`${dealerSelect} WHERE d.mobile = ? LIMIT 1`, [mobile]);
  return mapDealer(rows[0]);
}

async function findByEmail(email) {
  const [rows] = await pool.execute(`${dealerSelect} WHERE d.email = ? LIMIT 1`, [email]);
  return mapDealer(rows[0]);
}

async function createDealer(payload) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const passwordHash = await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 12);
    const [userResult] = await connection.execute(
      `INSERT INTO users (full_name, mobile, email, password_hash, role, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [payload.name, payload.mobile, payload.email, passwordHash, USER_ROLES.DEALER, payload.status],
    );

    const [dealerResult] = await connection.execute(
      `INSERT INTO dealers (user_id, name, mobile, email, status, dealer_code, business_name, gst_number, address, city, state, pincode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.insertId,
        payload.name,
        payload.mobile,
        payload.email,
        payload.status,
        payload.dealerCode,
        payload.businessName,
        payload.gstNumber,
        payload.address,
        payload.city,
        payload.state,
        payload.pincode,
      ],
    );
    await connection.commit();
    return findById(dealerResult.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateDealer(id, payload) {
  const current = await findById(id);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE users SET full_name = ?, mobile = ?, email = ?, status = ? WHERE id = ?`,
      [payload.name, payload.mobile, payload.email, payload.status, current.userId],
    );
    await connection.execute(
      `UPDATE dealers
       SET name = ?, mobile = ?, email = ?, status = ?, dealer_code = ?, business_name = ?, gst_number = ?, address = ?, city = ?, state = ?, pincode = ?
       WHERE id = ?`,
      [
        payload.name,
        payload.mobile,
        payload.email,
        payload.status,
        payload.dealerCode,
        payload.businessName,
        payload.gstNumber,
        payload.address,
        payload.city,
        payload.state,
        payload.pincode,
        id,
      ],
    );
    await connection.commit();
    return findById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateStatus(id, status) {
  const dealer = await findById(id);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute("UPDATE dealers SET status = ? WHERE id = ?", [status, id]);
    await connection.execute("UPDATE users SET status = ? WHERE id = ?", [status, dealer.userId]);
    await connection.commit();
    return findById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  findAll,
  findById,
  findByDealerCode,
  findByMobile,
  findByEmail,
  createDealer,
  updateDealer,
  updateStatus,
};