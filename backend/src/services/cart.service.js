const cartRepository = require("../repositories/cart.repository");
const productRepository = require("../repositories/product.repository");
const { ApiError } = require("../utils/apiError");

async function getCart(userId, role) {
  const rows = await cartRepository.getCart(userId);
  const items = [];
  for (const row of rows) {
    const product = await productRepository.findById(row.product_id);
    if (product) {
      const selectedImageUrl = row.selected_image_url || "";
      const selectedProduct = selectedImageUrl ? withSelectedImage(product, selectedImageUrl) : product;
      items.push({
        product: selectedProduct,
        quantity: Number(row.quantity),
        selectedColorName: row.selected_color_name || "",
        selectedColorCode: row.selected_color_code || "",
        selectedImageUrl,
        selectedVariantKey: row.selected_variant_key || "",
      });
    }
  }
  const subtotal = items.reduce((total, item) => total + getSellingPrice(item.product, role) * item.quantity, 0);
  return { items, subtotal, count: items.reduce((total, item) => total + item.quantity, 0) };
}

async function addItem(userId, payload, role) {
  const productId = Number(payload.productId);
  const quantity = Number(payload.quantity || 1);
  if (!Number.isInteger(productId) || productId < 1) {
    throw new ApiError(422, "Product is required.", { productId: "Product is required." });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(422, "Quantity must be at least 1.", { quantity: "Quantity must be at least 1." });
  }
  const product = await productRepository.findById(productId);
  if (!product || product.status !== "ACTIVE") {
    throw new ApiError(404, "Product not found.");
  }
  const selection = normalizeSelection(product, payload);
  await cartRepository.upsertItem(userId, productId, quantity, selection);
  return getCart(userId, role);
}

async function updateItem(userId, productId, payload, role) {
  const quantity = Number(payload.quantity);
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new ApiError(422, "Quantity must be 0 or more.", { quantity: "Quantity must be 0 or more." });
  }
  await cartRepository.setItemQuantity(userId, Number(productId), quantity, String(payload.selectedVariantKey || ""));
  return getCart(userId, role);
}

async function removeItem(userId, productId, role, selectedVariantKey = "") {
  await cartRepository.removeItem(userId, Number(productId), String(selectedVariantKey || ""));
  return getCart(userId, role);
}

async function clearCart(userId, role) {
  await cartRepository.clearCart(userId);
  return getCart(userId, role);
}

function normalizeSelection(product, payload = {}) {
  const selectedImageUrl = String(payload.selectedImageUrl || "").trim();
  if (!selectedImageUrl) return { variantKey: "" };

  const matchedImage = product.images.find((image) => sameImageUrl(image.imageUrl, selectedImageUrl));
  if (!matchedImage) {
    throw new ApiError(422, "Selected color is not available for this product.", { selectedImageUrl: "Selected color is not available for this product." });
  }

  const canonicalImageUrl = matchedImage.imageUrl;
  const colorName = String(payload.selectedColorName || matchedImage.colorName || "").trim();
  const colorCode = String(payload.selectedColorCode || matchedImage.colorCode || "").trim();
  return {
    colorName,
    colorCode,
    imageUrl: canonicalImageUrl,
    variantKey: buildVariantKey(canonicalImageUrl, colorName, colorCode),
  };
}

function withSelectedImage(product, selectedImageUrl) {
  const selectedImage = product.images.find((image) => sameImageUrl(image.imageUrl, selectedImageUrl));
  if (!selectedImage) return product;
  return {
    ...product,
    images: [selectedImage, ...product.images.filter((image) => !sameImageUrl(image.imageUrl, selectedImageUrl))],
  };
}

function sameImageUrl(first, second) {
  const left = String(first || "").trim();
  const right = String(second || "").trim();
  return left === right || left.endsWith(right) || right.endsWith(left);
}

function buildVariantKey(imageUrl, colorName = "", colorCode = "") {
  return [imageUrl, colorName, colorCode].map((value) => String(value || "").trim().toLowerCase()).join("|").slice(0, 255);
}

function getSellingPrice(product, role) {
  return Number(role === "DEALER" ? product.prices.dealerSellingPrice : product.prices.customerSellingPrice);
}

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  normalizeSelection,
  withSelectedImage,
  buildVariantKey,
};
