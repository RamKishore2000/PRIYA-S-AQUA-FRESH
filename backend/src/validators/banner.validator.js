const { body, param, query } = require("express-validator");

const bannerIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid banner id is required."),
];

const bannerListValidator = [
  query("includeInactive").optional().isBoolean().withMessage("includeInactive must be true or false."),
];

const bannerPayloadValidator = [
  body("title").trim().notEmpty().withMessage("Banner title is required.").isLength({ max: 160 }).withMessage("Banner title is too long."),
  body("subtitle").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 255 }).withMessage("Subtitle is too long."),
  body("description").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 1200 }).withMessage("Description is too long."),
  body("imageUrl").trim().notEmpty().withMessage("Banner image is required.").isLength({ max: 500 }).withMessage("Image URL is too long."),
  body("buttonText").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 80 }).withMessage("Button text is too long."),
  body("buttonLink").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 255 }).withMessage("Button link is too long."),
  body("themeColor").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 40 }).withMessage("Theme color is too long."),
  body("glowColor").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 80 }).withMessage("Glow color is too long."),
  body("sortOrder").optional().isInt({ min: 0 }).withMessage("Sort order must be zero or greater."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

const bannerStatusValidator = [
  body("status").isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

module.exports = {
  bannerIdValidator,
  bannerListValidator,
  bannerPayloadValidator,
  bannerStatusValidator,
};
