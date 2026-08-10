const cartService = require("../services/cart.service");
const { sendSuccess } = require("../utils/apiResponse");

async function getCart(req, res) {
  const cart = await cartService.getCart(req.user.id, req.user.role);
  return sendSuccess(res, 200, "Cart fetched successfully.", { cart });
}

async function addItem(req, res) {
  const cart = await cartService.addItem(req.user.id, req.body, req.user.role);
  return sendSuccess(res, 200, "Cart item added successfully.", { cart });
}

async function updateItem(req, res) {
  const cart = await cartService.updateItem(req.user.id, req.params.productId, req.body, req.user.role);
  return sendSuccess(res, 200, "Cart item updated successfully.", { cart });
}

async function removeItem(req, res) {
  const cart = await cartService.removeItem(req.user.id, req.params.productId, req.user.role);
  return sendSuccess(res, 200, "Cart item removed successfully.", { cart });
}

async function clearCart(req, res) {
  const cart = await cartService.clearCart(req.user.id, req.user.role);
  return sendSuccess(res, 200, "Cart cleared successfully.", { cart });
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
