const { body, param } = require("express-validator");

const couponIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid coupon id is required."),
];

const couponPayloadValidator = [
  body("code").trim().notEmpty().withMessage("Coupon code is required.").isLength({ max: 40 }).withMessage("Coupon code is too long."),
  body("discountType").isIn(["PERCENTAGE", "FLAT_AMOUNT"]).withMessage("Discount type is invalid."),
  body("discountValue").isFloat({ min: 0.01 }).withMessage("Discount value is required."),
  body("minimumOrderAmount").isFloat({ min: 0 }).withMessage("Minimum order amount is required."),
  body("maximumDiscountAmount").optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0.01 }).withMessage("Maximum discount amount is invalid."),
  body("startAt").isISO8601().withMessage("Start date and time is required."),
  body("endAt").isISO8601().withMessage("End date and time is required."),
  body("usageLimit").isInt({ min: 1 }).withMessage("Usage limit is required."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

const couponStatusValidator = [
  body("status").isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

module.exports = {
  couponIdValidator,
  couponPayloadValidator,
  couponStatusValidator,
};
