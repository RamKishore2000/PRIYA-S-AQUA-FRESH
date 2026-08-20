import { getBanners, getCategories, getCouponOffers, getProducts, getReviews, getTestimonials } from "@/services/catalog-service";
import type { Product, Review, Testimonial } from "@/types/product";

export async function getHomeData() {
  const [categories, banners, products, couponOffers, testimonials, reviews] = await Promise.all([
    getCategories().catch(() => []),
    getBanners().catch(() => []),
    getProducts().catch(() => []),
    getCouponOffers().catch(() => []),
    getTestimonials().catch(() => []),
    getReviews().catch(() => []),
  ]);
  const customerFeedback = [...reviews.map(reviewToTestimonial), ...testimonials];

  return {
    categories: categories.slice(0, 5),
    banners,
    products: getBalancedTopProducts(products, 8),
    couponOffers,
    testimonials: customerFeedback.slice(0, 3),
  };
}

function getBalancedTopProducts(products: Product[], limit: number) {
  const categoryMap = new Map<string, Product[]>();

  for (const product of products) {
    const category = product.category || "Other";
    const group = categoryMap.get(category) || [];
    group.push(product);
    categoryMap.set(category, group);
  }

  const selected: Product[] = [];
  const groups = Array.from(categoryMap.values()).filter((group) => group.length > 0);
  let round = 0;

  while (selected.length < limit && groups.some((group) => group[round])) {
    for (const group of groups) {
      const product = group[round];
      if (product) {
        selected.push(product);
      }
      if (selected.length === limit) {
        break;
      }
    }
    round += 1;
  }

  return selected;
}

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
