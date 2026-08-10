const productService = require("../services/product.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listProducts(req, res) {
  const products = await productService.listProducts({
    includeInactive: req.query.includeInactive === "true",
    categorySlug: req.query.category,
    searchTerm: req.query.search,
  });
  return sendSuccess(res, 200, "Products fetched successfully.", { products });
}

async function getProductById(req, res) {
  const product = await productService.getProductById(req.params.id);
  return sendSuccess(res, 200, "Product fetched successfully.", { product });
}

async function getProductBySlug(req, res) {
  const product = await productService.getProductBySlug(req.params.slug);
  return sendSuccess(res, 200, "Product fetched successfully.", { product });
}

async function createProduct(req, res) {
  const product = await productService.createProduct(req.body);
  return sendSuccess(res, 201, "Product created successfully.", { product });
}

async function updateProduct(req, res) {
  const product = await productService.updateProduct(req.params.id, req.body);
  return sendSuccess(res, 200, "Product updated successfully.", { product });
}

async function deleteProduct(req, res) {
  await productService.deleteProduct(req.params.id);
  return sendSuccess(res, 200, "Product deleted successfully.");
}

module.exports = {
  listProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
