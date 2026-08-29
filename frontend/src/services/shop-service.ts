import { apiRequest, getAccessToken } from "@/services/auth-service";
import type { Product } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";


type ApiProduct = {
  id: number;
  slug: string;
  sku?: string;
  name: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  status: "ACTIVE" | "INACTIVE";
  category: { name: string; slug: string };
  prices: {
    customerOriginalPrice: number;
    customerSellingPrice: number;
    dealerOriginalPrice: number;
    dealerSellingPrice: number;
  };
  images: { imageUrl: string }[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

type ApiCart = {
  items: { product: ApiProduct; quantity: number }[];
  subtotal: number;
  count: number;
};

type ApiWishlist = {
  products: ApiProduct[];
  productIds: string[];
};

export function hasAccessToken() {
  return Boolean(getAccessToken());
}

export async function fetchCart() {
  const data = await apiRequest<{ cart: ApiCart }>("/api/cart");
  return mapCart(data.cart);
}

export async function addCartItem(productId: string, quantity = 1) {
  const data = await apiRequest<{ cart: ApiCart }>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId: Number(productId), quantity }),
  });
  return mapCart(data.cart);
}

export async function updateCartItem(productId: string, quantity: number) {
  const data = await apiRequest<{ cart: ApiCart }>(`/api/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  return mapCart(data.cart);
}

export async function removeCartItem(productId: string) {
  const data = await apiRequest<{ cart: ApiCart }>(`/api/cart/items/${productId}`, { method: "DELETE" });
  return mapCart(data.cart);
}

export async function clearCartApi() {
  const data = await apiRequest<{ cart: ApiCart }>("/api/cart", { method: "DELETE" });
  return mapCart(data.cart);
}

export async function fetchWishlist() {
  const data = await apiRequest<{ wishlist: ApiWishlist }>("/api/wishlist");
  return {
    products: data.wishlist.products.map(mapProduct),
    productIds: data.wishlist.productIds,
  };
}

export async function addWishlistItem(productId: string) {
  const data = await apiRequest<{ wishlist: ApiWishlist }>("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId: Number(productId) }),
  });
  return {
    products: data.wishlist.products.map(mapProduct),
    productIds: data.wishlist.productIds,
  };
}

export async function removeWishlistItem(productId: string) {
  const data = await apiRequest<{ wishlist: ApiWishlist }>(`/api/wishlist/${productId}`, { method: "DELETE" });
  return {
    products: data.wishlist.products.map(mapProduct),
    productIds: data.wishlist.productIds,
  };
}

function withApiUrl(url?: string | null) {
  if (!url) return "/images/products/hero-purifier.svg";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  if (url.startsWith("/")) return url;
  return `${API_BASE_URL}${url}`;
}

function mapCart(cart: ApiCart) {
  return {
    items: cart.items.map((item) => ({ product: mapProduct(item.product), quantity: item.quantity })),
    subtotal: Number(cart.subtotal),
    count: Number(cart.count),
  };
}

function mapProduct(product: ApiProduct): Product {
  const image = withApiUrl(product.images[0]?.imageUrl);
  const price = Number(product.prices.customerSellingPrice);
  const originalPrice = Number(product.prices.customerOriginalPrice);
  const dealerPrice = Number(product.prices.dealerSellingPrice);
  const dealerOriginalPrice = Number(product.prices.dealerOriginalPrice);
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  return {
    id: String(product.id),
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    category: product.category.name,
    description: product.description,
    price,
    originalPrice,
    customerPrice: price,
    customerOriginalPrice: originalPrice,
    dealerPrice,
    dealerOriginalPrice,
    discount,
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    image,
    images: product.images.length ? product.images.map((item) => withApiUrl(item.imageUrl)) : [image],
    stock: product.status === "ACTIVE" ? "in-stock" : "out-of-stock",
  };
}

