const productRepository = require("../repositories/product.repository");
const wishlistRepository = require("../repositories/wishlist.repository");
const { ApiError } = require("../utils/apiError");

async function getWishlist(userId) {
  const rows = await wishlistRepository.getWishlist(userId);
  const products = [];
  for (const row of rows) {
    const product = await productRepository.findById(row.product_id);
    if (product) products.push(product);
  }
  return { products, productIds: products.map((product) => String(product.id)) };
}

async function addItem(userId, payload) {
  const productId = Number(payload.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    throw new ApiError(422, "Product is required.", { productId: "Product is required." });
  }
  const product = await productRepository.findById(productId);
  if (!product || product.status !== "ACTIVE") {
    throw new ApiError(404, "Product not found.");
  }
  await wishlistRepository.addItem(userId, productId);
  return getWishlist(userId);
}

async function removeItem(userId, productId) {
  await wishlistRepository.removeItem(userId, Number(productId));
  return getWishlist(userId);
}

module.exports = {
  getWishlist,
  addItem,
  removeItem,
};
