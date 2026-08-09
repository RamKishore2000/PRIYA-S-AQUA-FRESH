export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
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

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  review: string;
  product: string;
  avatar: string;
};
