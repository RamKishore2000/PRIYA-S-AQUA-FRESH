"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { EmptyProductsState } from "@/components/product/empty-products-state";
import { ProductFilters } from "@/components/product/filters/product-filters";
import { ProductToolbar } from "@/components/product/product-toolbar";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { ProductFiltersState, SortOption } from "@/types/filters";

const priceBounds: [number, number] = [
  Math.min(...products.map((product) => product.price)),
  Math.max(...products.map((product) => product.price)),
];

const initialFilters: ProductFiltersState = {
  categories: [],
  priceRange: priceBounds,
  availability: [],
  rating: null,
};

const categoryLabels: Record<string, string> = {
  "Alkaline Purifiers": "Alkaline Water Purifiers",
  "RO Purifiers": "RO Water Purifiers",
  Commercial: "Commercial Water Purifiers",
  "Water Softeners": "Water Softeners",
  "Smart TVs": "Smart TVs & Electronics",
  "Spare Parts": "Spare Parts",
};

const categorySlugToValue: Record<string, string> = {
  "alkaline-water-purifiers": "Alkaline Purifiers",
  "ro-water-purifiers": "RO Purifiers",
  "commercial-water-purifiers": "Commercial",
  "water-softeners": "Water Softeners",
  "smart-tvs-electronics": "Smart TVs",
  "spare-parts": "Spare Parts",
};

export function ProductListingPage() {
  const [filters, setFilters] = useState<ProductFiltersState>(() => {
    if (typeof window === "undefined") return initialFilters;
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    return category && categorySlugToValue[category]
      ? { ...initialFilters, categories: [categorySlugToValue[category]] }
      : initialFilters;
  });
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filterCategories = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryLabels).map(([value, label]) => ({
      value,
      label,
      count: counts[value] ?? 0,
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch =
        filters.categories.length === 0 || filters.categories.includes(product.category);
      const priceMatch =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const availabilityMatch =
        filters.availability.length === 0 ||
        (product.stock === "out-of-stock"
          ? filters.availability.includes("out-of-stock")
          : filters.availability.includes("in-stock"));
      const ratingMatch = filters.rating === null || product.rating >= filters.rating;

      return categoryMatch && priceMatch && availabilityMatch && ratingMatch;
    });

    return sortProducts(filtered, sort);
  }, [filters, sort]);

  const clearFilters = () => {
    setFilters(initialFilters);
    toast.success("Filters cleared.");
  };

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-teal-700">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-950">Shop</span>
          </nav>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Shop All Products
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Explore water purifiers, commercial RO systems, water softeners, electronics and spare parts.
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-950">
              {products.length} Products
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          <div className="hidden self-start lg:sticky lg:top-24 lg:block">
            <ProductFilters
              filters={filters}
              categories={filterCategories}
              priceBounds={priceBounds}
              onChange={setFilters}
              onClear={clearFilters}
            />
          </div>
          <div>
            <ProductToolbar
              count={filteredProducts.length}
              sort={sort}
              onSortChange={setSort}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />
            {filteredProducts.length === 0 ? (
              <EmptyProductsState onClear={clearFilters} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div
        className={cn("fixed inset-0 z-[80] lg:hidden", mobileFiltersOpen ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!mobileFiltersOpen}
      >
        <button
          className={cn("absolute inset-0 bg-slate-950/40 transition", mobileFiltersOpen ? "opacity-100" : "opacity-0")}
          aria-label="Close filters"
          onClick={() => setMobileFiltersOpen(false)}
        />
        <aside
          className={cn(
            "absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-lg bg-white p-4 shadow-2xl transition duration-300",
            mobileFiltersOpen ? "translate-y-0" : "translate-y-full",
          )}
          aria-label="Mobile filters"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Filters</h2>
            <Button variant="ghost" size="icon" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ProductFilters
            filters={filters}
            categories={filterCategories}
            priceBounds={priceBounds}
            onChange={setFilters}
            onClear={clearFilters}
          />
        </aside>
      </div>
    </main>
  );
}

function sortProducts(items: Product[], sort: SortOption) {
  const sorted = [...items];

  if (sort === "price-asc") {
    return sorted.sort((a, b) => a.price - b.price);
  }
  if (sort === "price-desc") {
    return sorted.sort((a, b) => b.price - a.price);
  }
  if (sort === "top-rated") {
    return sorted.sort((a, b) => b.rating - a.rating);
  }
  if (sort === "newest") {
    return sorted.reverse();
  }

  return sorted;
}
