import { apiRequest } from "@/services/auth-service";
import type { Product, ProductImageVariant } from "@/types/product";

export type SelectedProductVariant = {
  selectedColorName?: string;
  selectedColorCode?: string;
  selectedImageUrl?: string;
  selectedVariantKey?: string;
};

type ApiProductImage = {
  imageUrl: string;
  colorName?: string | null;
  colorCode?: string | null;
  isPrimary?: boolean;
};

type ApiProduct = {
  id: number;
  slug: string;
  sku?: string;
  name: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  sortOrder?: number;
  status: "ACTIVE" | "INACTIVE";
  category: { name: string; slug: string };
  prices: {
    customerOriginalPrice: number;
    customerSellingPrice: number;
    dealerOriginalPrice: number;
    dealerSellingPrice: number;
  };
  images: ApiProductImage[];
  selectedColorName?: string | null;
  selectedColorCode?: string | null;
  selectedImageUrl?: string | null;
  selectedVariantKey?: string | null;
};

export type CartItem = ProductSelection & { product: Product; quantity: number };
export type ProductSelection = {
  selectedColorName?: string;
  selectedColorCode?: string;
  selectedImageUrl?: string;
  selectedVariantKey?: string;
};
export type CartState = { items: CartItem[]; subtotal: number; count: number };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function withApiUrl(url?: string | null) {
  if (!url) return "/images/hero/ro-purifier.png";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  if (url.startsWith("/")) return url;
  return `${API_BASE_URL}${url}`;
}

export function buildSelectedVariantPayload(variant?: ProductImageVariant | SelectedProductVariant | null) {
  if (!variant) return {};
  const selectedImageUrl = normalizeApiUploadUrl("imageUrl" in variant ? variant.imageUrl : variant.selectedImageUrl);
  const selectedColorName = "imageUrl" in variant ? variant.colorName : variant.selectedColorName;
  const selectedColorCode = "imageUrl" in variant ? variant.colorCode : variant.selectedColorCode;
  const selectedVariantKey = "selectedVariantKey" in variant ? normalizeVariantKey(variant.selectedVariantKey) : buildVariantKey(selectedImageUrl, selectedColorName, selectedColorCode);
  return {
    selectedImageUrl: selectedImageUrl || undefined,
    selectedColorName: selectedColorName || undefined,
    selectedColorCode: selectedColorCode || undefined,
    selectedVariantKey: selectedVariantKey || undefined,
  };
}

export function buildVariantKey(imageUrl?: string, colorName = "", colorCode = "") {
  if (!imageUrl) return "";
  return [imageUrl, colorName, colorCode].map((value) => String(value || "").trim().toLowerCase()).join("|").slice(0, 255);
}

export function normalizeVariantKey(key?: string | null) {
  const value = String(key || "").trim();
  if (!value) return "";
  const uploadsIndex = value.indexOf("/uploads/");
  return uploadsIndex >= 0 ? value.slice(uploadsIndex) : value;
}

function normalizeWishlistItemKey(itemKey?: string | null) {
  const value = String(itemKey || "").trim();
  const separatorIndex = value.indexOf(":");
  if (separatorIndex < 0) return value;
  return `${value.slice(0, separatorIndex)}:${normalizeVariantKey(value.slice(separatorIndex + 1))}`;
}
export function normalizeApiUploadUrl(url?: string | null) {
  const value = String(url || "").trim();
  if (!value) return "";
  const uploadsIndex = value.indexOf("/uploads/");
  if (uploadsIndex >= 0) return value.slice(uploadsIndex);
  return value;
}

function groupProductImageVariants(images: ApiProduct["images"]) {
  const common = images.find((image) => image.isPrimary && !image.colorName && !image.colorCode) || images[0];
  const groups = new Map<string, ProductImageVariant>();

  images.forEach((image) => {
    const imageUrl = withApiUrl(image.imageUrl);
    const colorName = image.colorName || "";
    const colorCode = image.colorCode || "";
    if (image === common && !colorName && !colorCode) return;
    if (!colorName && !colorCode && image.isPrimary) return;
    const key = `${colorName.toLowerCase()}|${colorCode.toLowerCase()}`;
    const existing = groups.get(key);
    if (existing) {
      existing.images = [...(existing.images || [existing.imageUrl]), imageUrl];
      return;
    }
    groups.set(key, { imageUrl, colorName, colorCode, isPrimary: false, images: [imageUrl] });
  });

  return {
    commonImage: common ? withApiUrl(common.imageUrl) : "",
    variants: Array.from(groups.values()),
  };
}
function mapProduct(product: ApiProduct): Product {
  const { commonImage, variants: imageVariants } = groupProductImageVariants(product.images);
  const image = product.selectedImageUrl ? withApiUrl(product.selectedImageUrl) : commonImage || imageVariants[0]?.imageUrl || withApiUrl(product.images[0]?.imageUrl);
  const price = Number(product.prices.customerSellingPrice);
  const originalPrice = Number(product.prices.customerOriginalPrice);
  return {
    id: String(product.id),
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    category: product.category.name,
    categorySlug: product.category.slug,
    description: product.description,
    price,
    originalPrice,
    customerPrice: price,
    customerOriginalPrice: originalPrice,
    dealerPrice: Number(product.prices.dealerSellingPrice),
    dealerOriginalPrice: Number(product.prices.dealerOriginalPrice),
    discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    image,
    images: imageVariants.length ? imageVariants.flatMap((item) => item.images?.length ? item.images : [item.imageUrl]) : [image],
    imageVariants: imageVariants.length ? imageVariants : [{ imageUrl: image, isPrimary: true, images: [image] }],
    stock: product.status === "ACTIVE" ? "in-stock" : "out-of-stock",
    sortOrder: Number(product.sortOrder ?? 999),
    selectedColorName: product.selectedColorName || "",
    selectedColorCode: product.selectedColorCode || "",
    selectedImageUrl: product.selectedImageUrl ? withApiUrl(product.selectedImageUrl) : "",
    selectedVariantKey: normalizeVariantKey(product.selectedVariantKey),
  };
}

function mapCart(cart: { items: (ProductSelection & { product: ApiProduct; quantity: number })[]; subtotal: number; count: number }): CartState {
  const items = new Map<string, CartItem>();

  for (const item of cart.items) {
    const selectedImageUrl = item.selectedImageUrl ? withApiUrl(item.selectedImageUrl) : "";
    const mappedProduct = mapProduct(item.product);
    const mappedItem: CartItem = {
      product: { ...mappedProduct, image: selectedImageUrl || mappedProduct.image },
      quantity: Number(item.quantity),
      selectedColorName: item.selectedColorName || "",
      selectedColorCode: item.selectedColorCode || "",
      selectedImageUrl,
      selectedVariantKey: normalizeVariantKey(item.selectedVariantKey),
    };
    const itemKey = `${mappedItem.product.id}:${mappedItem.selectedVariantKey || ""}`;
    const existing = items.get(itemKey);
    items.set(itemKey, existing ? { ...existing, quantity: existing.quantity + mappedItem.quantity } : mappedItem);
  }

  const nextItems = Array.from(items.values());
  return {
    items: nextItems,
    subtotal: nextItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
    count: nextItems.reduce((total, item) => total + item.quantity, 0),
  };
}

export async function fetchCart() {
  const data = await apiRequest<{ cart: { items: (ProductSelection & { product: ApiProduct; quantity: number })[]; subtotal: number; count: number } }>("/api/cart");
  return mapCart(data.cart);
}

export async function addCartItem(productId: string, quantity = 1, variant?: ProductImageVariant | ProductSelection | null) {
  const data = await apiRequest<{ cart: { items: (ProductSelection & { product: ApiProduct; quantity: number })[]; subtotal: number; count: number } }>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId: Number(productId), quantity, ...buildSelectedVariantPayload(variant) }),
  });
  return mapCart(data.cart);
}

export async function updateCartItem(productId: string, quantity: number, selectedVariantKey = "") {
  const data = await apiRequest<{ cart: { items: (ProductSelection & { product: ApiProduct; quantity: number })[]; subtotal: number; count: number } }>(`/api/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity, selectedVariantKey }),
  });
  return mapCart(data.cart);
}

export async function removeCartItem(productId: string, selectedVariantKey = "") {
  const query = selectedVariantKey ? `?selectedVariantKey=${encodeURIComponent(selectedVariantKey)}` : "";
  const data = await apiRequest<{ cart: { items: (ProductSelection & { product: ApiProduct; quantity: number })[]; subtotal: number; count: number } }>(`/api/cart/items/${productId}${query}`, { method: "DELETE" });
  return mapCart(data.cart);
}

export async function fetchWishlist() {
  const data = await apiRequest<{ wishlist: { products: ApiProduct[]; productIds: string[]; itemKeys?: string[] } }>("/api/wishlist");
  return { products: data.wishlist.products.map(mapProduct), productIds: data.wishlist.productIds, itemKeys: (data.wishlist.itemKeys || data.wishlist.productIds).map(normalizeWishlistItemKey) };
}

export async function addWishlistItem(productId: string, variant?: ProductImageVariant | ProductSelection | null) {
  const data = await apiRequest<{ wishlist: { products: ApiProduct[]; productIds: string[]; itemKeys?: string[] } }>("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId: Number(productId), ...buildSelectedVariantPayload(variant) }),
  });
  return { products: data.wishlist.products.map(mapProduct), productIds: data.wishlist.productIds, itemKeys: (data.wishlist.itemKeys || data.wishlist.productIds).map(normalizeWishlistItemKey) };
}

export async function removeWishlistItem(productId: string, selectedVariantKey = "") {
  const query = selectedVariantKey ? `?selectedVariantKey=${encodeURIComponent(selectedVariantKey)}` : "";
  const data = await apiRequest<{ wishlist: { products: ApiProduct[]; productIds: string[]; itemKeys?: string[] } }>(`/api/wishlist/${productId}${query}`, { method: "DELETE" });
  return { products: data.wishlist.products.map(mapProduct), productIds: data.wishlist.productIds, itemKeys: (data.wishlist.itemKeys || data.wishlist.productIds).map(normalizeWishlistItemKey) };
}
