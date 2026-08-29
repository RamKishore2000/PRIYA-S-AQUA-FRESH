const { pool } = require("../config/database");

async function createOtp({ userId, mobile, purpose, otpHash, expiresAt, resendCount = 0 }) {
  const [result] = await pool.execute(
    `INSERT INTO otp_verifications (user_id, mobile, purpose, otp_hash, expires_at, resend_count, last_sent_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [userId, mobile, purpose, otpHash, expiresAt, resendCount],
  );
  return result.insertId;
}

async function findLatestActive(mobile, purpose) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, mobile, purpose, otp_hash, expires_at, verified_at, attempts, resend_count, last_sent_at, created_at
     FROM otp_verifications
     WHERE mobile = ? AND purpose = ? AND verified_at IS NULL AND expires_at > NOW()
     ORDER BY id DESC
     LIMIT 1`,
    [mobile, purpose],
  );
  return rows[0] || null;
}

async function countRecentSends(mobile, purpose, windowMinutes) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM otp_verifications
     WHERE mobile = ? AND purpose = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
    [mobile, purpose, windowMinutes],
  );
  return Number(rows[0]?.total || 0);
}

async function markVerified(id) {
  await pool.execute("UPDATE otp_verifications SET verified_at = NOW() WHERE id = ? AND verified_at IS NULL", [id]);
}

async function expireActiveOtps(mobile, purpose) {
  await pool.execute(
    "UPDATE otp_verifications SET expires_at = NOW() WHERE mobile = ? AND purpose = ? AND verified_at IS NULL AND expires_at > NOW()",
    [mobile, purpose],
  );
}

async function incrementAttempts(id) {
  await pool.execute("UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = ?", [id]);
}

module.exports = {
  createOtp,
  findLatestActive,
  countRecentSends,
  markVerified,
  expireActiveOtps,
  incrementAttempts,
};
