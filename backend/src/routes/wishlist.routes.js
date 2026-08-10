const express = require("express");
const wishlistController = require("../controllers/wishlist.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.use(requireAuth, requireRole("CUSTOMER", "DEALER"));
router.get("/", asyncHandler(wishlistController.getWishlist));
router.post("/", asyncHandler(wishlistController.addItem));
router.delete("/:productId", asyncHandler(wishlistController.removeItem));

module.exports = router;
