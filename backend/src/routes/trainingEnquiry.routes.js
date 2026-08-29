const express = require("express");
const trainingController = require("../controllers/trainingEnquiry.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(trainingController.createEnquiry));
router.post("/razorpay/order", asyncHandler(trainingController.createRazorpayOrder));
router.post("/razorpay/verify", asyncHandler(trainingController.verifyRazorpayPayment));
router.post("/:id/payment-failed", asyncHandler(trainingController.markPaymentFailed));
router.get("/", requireAuth, requireRole("ADMIN"), asyncHandler(trainingController.listEnquiries));

module.exports = router;