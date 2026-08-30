const { body, param } = require("express-validator");

const couponIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid coupon id is required."),
];

const couponPayloadValidator = [
  body("code").trim().notEmpty().withMessage("Coupon code is required.").isLength({ max: 40 }).withMessage("Coupon code is too long."),
  body("title").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 160 }).withMessage("Offer title is too long."),
  body("subtitle").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 255 }).withMessage("Offer subtitle is too long."),
  body("imageUrl").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 500 }).withMessage("Offer image URL is too long."),
  body("discountType").isIn(["PERCENTAGE", "FLAT_AMOUNT"]).withMessage("Discount type is invalid."),
  body("discountValue").isFloat({ min: 0.01 }).withMessage("Discount value is required."),
  body("minimumOrderAmount").isFloat({ min: 0 }).withMessage("Minimum order amount is required."),
  body("maximumDiscountAmount").optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0.01 }).withMessage("Maximum discount amount is invalid."),
  body("startAt").isISO8601().withMessage("Start date and time is required."),
  body("endAt").isISO8601().withMessage("End date and time is required."),
  body("usageLimit").isInt({ min: 1 }).withMessage("Usage limit is required."),
  body("sortOrder").optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage("Sort order is invalid."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
  body("applicableProductIds").optional().isArray().withMessage("Selected products must be a list."),
  body("applicableProductIds.*").optional().isInt({ min: 1 }).withMessage("Selected product is invalid."),
];

const couponValidatePayloadValidator = [
  body("code").trim().notEmpty().withMessage("Coupon code is required."),
  body("subtotalAmount").isFloat({ min: 0.01 }).withMessage("Subtotal amount is required."),
  body("lineItems").optional().isArray().withMessage("Line items must be a list."),
  body("lineItems.*.productId").optional().isInt({ min: 1 }).withMessage("Line item product is invalid."),
  body("lineItems.*.lineTotal").optional().isFloat({ min: 0.01 }).withMessage("Line item total is invalid."),
];

const couponStatusValidator = [
  body("status").isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

module.exports = {
  couponIdValidator,
  couponPayloadValidator,
  couponValidatePayloadValidator,
  couponStatusValidator,
};