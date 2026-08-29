const categoryRepository = require("../repositories/category.repository");
const productRepository = require("../repositories/product.repository");
const subcategoryRepository = require("../repositories/subcategory.repository");
const { ApiError } = require("../utils/apiError");
const { generateSlug } = require("../utils/slug");

async function listProducts(filters) {
  return productRepository.findAll(filters);
}

async function getProductById(id) {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }
  return product;
}

async function getProductBySlug(slug) {
  const product = await productRepository.findBySlug(slug);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }
  return product;
}

async function createProduct(payload) {
  const normalized = await normalizeProductPayload(payload);
  const existingSlug = await productRepository.findBySlug(normalized.slug);
  if (existingSlug) {
    throw new ApiError(409, "Product with this name already exists.");
  }
  const existingSku = await productRepository.findBySku(normalized.sku);
  if (existingSku) {
    throw new ApiError(409, "Product SKU already exists.");
  }
  return productRepository.createProduct(normalized);
}

async function updateProduct(id, payload) {
  const current = await getProductById(id);
  const normalized = await normalizeProductPayload(payload);
  const existingSlug = await productRepository.findBySlug(normalized.slug);
  if (existingSlug && String(existingSlug.id) !== String(current.id)) {
    throw new ApiError(409, "Product with this name already exists.");
  }
  const existingSku = await productRepository.findBySku(normalized.sku);
  if (existingSku && String(existingSku.id) !== String(current.id)) {
    throw new ApiError(409, "Product SKU already exists.");
  }
  return productRepository.updateProduct(id, normalized);
}

async function deleteProduct(id) {
  await getProductById(id);
  const isUsedInOrders = await productRepository.hasOrderItems(id);
  if (isUsedInOrders) {
    throw new ApiError(409, "This product is already used in orders. Mark it inactive instead of deleting it.");
  }
  const deleted = await productRepository.deleteProduct(id);
  if (!deleted) {
    throw new ApiError(404, "Product not found.");
  }
}

async function normalizeProductPayload(payload) {
  const category = await categoryRepository.findById(payload.categoryId);
  if (!category) {
    throw new ApiError(422, "Selected category does not exist.", { categoryId: "Selected category does not exist." });
  }

  let subcategory = null;
  if (payload.subcategoryId) {
    subcategory = await subcategoryRepository.findById(payload.subcategoryId);
    if (!subcategory) {
      throw new ApiError(422, "Selected subcategory does not exist.", { subcategoryId: "Selected subcategory does not exist." });
    }
    if (String(subcategory.categoryId) !== String(payload.categoryId)) {
      throw new ApiError(422, "Selected subcategory does not belong to this category.", { subcategoryId: "Selected subcategory does not belong to this category." });
    }
  }

  const images = Array.isArray(payload.images) ? payload.images : [];
  if (images.length === 0 || images.length > 4) {
    throw new ApiError(422, "Product must have 1 to 4 images.", { images: "Product must have 1 to 4 images." });
  }

  const productSku = payload.sku && payload.sku.trim()
    ? payload.sku.trim().toUpperCase()
    : generateProductSku(payload.name);

  return {
    categoryId: payload.categoryId,
    subcategoryId: subcategory ? payload.subcategoryId : null,
    name: payload.name.trim(),
    slug: generateSlug(payload.name),
    sku: productSku,
    description: payload.description.trim(),
    rating: payload.rating === undefined || payload.rating === "" ? 0 : Number(payload.rating),
    reviewCount: payload.reviewCount === undefined || payload.reviewCount === "" ? 0 : Number(payload.reviewCount),
    sortOrder: payload.sortOrder === undefined || payload.sortOrder === "" || payload.sortOrder === null ? 999 : Number(payload.sortOrder),
    status: payload.status || "ACTIVE",
    customerOriginalPrice: Number(payload.customerOriginalPrice),
    customerSellingPrice: Number(payload.customerSellingPrice),
    dealerOriginalPrice: Number(payload.dealerOriginalPrice),
    dealerSellingPrice: Number(payload.dealerSellingPrice),
    images: images.map((image) => ({
      imageUrl: image.imageUrl,
      altText: image.altText,
    })),
  };
}

function generateProductSku(name) {
  const base = generateSlug(name)
    .replace(/-/g, "")
    .slice(0, 18)
    .toUpperCase() || "PRODUCT";
  return `${base}-${Date.now().toString(36).toUpperCase()}`;
}

module.exports = {
  listProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
