const express = require("express");
const cartController = require("../controllers/cart.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.use(requireAuth, requireRole("CUSTOMER", "DEALER"));
router.get("/", asyncHandler(cartController.getCart));
router.post("/items", asyncHandler(cartController.addItem));
router.patch("/items/:productId", asyncHandler(cartController.updateItem));
router.delete("/items/:productId", asyncHandler(cartController.removeItem));
router.delete("/", asyncHandler(cartController.clearCart));

module.exports = router;
