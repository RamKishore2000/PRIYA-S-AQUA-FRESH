const cartRepository = require("../repositories/cart.repository");
const productRepository = require("../repositories/product.repository");
const { ApiError } = require("../utils/apiError");

async function getCart(userId, role) {
  const rows = await cartRepository.getCart(userId);
  const items = [];
  for (const row of rows) {
    const product = await productRepository.findById(row.product_id);
    if (product) {
      items.push({ product, quantity: Number(row.quantity) });
    }
  }
  const subtotal = items.reduce((total, item) => total + getSellingPrice(item.product, role) * item.quantity, 0);
  return { items, subtotal, count: items.reduce((total, item) => total + item.quantity, 0) };
}

async function addItem(userId, payload, role) {
  const productId = Number(payload.productId);
  const quantity = Number(payload.quantity || 1);
  if (!Number.isInteger(productId) || productId < 1) {
    throw new ApiError(422, "Product is required.", { productId: "Product is required." });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(422, "Quantity must be at least 1.", { quantity: "Quantity must be at least 1." });
  }
  const product = await productRepository.findById(productId);
  if (!product || product.status !== "ACTIVE") {
    throw new ApiError(404, "Product not found.");
  }
  await cartRepository.upsertItem(userId, productId, quantity);
  return getCart(userId, role);
}

async function updateItem(userId, productId, payload, role) {
  const quantity = Number(payload.quantity);
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new ApiError(422, "Quantity must be 0 or more.", { quantity: "Quantity must be 0 or more." });
  }
  await cartRepository.setItemQuantity(userId, Number(productId), quantity);
  return getCart(userId, role);
}

async function removeItem(userId, productId, role) {
  await cartRepository.removeItem(userId, Number(productId));
  return getCart(userId, role);
}

async function clearCart(userId, role) {
  await cartRepository.clearCart(userId);
  return getCart(userId, role);
}

function getSellingPrice(product, role) {
  return Number(role === "DEALER" ? product.prices.dealerSellingPrice : product.prices.customerSellingPrice);
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
