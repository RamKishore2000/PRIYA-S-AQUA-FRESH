import { getBanners, getCategories, getCouponOffers, getProducts, getReviews, getTestimonials } from "@/services/catalog-service";
import type { Banner, Category, CouponOffer, Product, Review, Testimonial } from "@/types/product";

export async function getHomeData() {
  const [categories, banners, products, couponOffers, testimonials, reviews] = await Promise.all([
    getCategories().catch(() => fallbackCategories),
    getBanners().catch(() => fallbackBanners),
    getProducts().catch(() => fallbackProducts),
    getCouponOffers().catch(() => fallbackCouponOffers),
    getTestimonials().catch(() => fallbackTestimonials),
    getReviews().catch(() => []),
  ]);
  const customerFeedback = [...reviews.map(reviewToTestimonial), ...testimonials];

  return {
    categories,
    banners: banners.length ? banners : fallbackBanners,
    products: products.length ? products.slice(0, 8) : fallbackProducts,
    couponOffers: couponOffers.length ? couponOffers : fallbackCouponOffers,
    testimonials: customerFeedback.length ? customerFeedback : fallbackTestimonials,
  };
}

const fallbackCategories: Category[] = [
  { id: "ro", name: "RO Water Purifiers", slug: "ro-water-purifiers", productCount: 0, image: "/images/hero/ro-purifier.png" },
  { id: "alkaline", name: "Alkaline Water Purifiers", slug: "alkaline-water-purifiers", productCount: 0, image: "/images/hero/alkaline-purifier.png" },
  { id: "commercial", name: "Commercial Water Purifiers", slug: "commercial-water-purifiers", productCount: 0, image: "/images/hero/commercial-ro.png" },
  { id: "electronics", name: "Electronics", slug: "electronics", productCount: 0, image: "/images/hero/smart-tv.png" },
];

const fallbackBanners: Banner[] = [
  {
    id: "hero-ro",
    title: "Pure Water, Refined for Modern Living",
    subtitle: "Priya's Aqua Fresh",
    description: "Premium RO and alkaline purification with elegant design, dependable performance and service you can trust.",
    image: "/Untitled-design-10-2048x2048.png",
    buttonText: "Explore Collection",
    buttonLink: "/products",
    themeColor: "#12a8e6",
    glowColor: "rgba(18,168,230,0.34)",
    sortOrder: 1,
  },
];

const fallbackProducts: Product[] = [
  {
    id: "fallback-ro",
    slug: "ro-water-purifier",
    name: "Priya's Aqua Fresh RO Purifier",
    category: "RO Water Purifiers",
    description: "Reliable everyday purification.",
    price: 16999,
    originalPrice: 19999,
    discount: 15,
    rating: 4.8,
    reviewCount: 24,
    image: "/images/hero/ro-purifier.png",
    images: ["/images/hero/ro-purifier.png"],
    stock: "in-stock",
  },
];

const fallbackCouponOffers: CouponOffer[] = [
  {
    id: "welcome-offer",
    code: "AQUA10",
    title: "Welcome savings on pure water",
    subtitle: "Use this coupon on checkout for premium purifier deals.",
    image: "/Untitled-design-10-2048x2048.png",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minimumOrderAmount: 2500,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    sortOrder: 1,
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-review",
    name: "Priya Customer",
    role: "Customer",
    rating: 4.9,
    review: "Excellent products and reliable support for our home water purifier.",
    product: "Water Purifier",
    avatar: "P",
  },
];

function reviewToTestimonial(review: Review): Testimonial {
  return {
    id: `review-${review.id}`,
    name: review.name,
    role: review.role,
    rating: review.rating,
    review: review.message,
    product: "Customer Review",
    avatar: review.name.slice(0, 1).toUpperCase(),
  };
}
