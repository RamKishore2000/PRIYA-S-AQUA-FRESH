const express = require("express");
const orderController = require("../controllers/order.controller");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(orderController.razorpayWebhook));

module.exports = router;
