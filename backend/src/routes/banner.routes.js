const express = require("express");
const bannerController = require("../controllers/banner.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  bannerIdValidator,
  bannerListValidator,
  bannerPayloadValidator,
  bannerStatusValidator,
} = require("../validators/banner.validator");

const router = express.Router();

router.get("/", bannerListValidator, validateRequest, asyncHandler(bannerController.listBanners));
router.get("/:id", bannerIdValidator, validateRequest, asyncHandler(bannerController.getBanner));
router.post("/", bannerPayloadValidator, validateRequest, asyncHandler(bannerController.createBanner));
router.put("/:id", bannerIdValidator, bannerPayloadValidator, validateRequest, asyncHandler(bannerController.updateBanner));
router.patch("/:id/status", bannerIdValidator, bannerStatusValidator, validateRequest, asyncHandler(bannerController.updateBannerStatus));
router.delete("/:id", bannerIdValidator, validateRequest, asyncHandler(bannerController.deleteBanner));

module.exports = router;
