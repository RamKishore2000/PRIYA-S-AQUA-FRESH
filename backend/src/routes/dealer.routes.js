const express = require("express");
const dealerController = require("../controllers/dealer.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  createDealerValidator,
  dealerIdValidator,
  dealerPayloadValidator,
  resetPasswordValidator,
  statusValidator,
} = require("../validators/dealer.validator");

const router = express.Router();

router.get("/", asyncHandler(dealerController.listDealers));
router.get("/:id", dealerIdValidator, validateRequest, asyncHandler(dealerController.getDealer));
router.post("/", createDealerValidator, validateRequest, asyncHandler(dealerController.createDealer));
router.put("/:id", dealerIdValidator, dealerPayloadValidator, validateRequest, asyncHandler(dealerController.updateDealer));
router.patch("/:id/status", dealerIdValidator, statusValidator, validateRequest, asyncHandler(dealerController.updateDealerStatus));
router.patch("/:id/password", dealerIdValidator, resetPasswordValidator, validateRequest, asyncHandler(dealerController.resetPassword));

module.exports = router;
