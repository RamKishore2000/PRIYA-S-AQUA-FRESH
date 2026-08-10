const { pool } = require("../config/database");

async function getOrCreateWishlist(userId) {
  const [existing] = await pool.execute("SELECT id FROM wishlists WHERE user_id = ? LIMIT 1", [userId]);
  if (existing[0]) return existing[0];
  const [result] = await pool.execute("INSERT INTO wishlists (user_id) VALUES (?)", [userId]);
  return { id: result.insertId };
}

async function getWishlist(userId) {
  const [rows] = await pool.execute(
    `SELECT wi.product_id
     FROM wishlists w
     INNER JOIN wishlist_items wi ON wi.wishlist_id = w.id
     WHERE w.user_id = ?
     ORDER BY wi.created_at DESC`,
    [userId],
  );
  return rows;
}

async function addItem(userId, productId) {
  const wishlist = await getOrCreateWishlist(userId);
  await pool.execute(
    `INSERT IGNORE INTO wishlist_items (wishlist_id, product_id)
     VALUES (?, ?)`,
    [wishlist.id, productId],
  );
}

async function removeItem(userId, productId) {
  const wishlist = await getOrCreateWishlist(userId);
  await pool.execute("DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?", [wishlist.id, productId]);
}

module.exports = {
  getWishlist,
  addItem,
  removeItem,
};
