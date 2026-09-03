const { pool } = require("../config/database");

async function getOrCreateCart(userId) {
  const [existing] = await pool.execute("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
  if (existing[0]) return existing[0];
  const [result] = await pool.execute("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  return { id: result.insertId };
}

async function getCart(userId) {
  const [rows] = await pool.execute(
    `SELECT ci.id, ci.product_id, ci.quantity, ci.selected_color_name, ci.selected_color_code, ci.selected_image_url, ci.selected_variant_key
     FROM carts c
     INNER JOIN cart_items ci ON ci.cart_id = c.id
     WHERE c.user_id = ?
     ORDER BY ci.updated_at DESC`,
    [userId],
  );
  return rows;
}

async function upsertItem(userId, productId, quantity, selection = {}) {
  const cart = await getOrCreateCart(userId);
  const variantKey = selection.variantKey || "";
  const existingRows = await findVariantRows(cart.id, productId, variantKey);

  if (existingRows.length) {
    const keep = existingRows[0];
    const nextQuantity = existingRows.reduce((total, row) => total + Number(row.quantity || 0), 0) + quantity;
    await pool.execute(
      `UPDATE cart_items
       SET quantity = ?, selected_color_name = ?, selected_color_code = ?, selected_image_url = ?, selected_variant_key = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [nextQuantity, selection.colorName || null, selection.colorCode || null, selection.imageUrl || null, variantKey, keep.id],
    );
    await deleteDuplicateRows(existingRows.slice(1));
    return;
  }

  await pool.execute(
    `INSERT INTO cart_items (cart_id, product_id, quantity, selected_color_name, selected_color_code, selected_image_url, selected_variant_key)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [cart.id, productId, quantity, selection.colorName || null, selection.colorCode || null, selection.imageUrl || null, variantKey],
  );
}

async function setItemQuantity(userId, productId, quantity, variantKey = "") {
  const cart = await getOrCreateCart(userId);
  if (quantity <= 0) {
    const { where, params } = buildVariantKeyWhere(variantKey);
    await pool.execute(`DELETE FROM cart_items WHERE cart_id = ? AND product_id = ? AND ${where}`, [cart.id, productId, ...params]);
    return;
  }

  const existingRows = await findVariantRows(cart.id, productId, variantKey);
  if (existingRows.length) {
    await pool.execute("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [quantity, existingRows[0].id]);
    await deleteDuplicateRows(existingRows.slice(1));
    return;
  }

  await pool.execute(
    `INSERT INTO cart_items (cart_id, product_id, quantity, selected_variant_key)
     VALUES (?, ?, ?, ?)`,
    [cart.id, productId, quantity, variantKey || ""],
  );
}

async function removeItem(userId, productId, variantKey = "") {
  const cart = await getOrCreateCart(userId);
  const { where, params } = buildVariantKeyWhere(variantKey);
  await pool.execute(`DELETE FROM cart_items WHERE cart_id = ? AND product_id = ? AND ${where}`, [cart.id, productId, ...params]);
}

async function clearCart(userId, connection = pool) {
  await connection.execute(
    `DELETE ci FROM cart_items ci
     INNER JOIN carts c ON c.id = ci.cart_id
     WHERE c.user_id = ?`,
    [userId],
  );
}

async function findVariantRows(cartId, productId, variantKey = "") {
  const { where, params } = buildVariantKeyWhere(variantKey);
  const [rows] = await pool.execute(
    `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND ${where} ORDER BY updated_at DESC, id DESC`,
    [cartId, productId, ...params],
  );
  return rows;
}

async function deleteDuplicateRows(rows) {
  if (!rows.length) return;
  const ids = rows.map((row) => row.id);
  await pool.execute(`DELETE FROM cart_items WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
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
  getCart,
  upsertItem,
  setItemQuantity,
  removeItem,
  clearCart,
};