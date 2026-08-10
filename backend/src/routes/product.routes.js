const express = require("express");
const productController = require("../controllers/product.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  productIdValidator,
  productListValidator,
  productPayloadValidator,
  productSlugValidator,
} = require("../validators/product.validator");

const router = express.Router();

router.get("/", productListValidator, validateRequest, asyncHandler(productController.listProducts));
router.get("/slug/:slug", productSlugValidator, validateRequest, asyncHandler(productController.getProductBySlug));
router.get("/:id", productIdValidator, validateRequest, asyncHandler(productController.getProductById));
router.post("/", productPayloadValidator, validateRequest, asyncHandler(productController.createProduct));
router.put("/:id", productIdValidator, productPayloadValidator, validateRequest, asyncHandler(productController.updateProduct));
router.delete("/:id", productIdValidator, validateRequest, asyncHandler(productController.deleteProduct));

module.exports = router;
