const { pool } = require("../config/database");

async function getOrCreateWishlist(userId) {
  const [existing] = await pool.execute("SELECT id FROM wishlists WHERE user_id = ? LIMIT 1", [userId]);
  if (existing[0]) return existing[0];
  const [result] = await pool.execute("INSERT INTO wishlists (user_id) VALUES (?)", [userId]);
  return { id: result.insertId };
}

async function getWishlist(userId) {
  const [rows] = await pool.execute(
    `SELECT wi.product_id, wi.selected_color_name, wi.selected_color_code, wi.selected_image_url, wi.selected_variant_key
     FROM wishlists w
     INNER JOIN wishlist_items wi ON wi.wishlist_id = w.id
     WHERE w.user_id = ?
     ORDER BY wi.created_at DESC`,
    [userId],
  );
  return rows;
}

async function addItem(userId, productId, selection = {}) {
  const wishlist = await getOrCreateWishlist(userId);
  await pool.execute(
    `INSERT IGNORE INTO wishlist_items (wishlist_id, product_id, selected_color_name, selected_color_code, selected_image_url, selected_variant_key)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [wishlist.id, productId, selection.colorName || null, selection.colorCode || null, selection.imageUrl || null, selection.variantKey || ""],
  );
}

async function removeItem(userId, productId, variantKey = "") {
  const wishlist = await getOrCreateWishlist(userId);
  const { where, params } = buildVariantKeyWhere(variantKey);
  await pool.execute(`DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ? AND ${where}`, [wishlist.id, productId, ...params]);
}

function buildVariantKeyWhere(variantKey = "") {
  const value = String(variantKey || "").trim();
  if (!value) return { where: "selected_variant_key = ?", params: [""] };

  const uploadsIndex = value.indexOf("/uploads/");
  const normalized = uploadsIndex >= 0 ? value.slice(uploadsIndex) : value;
  return {
    where: "(selected_variant_key = ? OR selected_variant_key = ? OR selected_variant_key LIKE ?)",
    params: [value, normalized, `%${normalized}`],
  };
}
module.exports = {
  getWishlist,
  addItem,
  removeItem,
};
