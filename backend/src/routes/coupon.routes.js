const express = require("express");
const couponController = require("../controllers/coupon.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const { couponIdValidator, couponPayloadValidator, couponStatusValidator } = require("../validators/coupon.validator");

const router = express.Router();

router.get("/", asyncHandler(couponController.listCoupons));
router.get("/public", asyncHandler(couponController.listPublicCoupons));
router.post("/validate", asyncHandler(couponController.validateCoupon));
router.get("/:id", couponIdValidator, validateRequest, asyncHandler(couponController.getCoupon));
router.post("/", couponPayloadValidator, validateRequest, asyncHandler(couponController.createCoupon));
router.put("/:id", couponIdValidator, couponPayloadValidator, validateRequest, asyncHandler(couponController.updateCoupon));
router.patch("/:id/status", couponIdValidator, couponStatusValidator, validateRequest, asyncHandler(couponController.updateCouponStatus));
router.delete("/:id", couponIdValidator, validateRequest, asyncHandler(couponController.deleteCoupon));

module.exports = router;
