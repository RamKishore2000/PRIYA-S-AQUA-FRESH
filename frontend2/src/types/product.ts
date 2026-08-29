export type Product = {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  category: string;
  categorySlug?: string;
  subcategory?: string;
  subcategorySlug?: string;
  description: string;
  price: number;
  originalPrice?: number;
  customerPrice?: number;
  customerOriginalPrice?: number;
  dealerPrice?: number;
  dealerOriginalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  stock: "in-stock" | "low-stock" | "out-of-stock";
  createdAt?: string;
  sortOrder: number;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  subcategories?: Subcategory[];
};

export type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  themeColor: string;
  glowColor: string;
  sortOrder: number;
};

export type CouponOffer = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  image?: string;
  discountType: "PERCENTAGE" | "FLAT_AMOUNT";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount?: number;
  startAt: string;
  endAt: string;
  sortOrder: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  rating: number;
  review: string;
  product: string;
  avatar: string;
  imageUrl?: string;
};

export type Review = {
  id: string;
  name: string;
  role: "Customer" | "Dealer";
  rating: number;
  message: string;
  status?: "Visible" | "Hidden";
  createdAt: string;
};
