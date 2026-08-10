import type { Category, Product, Testimonial } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  productsCount: number;
};

type ApiProduct = {
  id: number;
  slug: string;
  sku?: string;
  name: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  category: { name: string; slug: string };
  prices: {
    customerOriginalPrice: number;
    customerSellingPrice: number;
    dealerOriginalPrice: number;
    dealerSellingPrice: number;
  };
  images: { imageUrl: string }[];
};

type ApiTestimonial = {
  id: number;
  customerName: string;
  role: string | null;
  rating: number;
  message: string;
  imageUrl: string | null;
};

async function request<T>(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Unable to fetch catalog data.");
  }
  return result.data;
}

export async function getCategories() {
  const data = await request<{ categories: ApiCategory[] }>("/api/categories");
  return data.categories.map(mapCategory);
}

export async function getProducts(categorySlug?: string, searchTerm?: string) {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (searchTerm) params.set("search", searchTerm);
  const query = params.toString() ? `?${params.toString()}` : "";
  const data = await request<{ products: ApiProduct[] }>(`/api/products${query}`);
  return data.products.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const data = await request<{ product: ApiProduct }>(`/api/products/slug/${slug}`);
  return mapProduct(data.product);
}

export async function getTestimonials() {
  const data = await request<{ testimonials: ApiTestimonial[] }>("/api/testimonials");
  return data.testimonials.map(mapTestimonial);
}

function withApiUrl(url?: string | null) {
  if (!url) return "/images/products/hero-purifier.svg";
  if (url.startsWith("http") || url.startsWith("/images")) return url;
  return `${API_BASE_URL}${url}`;
}

function mapCategory(category: ApiCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    productCount: category.productsCount,
    image: withApiUrl(category.imageUrl),
    accent: "bg-teal-50",
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
    stock: "in-stock",
  };
}

function mapTestimonial(testimonial: ApiTestimonial): Testimonial {
  return {
    id: String(testimonial.id),
    name: testimonial.customerName,
    role: testimonial.role || "Customer",
    rating: Number(testimonial.rating || 0),
    review: testimonial.message,
    product: testimonial.role || "Priya's Aqua Fresh",
    avatar: testimonial.customerName.slice(0, 1).toUpperCase(),
    imageUrl: testimonial.imageUrl ? withApiUrl(testimonial.imageUrl) : undefined,
  };
}
