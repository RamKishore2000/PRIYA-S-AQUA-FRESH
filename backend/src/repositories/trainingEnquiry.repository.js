const { pool } = require("../config/database");

function mapTrainingEnquiry(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    enquiryNumber: row.enquiry_number,
    fullName: row.full_name,
    mobile: row.mobile,
    city: row.city,
    message: row.message || "",
    actionType: row.action_type,
    amount: Number(row.amount || 0),
    paymentStatus: row.payment_status,
    razorpayOrderId: row.razorpay_order_id || null,
    razorpayPaymentId: row.razorpay_payment_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createEnquiry(payload) {
  const enquiryNumber = `TRAIN${Date.now()}`;
  const [result] = await pool.execute(
    `INSERT INTO training_enquiries
     (enquiry_number, full_name, mobile, city, message, action_type, amount, payment_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      enquiryNumber,
      payload.fullName,
      payload.mobile,
      payload.city,
      payload.message || "",
      payload.actionType,
      Number(payload.amount || 0),
      payload.paymentStatus || "PENDING",
    ],
  );
  return findById(result.insertId);
}

async function findAll() {
  const [rows] = await pool.execute("SELECT * FROM training_enquiries ORDER BY created_at DESC");
  return rows.map(mapTrainingEnquiry);
}

async function findById(id) {
  const [rows] = await pool.execute("SELECT * FROM training_enquiries WHERE id = ? LIMIT 1", [id]);
  return mapTrainingEnquiry(rows[0]);
}

async function updateRazorpayOrder(id, razorpayOrderId) {
  await pool.execute("UPDATE training_enquiries SET razorpay_order_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [razorpayOrderId, id]);
  return findById(id);
}

async function markPaid(id, payload) {
  await pool.execute(
    `UPDATE training_enquiries
     SET payment_status = 'PAID', action_type = 'PAYMENT', razorpay_order_id = ?, razorpay_payment_id = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [payload.razorpayOrderId, payload.razorpayPaymentId, id],
  );
  return findById(id);
}

async function markFailed(id) {
  await pool.execute("UPDATE training_enquiries SET payment_status = 'FAILED', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND payment_status = 'PENDING'", [id]);
  return findById(id);
}

module.exports = {
  createEnquiry,
  findAll,
  findById,
  updateRazorpayOrder,
  markPaid,
  markFailed,
};