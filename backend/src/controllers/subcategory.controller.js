const subcategoryService = require("../services/subcategory.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listSubcategories(req, res) {
  const subcategories = await subcategoryService.listSubcategories({
    includeInactive: req.query.includeInactive === "true",
    categoryId: req.query.categoryId,
    categorySlug: req.query.category,
  });
  return sendSuccess(res, 200, "Subcategories fetched successfully.", { subcategories });
}

async function getSubcategory(req, res) {
  const subcategory = await subcategoryService.getSubcategory(req.params.id);
  return sendSuccess(res, 200, "Subcategory fetched successfully.", { subcategory });
}

async function createSubcategory(req, res) {
  const subcategory = await subcategoryService.createSubcategory(req.body);
  return sendSuccess(res, 201, "Subcategory created successfully.", { subcategory });
}

async function updateSubcategory(req, res) {
  const subcategory = await subcategoryService.updateSubcategory(req.params.id, req.body);
  return sendSuccess(res, 200, "Subcategory updated successfully.", { subcategory });
}

async function deleteSubcategory(req, res) {
  await subcategoryService.deleteSubcategory(req.params.id);
  return sendSuccess(res, 200, "Subcategory deleted successfully.");
}

module.exports = {
  listSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};