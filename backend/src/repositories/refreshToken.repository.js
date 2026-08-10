const { pool } = require("../config/database");

async function createRefreshToken({ userId, tokenHash, expiresAt }) {
  const [result] = await pool.execute(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [userId, tokenHash, expiresAt],
  );
  return result.insertId;
}

async function findActiveByHash(tokenHash) {
  const [rows] = await pool.execute(
    `SELECT id, user_id, token_hash, expires_at, revoked_at
     FROM refresh_tokens
     WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash],
  );
  return rows[0] || null;
}

async function revokeByHash(tokenHash) {
  await pool.execute(
    "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND revoked_at IS NULL",
    [tokenHash],
  );
}

module.exports = {
  createRefreshToken,
  findActiveByHash,
  revokeByHash,
};
