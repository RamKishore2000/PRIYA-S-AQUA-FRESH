const { pool } = require("../config/database");

async function getOrCreateCart(userId) {
  const [existing] = await pool.execute("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
  if (existing[0]) return existing[0];
  const [result] = await pool.execute("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  return { id: result.insertId };
}

async function getCart(userId) {
  const [rows] = await pool.execute(
    `SELECT ci.product_id, ci.quantity
     FROM carts c
     INNER JOIN cart_items ci ON ci.cart_id = c.id
     WHERE c.user_id = ?
     ORDER BY ci.updated_at DESC`,
    [userId],
  );
  return rows;
}

async function upsertItem(userId, productId, quantity) {
  const cart = await getOrCreateCart(userId);
  await pool.execute(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), updated_at = CURRENT_TIMESTAMP`,
    [cart.id, productId, quantity],
  );
}

async function setItemQuantity(userId, productId, quantity) {
  const cart = await getOrCreateCart(userId);
  if (quantity <= 0) {
    await pool.execute("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [cart.id, productId]);
    return;
  }
  await pool.execute(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), updated_at = CURRENT_TIMESTAMP`,
    [cart.id, productId, quantity],
  );
}

async function removeItem(userId, productId) {
  const cart = await getOrCreateCart(userId);
  await pool.execute("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [cart.id, productId]);
}

async function clearCart(userId, connection = pool) {
  await connection.execute(
    `DELETE ci FROM cart_items ci
     INNER JOIN carts c ON c.id = ci.cart_id
     WHERE c.user_id = ?`,
    [userId],
  );
}

module.exports = {
  getCart,
  upsertItem,
  setItemQuantity,
  removeItem,
  clearCart,
};
