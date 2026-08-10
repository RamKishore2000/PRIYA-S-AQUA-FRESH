const express = require("express");
const customerController = require("../controllers/customer.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const { customerIdValidator, customerStatusValidator } = require("../validators/customer.validator");

const router = express.Router();

router.get("/", asyncHandler(customerController.listCustomers));
router.get("/:id", customerIdValidator, validateRequest, asyncHandler(customerController.getCustomer));
router.patch("/:id/status", customerIdValidator, customerStatusValidator, validateRequest, asyncHandler(customerController.updateCustomerStatus));

module.exports = router;
