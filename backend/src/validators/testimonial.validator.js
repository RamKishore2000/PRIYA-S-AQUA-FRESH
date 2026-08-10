const { body, param, query } = require("express-validator");

const testimonialIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid testimonial id is required."),
];

const testimonialListValidator = [
  query("includeInactive").optional().isBoolean().withMessage("includeInactive must be true or false."),
];

const testimonialPayloadValidator = [
  body("customerName").trim().notEmpty().withMessage("Customer name is required.").isLength({ max: 120 }).withMessage("Customer name is too long."),
  body("role").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 80 }).withMessage("Role is too long."),
  body("rating").isFloat({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
  body("message").trim().notEmpty().withMessage("Message is required.").isLength({ max: 1000 }).withMessage("Message is too long."),
  body("imageUrl").optional({ nullable: true, checkFalsy: true }).isLength({ max: 500 }).withMessage("Image URL is too long."),
  body("sortOrder").optional().isInt({ min: 0 }).withMessage("Sort order must be zero or greater."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

const testimonialStatusValidator = [
  body("status").isIn(["ACTIVE", "INACTIVE"]).withMessage("Status is invalid."),
];

module.exports = {
  testimonialIdValidator,
  testimonialListValidator,
  testimonialPayloadValidator,
  testimonialStatusValidator,
};
