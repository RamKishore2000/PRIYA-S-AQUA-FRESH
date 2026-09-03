import type { AboutAward, Banner, Category, CouponOffer, Product, ProductImageVariant, Review, Subcategory, Testimonial } from "@/types/product";

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
  subcategories?: ApiSubcategory[];
};


type ApiSubcategory = {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  productsCount: number;
};

type ApiAboutAward = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
};
type ApiBanner = {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
  themeColor: string | null;
  glowColor: string | null;
  sortOrder: number;
};

type ApiCoupon = {
  id: number;
  code: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  discountType: "PERCENTAGE" | "FLAT_AMOUNT";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  startAt: string;
  endAt: string;
  sortOrder: number;
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
  category: { id?: number; name: string; slug: string };
  subcategory?: { id?: number; name: string; slug: string } | null;
  prices: {
    customerOriginalPrice: number;
    customerSellingPrice: number;
    dealerOriginalPrice: number;
    dealerSellingPrice: number;
  };
  images: { imageUrl: string; colorName?: string | null; colorCode?: string | null; isPrimary?: boolean }[];
  createdAt?: string;
};

type ApiTestimonial = {
  id: number;
  customerName: string;
  role: string | null;
  rating: number;
  message: string;
  imageUrl: string | null;
};

type ApiReview = {
  id: number;
  customerName: string;
  role: "CUSTOMER" | "DEALER";
  rating: number;
  message: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "VISIBLE" | "HIDDEN";
  createdAt: string;
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

export async function getAboutAwards() {
  const data = await request<{ awards: ApiAboutAward[] }>("/api/about-awards");
  return data.awards.map(mapAboutAward);
}

export async function getBanners() {
  const data = await request<{ banners: ApiBanner[] }>("/api/banners");
  return data.banners.map(mapBanner);
}

export async function getCouponOffers() {
  const data = await request<{ coupons: ApiCoupon[] }>("/api/coupons/public");
  return data.coupons.map(mapCouponOffer);
}

export async function getProducts() {
  const data = await request<{ products: ApiProduct[] }>("/api/products");
  return data.products.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductById(id: string | number) {
  const data = await request<{ product: ApiProduct }>(`/api/products/${id}`);
  return mapProduct(data.product);
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) || null;
}

export async function searchProducts(query: string) {
  const products = await getProducts();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;
  return products.filter((product) =>
    [product.name, product.category, product.description, product.sku || ""].some((value) => value.toLowerCase().includes(normalized)),
  );
}

export async function getTestimonials() {
  const data = await request<{ testimonials: ApiTestimonial[] }>("/api/testimonials");
  return data.testimonials.map(mapTestimonial);
}

export async function getReviews(limit = 12) {
  const data = await request<{ reviews: ApiReview[] }>(`/api/reviews?limit=${limit}`);
  return data.reviews.map(mapReview);
}

function withApiUrl(url?: string | null) {
  if (!url) return "/images/hero/ro-purifier.png";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  if (url.startsWith("/")) return url;
  return `${API_BASE_URL}${url}`;
}

function mapCategory(category: ApiCategory): Category {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    productCount: category.productsCount,
    image: withApiUrl(category.imageUrl),
    subcategories: category.subcategories?.map(mapSubcategory) || [],
  };
}

function mapSubcategory(subcategory: ApiSubcategory): Subcategory {
  return {
    id: String(subcategory.id),
    categoryId: String(subcategory.categoryId),
    name: subcategory.name,
    slug: subcategory.slug,
    image: withApiUrl(subcategory.imageUrl),
    productCount: Number(subcategory.productsCount || 0),
  };
}

function mapAboutAward(award: ApiAboutAward): AboutAward {
  return {
    id: String(award.id),
    title: award.title,
    description: award.description,
    image: withApiUrl(award.imageUrl),
    sortOrder: Number(award.sortOrder || 0),
  };
}

function mapBanner(banner: ApiBanner): Banner {
  return {
    id: String(banner.id),
    title: banner.title,
    subtitle: banner.subtitle || undefined,
    description: banner.description || banner.subtitle || "Premium water purification designed for healthier everyday living.",
    image: withApiUrl(banner.imageUrl),
    buttonText: banner.buttonText || "Explore Range",
    buttonLink: banner.buttonLink || "/products",
    themeColor: banner.themeColor || "#12a8e6",
    glowColor: banner.glowColor || "rgba(18,168,230,0.32)",
    sortOrder: Number(banner.sortOrder || 0),
  };
}

function mapCouponOffer(coupon: ApiCoupon): CouponOffer {
  const defaultTitle = coupon.discountType === "PERCENTAGE"
    ? `${Number(coupon.discountValue)}% Festival Offer`
    : `Save Rs. ${Number(coupon.discountValue)}`;

  return {
    id: String(coupon.id),
    code: coupon.code,
    title: coupon.title || defaultTitle,
    subtitle: coupon.subtitle || "Apply this coupon at checkout for a limited-time Priya's Aqua Fresh offer.",
    image: coupon.imageUrl ? withApiUrl(coupon.imageUrl) : undefined,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    minimumOrderAmount: Number(coupon.minimumOrderAmount || 0),
    maximumDiscountAmount: coupon.maximumDiscountAmount ? Number(coupon.maximumDiscountAmount) : undefined,
    startAt: coupon.startAt,
    endAt: coupon.endAt,
    sortOrder: Number(coupon.sortOrder || 0),
  };
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
  const image = commonImage || imageVariants[0]?.imageUrl || withApiUrl(product.images[0]?.imageUrl);
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
    categorySlug: product.category.slug,
    subcategory: product.subcategory?.name,
    subcategorySlug: product.subcategory?.slug,
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
    images: imageVariants.length ? imageVariants.flatMap((item) => item.images?.length ? item.images : [item.imageUrl]) : [image],
    imageVariants: imageVariants.length ? imageVariants : [{ imageUrl: image, isPrimary: true, images: [image] }],
    stock: "in-stock",
    createdAt: product.createdAt,
    sortOrder: Number(product.sortOrder ?? 999),
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

function mapReview(review: ApiReview): Review {
  return {
    id: String(review.id),
    name: review.customerName,
    role: review.role === "DEALER" ? "Dealer" : "Customer",
    rating: Number(review.rating || 0),
    message: review.message,
    status: review.status === "APPROVED" || review.status === "VISIBLE" ? "Approved" : review.status === "REJECTED" || review.status === "HIDDEN" ? "Rejected" : "Pending",
    createdAt: review.createdAt,
  };
}
