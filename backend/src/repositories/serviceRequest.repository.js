const { pool } = require("../config/database");

function mapServiceRequest(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customer_name,
    mobile: row.mobile,
    email: row.email,
    serviceType: row.service_type,
    address: row.address,
    city: row.city,
    preferredDate: row.preferred_date,
    problem: row.problem,
    status: row.status,
    technicianName: row.technician_name,
    createdAt: row.created_at,
  };
}

async function findAll() {
  const [rows] = await pool.execute("SELECT * FROM service_requests ORDER BY created_at DESC");
  return rows.map(mapServiceRequest);
}

async function create(payload) {
  const [result] = await pool.execute(
    `INSERT INTO service_requests
     (customer_name, mobile, email, service_type, address, city, preferred_date, problem)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [payload.customerName, payload.mobile, payload.email || null, payload.serviceType, payload.address, payload.city || "", payload.preferredDate || null, payload.problem || ""],
  );
  const [rows] = await pool.execute("SELECT * FROM service_requests WHERE id = ? LIMIT 1", [result.insertId]);
  return mapServiceRequest(rows[0]);
}

async function updateStatus(id, { status, technicianName }) {
  await pool.execute("UPDATE service_requests SET status = ?, technician_name = ? WHERE id = ?", [status, technicianName || null, id]);
  const [rows] = await pool.execute("SELECT * FROM service_requests WHERE id = ? LIMIT 1", [id]);
  return mapServiceRequest(rows[0]);
}

module.exports = {
  findAll,
  create,
  updateStatus,
};
