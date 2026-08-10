const categoryService = require("../services/category.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listCategories(req, res) {
  const includeInactive = req.query.includeInactive === "true";
  const categories = await categoryService.listCategories({ includeInactive });
  return sendSuccess(res, 200, "Categories fetched successfully.", { categories });
}

async function getCategory(req, res) {
  const category = await categoryService.getCategory(req.params.id);
  return sendSuccess(res, 200, "Category fetched successfully.", { category });
}

async function createCategory(req, res) {
  const category = await categoryService.createCategory(req.body);
  return sendSuccess(res, 201, "Category created successfully.", { category });
}

async function updateCategory(req, res) {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return sendSuccess(res, 200, "Category updated successfully.", { category });
}

async function deleteCategory(req, res) {
  await categoryService.deleteCategory(req.params.id);
  return sendSuccess(res, 200, "Category deleted successfully.");
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
