export type AvailabilityFilter = "in-stock" | "out-of-stock";

export type SortOption = "featured" | "price-asc" | "price-desc" | "top-rated" | "newest";

export type ProductFiltersState = {
  categories: string[];
  priceRange: [number, number];
  availability: AvailabilityFilter[];
  rating: number | null;
};
