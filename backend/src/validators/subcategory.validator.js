const { body, param, query } = require("express-validator");

const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid subcategory id is required."),
];

const subcategoryListValidator = [
  query("includeInactive").optional().isBoolean().withMessage("includeInactive must be true or false."),
  query("categoryId").optional().isInt({ min: 1 }).withMessage("Category id is invalid."),
  query("category").optional().trim().isLength({ min: 1, max: 150 }).withMessage("Category slug is invalid."),
];

const subcategoryPayloadValidator = [
  body("categoryId").isInt({ min: 1 }).withMessage("Category is required."),
  body("name").trim().notEmpty().withMessage("Subcategory name is required.").isLength({ max: 120 }).withMessage("Subcategory name is too long."),
  body("imageUrl").optional({ nullable: true, checkFalsy: true }).isLength({ max: 500 }).withMessage("Image URL is too long."),
  body("description").optional({ nullable: true, checkFalsy: true }).isLength({ max: 5000 }).withMessage("Description is too long."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status must be ACTIVE or INACTIVE."),
];

module.exports = {
  idParamValidator,
  subcategoryListValidator,
  subcategoryPayloadValidator,
};