const productRepository = require("../repositories/product.repository");
const wishlistRepository = require("../repositories/wishlist.repository");
const { ApiError } = require("../utils/apiError");
const { normalizeSelection, withSelectedImage, buildVariantKey } = require("./cart.service");

async function getWishlist(userId) {
  const rows = await wishlistRepository.getWishlist(userId);
  const products = [];
  const productIds = [];
  const itemKeys = [];

  for (const row of rows) {
    const product = await productRepository.findById(row.product_id);
    if (!product) continue;

    const selectedImageUrl = row.selected_image_url || "";
    const selectedVariantKey = row.selected_variant_key || "";
    const selectedProduct = selectedImageUrl ? withSelectedImage(product, selectedImageUrl) : product;
    products.push({
      ...selectedProduct,
      selectedColorName: row.selected_color_name || "",
      selectedColorCode: row.selected_color_code || "",
      selectedImageUrl,
      selectedVariantKey,
    });
    productIds.push(String(product.id));
    itemKeys.push(buildWishlistKey(product.id, selectedVariantKey));
  }

  return { products, productIds, itemKeys };
}

async function addItem(userId, payload) {
  const productId = Number(payload.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    throw new ApiError(422, "Product is required.", { productId: "Product is required." });
  }
  const product = await productRepository.findById(productId);
  if (!product || product.status !== "ACTIVE") {
    throw new ApiError(404, "Product not found.");
  }
  const selection = normalizeSelection(product, payload);
  await wishlistRepository.addItem(userId, productId, selection);
  return getWishlist(userId);
}

async function removeItem(userId, productId, selectedVariantKey = "") {
  await wishlistRepository.removeItem(userId, Number(productId), String(selectedVariantKey || ""));
  return getWishlist(userId);
}

function buildWishlistKey(productId, selectedVariantKey = "") {
  return `${productId}:${selectedVariantKey || ""}`;
}

module.exports = {
  getWishlist,
  addItem,
  removeItem,
  buildWishlistKey,
};
