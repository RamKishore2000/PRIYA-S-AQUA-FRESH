const { pool } = require("../config/database");

function mapAddress(row) {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    mobile: row.mobile,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2 || "",
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    landmark: row.landmark || "",
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findByUser(userId) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, full_name, mobile, address_line1, address_line2, city, state, pincode, landmark,
            is_default, created_at, updated_at
     FROM addresses
     WHERE user_id = ?
     ORDER BY is_default DESC, updated_at DESC`,
    [userId],
  );
  return rows.map(mapAddress);
}

async function findByIdForUser(id, userId) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, full_name, mobile, address_line1, address_line2, city, state, pincode, landmark,
            is_default, created_at, updated_at
     FROM addresses
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [id, userId],
  );
  return rows[0] ? mapAddress(rows[0]) : null;
}

async function create(userId, payload) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    if (payload.isDefault) {
      await connection.execute("UPDATE addresses SET is_default = FALSE WHERE user_id = ?", [userId]);
    }
    const [countRows] = await connection.execute("SELECT COUNT(*) AS total FROM addresses WHERE user_id = ?", [userId]);
    const shouldDefault = payload.isDefault || Number(countRows[0].total) === 0;
    const [result] = await connection.execute(
      `INSERT INTO addresses
       (user_id, full_name, mobile, address_line1, address_line2, city, state, pincode, landmark, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        payload.fullName,
        payload.mobile,
        payload.addressLine1,
        payload.addressLine2 || null,
        payload.city,
        payload.state,
        payload.pincode,
        payload.landmark || null,
        shouldDefault,
      ],
    );
    await connection.commit();
    return findByIdForUser(result.insertId, userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function update(id, userId, payload) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    if (payload.isDefault) {
      await connection.execute("UPDATE addresses SET is_default = FALSE WHERE user_id = ?", [userId]);
    }
    await connection.execute(
      `UPDATE addresses
       SET full_name = ?, mobile = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?,
           pincode = ?, landmark = ?, is_default = ?
       WHERE id = ? AND user_id = ?`,
      [
        payload.fullName,
        payload.mobile,
        payload.addressLine1,
        payload.addressLine2 || null,
        payload.city,
        payload.state,
        payload.pincode,
        payload.landmark || null,
        payload.isDefault,
        id,
        userId,
      ],
    );
    await connection.commit();
    return findByIdForUser(id, userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function remove(id, userId) {
  await pool.execute("DELETE FROM addresses WHERE id = ? AND user_id = ?", [id, userId]);
}

async function setDefault(id, userId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute("UPDATE addresses SET is_default = FALSE WHERE user_id = ?", [userId]);
    await connection.execute("UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?", [id, userId]);
    await connection.commit();
    return findByIdForUser(id, userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  findByUser,
  findByIdForUser,
  create,
  update,
  remove,
  setDefault,
};
