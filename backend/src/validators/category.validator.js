const { body, param, query } = require("express-validator");

const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid category id is required."),
];

const categoryPayloadValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required.").isLength({ max: 120 }).withMessage("Category name is too long."),
  body("imageUrl").optional({ nullable: true, checkFalsy: true }).isLength({ max: 500 }).withMessage("Image URL is too long."),
  body("description").optional({ nullable: true, checkFalsy: true }).isLength({ max: 5000 }).withMessage("Description is too long."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status must be ACTIVE or INACTIVE."),
];

const categoryListValidator = [
  query("includeInactive").optional().isBoolean().withMessage("includeInactive must be true or false."),
];

module.exports = {
  idParamValidator,
  categoryPayloadValidator,
  categoryListValidator,
};
