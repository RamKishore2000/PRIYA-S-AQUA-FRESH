const express = require("express");
const aboutAwardController = require("../controllers/aboutAward.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  awardIdValidator,
  awardListValidator,
  awardPayloadValidator,
  awardStatusValidator,
} = require("../validators/aboutAward.validator");

const router = express.Router();

router.get("/", awardListValidator, validateRequest, asyncHandler(aboutAwardController.listAwards));
router.get("/:id", awardIdValidator, validateRequest, asyncHandler(aboutAwardController.getAward));
router.post("/", awardPayloadValidator, validateRequest, asyncHandler(aboutAwardController.createAward));
router.put("/:id", awardIdValidator, awardPayloadValidator, validateRequest, asyncHandler(aboutAwardController.updateAward));
router.patch("/:id/status", awardIdValidator, awardStatusValidator, validateRequest, asyncHandler(aboutAwardController.updateAwardStatus));
router.delete("/:id", awardIdValidator, validateRequest, asyncHandler(aboutAwardController.deleteAward));

module.exports = router;
