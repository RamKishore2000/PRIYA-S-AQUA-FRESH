const express = require("express");
const categoryController = require("../controllers/category.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  categoryListValidator,
  categoryPayloadValidator,
  idParamValidator,
} = require("../validators/category.validator");

const router = express.Router();

router.get("/", categoryListValidator, validateRequest, asyncHandler(categoryController.listCategories));
router.get("/:id", idParamValidator, validateRequest, asyncHandler(categoryController.getCategory));
router.post("/", categoryPayloadValidator, validateRequest, asyncHandler(categoryController.createCategory));
router.put("/:id", idParamValidator, categoryPayloadValidator, validateRequest, asyncHandler(categoryController.updateCategory));
router.delete("/:id", idParamValidator, validateRequest, asyncHandler(categoryController.deleteCategory));

module.exports = router;
