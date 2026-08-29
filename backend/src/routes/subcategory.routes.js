const express = require("express");
const subcategoryController = require("../controllers/subcategory.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  idParamValidator,
  subcategoryListValidator,
  subcategoryPayloadValidator,
} = require("../validators/subcategory.validator");

const router = express.Router();

router.get("/", subcategoryListValidator, validateRequest, asyncHandler(subcategoryController.listSubcategories));
router.get("/:id", idParamValidator, validateRequest, asyncHandler(subcategoryController.getSubcategory));
router.post("/", subcategoryPayloadValidator, validateRequest, asyncHandler(subcategoryController.createSubcategory));
router.put("/:id", idParamValidator, subcategoryPayloadValidator, validateRequest, asyncHandler(subcategoryController.updateSubcategory));
router.delete("/:id", idParamValidator, validateRequest, asyncHandler(subcategoryController.deleteSubcategory));

module.exports = router;