const { pool } = require("../config/database");

function mapCustomer(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    mobile: row.mobile,
    email: row.email,
    status: row.status,
    totalOrders: Number(row.total_orders || 0),
    totalSpent: Number(row.total_spent || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findAll() {
  const [rows] = await pool.execute(
    `SELECT u.id, u.full_name, u.mobile, u.email, u.status, u.created_at, u.updated_at,
            COUNT(o.id) AS total_orders,
            COALESCE(SUM(CASE WHEN o.payment_status = 'PAID' THEN o.total_amount ELSE 0 END), 0) AS total_spent
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     WHERE u.role = 'CUSTOMER'
     GROUP BY u.id, u.full_name, u.mobile, u.email, u.status, u.created_at, u.updated_at
     ORDER BY u.created_at DESC`,
  );
  return rows.map(mapCustomer);
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.full_name, u.mobile, u.email, u.status, u.created_at, u.updated_at,
            COUNT(o.id) AS total_orders,
            COALESCE(SUM(CASE WHEN o.payment_status = 'PAID' THEN o.total_amount ELSE 0 END), 0) AS total_spent
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     WHERE u.id = ? AND u.role = 'CUSTOMER'
     GROUP BY u.id, u.full_name, u.mobile, u.email, u.status, u.created_at, u.updated_at
     LIMIT 1`,
    [id],
  );
  return rows[0] ? mapCustomer(rows[0]) : null;
}

async function updateStatus(id, status) {
  await pool.execute("UPDATE users SET status = ? WHERE id = ? AND role = 'CUSTOMER'", [status, id]);
  return findById(id);
}

module.exports = {
  findAll,
  findById,
  updateStatus,
};
