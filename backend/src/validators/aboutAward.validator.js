const { body, param, query } = require("express-validator");

const awardIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid award id is required."),
];

const awardListValidator = [
  query("includeInactive").optional().isBoolean().withMessage("includeInactive must be true or false."),
];

const awardPayloadValidator = [
  body("title").trim().notEmpty().withMessage("Award title is required.").isLength({ max: 160 }).withMessage("Award title is too long."),
  body("description").trim().notEmpty().withMessage("Award text is required.").isLength({ max: 500 }).withMessage("Award text must be 500 characters or less."),
  body("imageUrl").trim().notEmpty().withMessage("Award image is required.").isLength({ max: 500 }).withMessage("Image URL is too long."),
  body("sortOrder").optional().isInt({ min: 0 }).withMessage("Sort order must be zero or greater."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

const awardStatusValidator = [
  body("status").isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

module.exports = {
  awardIdValidator,
  awardListValidator,
  awardPayloadValidator,
  awardStatusValidator,
};
