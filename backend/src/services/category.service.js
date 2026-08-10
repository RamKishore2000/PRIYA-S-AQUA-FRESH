const categoryRepository = require("../repositories/category.repository");
const { ApiError } = require("../utils/apiError");
const { generateSlug } = require("../utils/slug");

async function listCategories({ includeInactive = false } = {}) {
  return categoryRepository.findAll({ includeInactive });
}

async function getCategory(id) {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }
  return category;
}

async function createCategory(payload) {
  const slug = generateSlug(payload.name);
  const existing = await categoryRepository.findBySlug(slug);
  if (existing) {
    throw new ApiError(409, "Category with this name already exists.");
  }

  return categoryRepository.createCategory({
    name: payload.name.trim(),
    slug,
    imageUrl: payload.imageUrl,
    description: payload.description?.trim(),
    status: payload.status || "ACTIVE",
  });
}

async function updateCategory(id, payload) {
  const current = await getCategory(id);
  const slug = generateSlug(payload.name);
  const existing = await categoryRepository.findBySlug(slug);
  if (existing && String(existing.id) !== String(current.id)) {
    throw new ApiError(409, "Category with this name already exists.");
  }

  return categoryRepository.updateCategory(id, {
    name: payload.name.trim(),
    slug,
    imageUrl: payload.imageUrl,
    description: payload.description?.trim(),
    status: payload.status || current.status,
  });
}

async function deleteCategory(id) {
  await getCategory(id);
  const deleted = await categoryRepository.deleteCategory(id);
  if (!deleted) {
    throw new ApiError(404, "Category not found.");
  }
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
