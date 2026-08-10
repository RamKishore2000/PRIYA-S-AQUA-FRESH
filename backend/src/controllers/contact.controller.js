const { pool } = require("../config/database");
const { sendSuccess } = require("../utils/apiResponse");

async function createContactMessage(req, res) {
  await pool.execute(
    `INSERT INTO contact_messages (full_name, email, mobile, subject, message)
     VALUES (?, ?, ?, ?, ?)`,
    [req.body.fullName, req.body.email || null, req.body.mobile || null, req.body.subject || null, req.body.message],
  );
  return sendSuccess(res, 201, "Your message has been sent successfully.");
}

async function listContactMessages(_req, res) {
  const [messages] = await pool.execute("SELECT * FROM contact_messages ORDER BY created_at DESC");
  return sendSuccess(res, 200, "Contact messages fetched successfully.", { messages });
}

module.exports = {
  createContactMessage,
  listContactMessages,
};
