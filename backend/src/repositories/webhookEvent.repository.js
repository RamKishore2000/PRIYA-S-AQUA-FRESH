const { pool } = require("../config/database");

async function createEvent({ provider, eventId, eventType, orderId = null, rawPayload }) {
  try {
    const [result] = await pool.execute(
      `INSERT INTO webhook_events (provider, event_id, event_type, order_id, raw_payload)
       VALUES (?, ?, ?, ?, ?)`,
      [provider, eventId, eventType, orderId, JSON.stringify(rawPayload)],
    );
    return { id: result.insertId, duplicate: false };
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") {
      return { id: null, duplicate: true };
    }
    throw error;
  }
}

async function markProcessed(provider, eventId, orderId = null) {
  await pool.execute(
    "UPDATE webhook_events SET status = 'PROCESSED', order_id = COALESCE(?, order_id), processed_at = NOW(), error_message = NULL WHERE provider = ? AND event_id = ?",
    [orderId, provider, eventId],
  );
}

async function markFailed(provider, eventId, errorMessage, orderId = null) {
  await pool.execute(
    "UPDATE webhook_events SET status = 'FAILED', order_id = COALESCE(?, order_id), processed_at = NOW(), error_message = ? WHERE provider = ? AND event_id = ?",
    [orderId, String(errorMessage || "Webhook processing failed.").slice(0, 2000), provider, eventId],
  );
}

module.exports = {
  createEvent,
  markProcessed,
  markFailed,
};
