const express = require("express");
const orderController = require("../controllers/order.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const { orderIdValidator, orderStatusValidator } = require("../validators/order.validator");

const router = express.Router();

router.get("/", asyncHandler(orderController.listOrders));
router.get("/:id/admin", orderIdValidator, validateRequest, asyncHandler(orderController.getAdminOrder));
router.patch("/:id/status", orderIdValidator, orderStatusValidator, validateRequest, asyncHandler(orderController.updateOrderStatus));

router.use(requireAuth, requireRole("CUSTOMER", "DEALER"));
router.post("/", asyncHandler(orderController.createOrder));
router.get("/my", asyncHandler(orderController.listMyOrders));
router.get("/:id", orderIdValidator, validateRequest, asyncHandler(orderController.getOrder));
router.post("/razorpay/order", asyncHandler(orderController.createRazorpayOrder));
router.post("/razorpay/verify", asyncHandler(orderController.verifyRazorpayPayment));

module.exports = router;
