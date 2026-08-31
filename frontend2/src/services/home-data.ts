import { getBanners, getCategories, getCouponOffers, getProducts, getReviews, getTestimonials } from "@/services/catalog-service";
import type { Category, Product, Review, Testimonial } from "@/types/product";

const homeCategorySections = [
  { title: "RO Water Purifier", eyebrow: "RO Purifiers", slugs: ["ro-water-purifiers", "ro-water-purifier"] },
  { title: "Alkaline Water Purifiers", eyebrow: "Alkaline Range", slugs: ["alkaline-water-purifiers", "alkaline-water-purifier"] },
  { title: "Commercial Water Purifiers", eyebrow: "Commercial RO", slugs: ["commercial-water-purifiers", "commercial-water-purifier", "commercial-ro"] },
  { title: "Water Softeners", eyebrow: "Water Care", slugs: ["water-softeners", "water-softener"] },
  { title: "Spare Parts", eyebrow: "Service Essentials", slugs: ["spare-parts", "spear-parts", "spares", "spare"] },
  { title: "Geysers", eyebrow: "Hot Water", slugs: ["geysers", "geyser", "geser"] },
  { title: "Smart TV", eyebrow: "Electronics", slugs: ["smart-tv", "smart-tvs"] },
];

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
    categories,
    banners,
    products: getBalancedTopProducts(products, 8),
    trendingProducts: getTrendingProducts(products, 8),
    newProducts: getNewProducts(products, 8),
    categoryProductSections: getCategoryProductSections(products, categories),
    couponOffers,
    testimonials: customerFeedback.slice(0, 3),
  };
}

function getCategoryProductSections(products: Product[], categories: Category[]) {
  const usedCategoryKeys = new Set<string>();
  const sections = homeCategorySections
    .map((section) => {
      const category = categories.find((item) => section.slugs.includes(normalizeSlug(item.slug)) || section.slugs.includes(normalizeSlug(item.name)));
      const matchedSlugs = new Set([...(category ? [category.slug, category.name] : []), ...section.slugs].map(normalizeSlug));
      const sectionProducts = products.filter((product) => matchedSlugs.has(normalizeSlug(product.categorySlug || product.category)) || matchedSlugs.has(normalizeSlug(product.category)));

      for (const slug of matchedSlugs) {
        usedCategoryKeys.add(slug);
      }

      return {
        id: category?.id || section.slugs[0],
        title: category?.name || section.title,
        eyebrow: section.eyebrow,
        viewAllHref: `/products?category=${encodeURIComponent(category?.slug || section.slugs[0])}`,
        products: sectionProducts,
      };
    })
    .filter((section) => section.products.length > 0);

  const dynamicSections = categories
    .filter((category) => {
      const keys = [category.slug, category.name].map(normalizeSlug).filter(Boolean);
      return keys.length > 0 && !keys.some((key) => usedCategoryKeys.has(key));
    })
    .map((category) => {
      const keys = new Set([category.slug, category.name].map(normalizeSlug).filter(Boolean));
      const sectionProducts = products.filter((product) => keys.has(normalizeSlug(product.categorySlug || product.category)) || keys.has(normalizeSlug(product.category)));

      for (const key of keys) {
        usedCategoryKeys.add(key);
      }

      return {
        id: category.id,
        title: category.name,
        eyebrow: "Shop Products",
        viewAllHref: `/products?category=${encodeURIComponent(category.slug || category.name)}`,
        products: sectionProducts,
      };
    })
    .filter((section) => section.products.length > 0);

  return [...sections, ...dynamicSections].map((section, index) => ({
    ...section,
    tone: index % 2 === 0 ? "light" as const : "soft" as const,
  }));
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

function getTrendingProducts(products: Product[], limit: number) {
  return [...products]
    .sort((first, second) => {
      const firstScore = Number(first.rating || 0) * 100 + Number(first.reviewCount || 0);
      const secondScore = Number(second.rating || 0) * 100 + Number(second.reviewCount || 0);
      return secondScore - firstScore;
    })
    .slice(0, limit);
}

function getNewProducts(products: Product[], limit: number) {
  return [...products]
    .sort((first, second) => {
      const firstTime = first.createdAt ? new Date(first.createdAt).getTime() : Number(first.id) || 0;
      const secondTime = second.createdAt ? new Date(second.createdAt).getTime() : Number(second.id) || 0;
      return secondTime - firstTime;
    })
    .slice(0, limit);
}

function normalizeSlug(value?: string | null) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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