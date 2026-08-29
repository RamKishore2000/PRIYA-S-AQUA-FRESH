const { body, param, query } = require("express-validator");

const productIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid product id is required."),
];

const productSlugValidator = [
  param("slug").trim().notEmpty().withMessage("Valid product slug is required."),
];

const productListValidator = [
  query("includeInactive").optional().isBoolean().withMessage("includeInactive must be true or false."),
  query("category").optional().trim().isLength({ min: 1, max: 150 }).withMessage("Category slug is invalid."),
  query("subcategory").optional().trim().isLength({ min: 1, max: 150 }).withMessage("Subcategory slug is invalid."),
  query("search").optional().trim().isLength({ min: 1, max: 120 }).withMessage("Search query is invalid."),
];

const productPayloadValidator = [
  body("categoryId").isInt({ min: 1 }).withMessage("Category is required."),
  body("subcategoryId").optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).withMessage("Subcategory is invalid."),
  body("name").trim().notEmpty().withMessage("Product name is required.").isLength({ max: 180 }).withMessage("Product name is too long."),
  body("sku").optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 80 }).withMessage("Product code is too long."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5."),
  body("reviewCount").optional().isInt({ min: 0 }).withMessage("Review count must be 0 or more."),
  body("sortOrder").optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage("Sort order must be zero or greater."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE"]).withMessage("Status must be ACTIVE or INACTIVE."),
  body("customerOriginalPrice").isFloat({ min: 0 }).withMessage("Customer original price is required."),
  body("customerSellingPrice").isFloat({ min: 0 }).withMessage("Customer selling price is required."),
  body("dealerOriginalPrice").isFloat({ min: 0 }).withMessage("Dealer original price is required."),
  body("dealerSellingPrice").isFloat({ min: 0 }).withMessage("Dealer selling price is required."),
  body("images").isArray({ min: 1, max: 4 }).withMessage("Upload 1 to 4 product images."),
  body("images.*.imageUrl").trim().notEmpty().withMessage("Image URL is required.").isLength({ max: 500 }).withMessage("Image URL is too long."),
  body("images.*.altText").optional({ nullable: true, checkFalsy: true }).isLength({ max: 180 }).withMessage("Image alt text is too long."),
];

module.exports = {
  productIdValidator,
  productSlugValidator,
  productListValidator,
  productPayloadValidator,
};
