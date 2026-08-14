import { apiRequest } from "@/services/auth-service";
import type { Product } from "@/types/product";

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

export type CartItem = { product: Product; quantity: number };
export type CartState = { items: CartItem[]; subtotal: number; count: number };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function withApiUrl(url?: string | null) {
  if (!url) return "/images/hero/ro-purifier.png";
  if (url.startsWith("http") || url.startsWith("/images") || url.startsWith("/Untitled")) return url;
  return `${API_BASE_URL}${url}`;
}

function mapProduct(product: ApiProduct): Product {
  const image = withApiUrl(product.images[0]?.imageUrl);
  const price = Number(product.prices.customerSellingPrice);
  const originalPrice = Number(product.prices.customerOriginalPrice);
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
    dealerPrice: Number(product.prices.dealerSellingPrice),
    dealerOriginalPrice: Number(product.prices.dealerOriginalPrice),
    discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    image,
    images: product.images.length ? product.images.map((item) => withApiUrl(item.imageUrl)) : [image],
    stock: product.status === "ACTIVE" ? "in-stock" : "out-of-stock",
  };
}

function mapCart(cart: { items: { product: ApiProduct; quantity: number }[]; subtotal: number; count: number }): CartState {
  return {
    items: cart.items.map((item) => ({ product: mapProduct(item.product), quantity: item.quantity })),
    subtotal: Number(cart.subtotal),
    count: Number(cart.count),
  };
}

export async function fetchCart() {
  const data = await apiRequest<{ cart: { items: { product: ApiProduct; quantity: number }[]; subtotal: number; count: number } }>("/api/cart");
  return mapCart(data.cart);
}

export async function addCartItem(productId: string, quantity = 1) {
  const data = await apiRequest<{ cart: { items: { product: ApiProduct; quantity: number }[]; subtotal: number; count: number } }>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId: Number(productId), quantity }),
  });
  return mapCart(data.cart);
}

export async function updateCartItem(productId: string, quantity: number) {
  const data = await apiRequest<{ cart: { items: { product: ApiProduct; quantity: number }[]; subtotal: number; count: number } }>(`/api/cart/items/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  return mapCart(data.cart);
}

export async function removeCartItem(productId: string) {
  const data = await apiRequest<{ cart: { items: { product: ApiProduct; quantity: number }[]; subtotal: number; count: number } }>(`/api/cart/items/${productId}`, { method: "DELETE" });
  return mapCart(data.cart);
}

export async function fetchWishlist() {
  const data = await apiRequest<{ wishlist: { products: ApiProduct[]; productIds: string[] } }>("/api/wishlist");
  return { products: data.wishlist.products.map(mapProduct), productIds: data.wishlist.productIds };
}

export async function addWishlistItem(productId: string) {
  const data = await apiRequest<{ wishlist: { products: ApiProduct[]; productIds: string[] } }>("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId: Number(productId) }),
  });
  return { products: data.wishlist.products.map(mapProduct), productIds: data.wishlist.productIds };
}

export async function removeWishlistItem(productId: string) {
  const data = await apiRequest<{ wishlist: { products: ApiProduct[]; productIds: string[] } }>(`/api/wishlist/${productId}`, { method: "DELETE" });
  return { products: data.wishlist.products.map(mapProduct), productIds: data.wishlist.productIds };
}
