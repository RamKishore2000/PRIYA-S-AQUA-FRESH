const categoryRepository = require("../repositories/category.repository");
const subcategoryRepository = require("../repositories/subcategory.repository");
const { ApiError } = require("../utils/apiError");
const { generateSlug } = require("../utils/slug");

async function listSubcategories(filters = {}) {
  return subcategoryRepository.findAll(filters);
}

async function getSubcategory(id) {
  const subcategory = await subcategoryRepository.findById(id);
  if (!subcategory) {
    throw new ApiError(404, "Subcategory not found.");
  }
  return subcategory;
}

async function createSubcategory(payload) {
  const category = await categoryRepository.findById(payload.categoryId);
  if (!category) {
    throw new ApiError(422, "Selected category does not exist.", { categoryId: "Selected category does not exist." });
  }

  const slug = generateSlug(payload.name);
  const existing = await subcategoryRepository.findByCategoryAndSlug(payload.categoryId, slug);
  if (existing) {
    throw new ApiError(409, "Subcategory with this name already exists in this category.");
  }

  return subcategoryRepository.createSubcategory({
    categoryId: payload.categoryId,
    name: payload.name.trim(),
    slug,
    imageUrl: payload.imageUrl?.trim(),
    description: payload.description?.trim(),
    status: payload.status || "ACTIVE",
  });
}

async function updateSubcategory(id, payload) {
  const current = await getSubcategory(id);
  const category = await categoryRepository.findById(payload.categoryId);
  if (!category) {
    throw new ApiError(422, "Selected category does not exist.", { categoryId: "Selected category does not exist." });
  }

  const slug = generateSlug(payload.name);
  const existing = await subcategoryRepository.findByCategoryAndSlug(payload.categoryId, slug);
  if (existing && String(existing.id) !== String(current.id)) {
    throw new ApiError(409, "Subcategory with this name already exists in this category.");
  }

  return subcategoryRepository.updateSubcategory(id, {
    categoryId: payload.categoryId,
    name: payload.name.trim(),
    slug,
    imageUrl: payload.imageUrl?.trim(),
    description: payload.description?.trim(),
    status: payload.status || current.status,
  });
}

async function deleteSubcategory(id) {
  await getSubcategory(id);
  const deleted = await subcategoryRepository.deleteSubcategory(id);
  if (!deleted) {
    throw new ApiError(404, "Subcategory not found.");
  }
}

module.exports = {
  listSubcategories,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};