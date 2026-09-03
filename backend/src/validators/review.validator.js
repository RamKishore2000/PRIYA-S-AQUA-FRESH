const { body, param, query } = require("express-validator");

const reviewIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid review id is required."),
];

const reviewListValidator = [
  query("includeHidden").optional().isBoolean().withMessage("includeHidden must be true or false."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),
];

const reviewPayloadValidator = [
  body("rating").isFloat({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
  body("message").trim().notEmpty().withMessage("Review message is required.").isLength({ max: 1000 }).withMessage("Review message is too long."),
];

const reviewStatusValidator = [
  body("status").isIn(["PENDING", "APPROVED", "REJECTED", "VISIBLE", "HIDDEN"]).withMessage("Review status is invalid."),
];

module.exports = {
  reviewIdValidator,
  reviewListValidator,
  reviewPayloadValidator,
  reviewStatusValidator,
};
