const express = require("express");
const dealerController = require("../controllers/dealer.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  createDealerValidator,
  dealerIdValidator,
  dealerPayloadValidator,
  statusValidator,
} = require("../validators/dealer.validator");

const router = express.Router();

router.get("/", asyncHandler(dealerController.listDealers));
router.get("/:id", dealerIdValidator, validateRequest, asyncHandler(dealerController.getDealer));
router.post("/", createDealerValidator, validateRequest, asyncHandler(dealerController.createDealer));
router.put("/:id", dealerIdValidator, dealerPayloadValidator, validateRequest, asyncHandler(dealerController.updateDealer));
router.patch("/:id/status", dealerIdValidator, statusValidator, validateRequest, asyncHandler(dealerController.updateDealerStatus));

module.exports = router;