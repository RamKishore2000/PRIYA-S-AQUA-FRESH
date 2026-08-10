export type Product = {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  customerPrice: number;
  customerOriginalPrice?: number;
  dealerPrice: number;
  dealerOriginalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  stock: "in-stock" | "low-stock" | "out-of-stock";
  badge?: "Best Seller" | "New" | "20% OFF" | "Popular";
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  image: string;
  accent: string;
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
