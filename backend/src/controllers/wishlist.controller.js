const wishlistService = require("../services/wishlist.service");
const { sendSuccess } = require("../utils/apiResponse");

async function getWishlist(req, res) {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  return sendSuccess(res, 200, "Wishlist fetched successfully.", { wishlist });
}

async function addItem(req, res) {
  const wishlist = await wishlistService.addItem(req.user.id, req.body);
  return sendSuccess(res, 200, "Wishlist item added successfully.", { wishlist });
}

async function removeItem(req, res) {
  const wishlist = await wishlistService.removeItem(req.user.id, req.params.productId);
  return sendSuccess(res, 200, "Wishlist item removed successfully.", { wishlist });
}

module.exports = {
  getWishlist,
  addItem,
  removeItem,
};
