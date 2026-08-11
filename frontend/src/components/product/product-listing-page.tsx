"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { EmptyProductsState } from "@/components/product/empty-products-state";
import { ProductFilters } from "@/components/product/filters/product-filters";
import { ProductToolbar } from "@/components/product/product-toolbar";
import { getProductDisplayPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { getStoredUser } from "@/services/auth-service";
import type { Product } from "@/types/product";
import type { ProductFiltersState, SortOption } from "@/types/filters";

export function ProductListingPage({
  products,
  title = "Shop All Products",
  description = "Explore water purifiers, commercial RO systems, water softeners, electronics and spare parts.",
}: {
  products: Product[];
  title?: string;
  description?: string;
}) {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<string | null>(() => (typeof window === "undefined" ? null : getStoredUser()?.role || null));
  const priceBounds = useMemo<[number, number]>(() => (
    products.length
      ? [
          Math.min(...products.map((product) => getProductDisplayPrice(product, role).price)),
          Math.max(...products.map((product) => getProductDisplayPrice(product, role).price)),
        ]
      : [0, 100000]
  ), [products, role]);
  const initialFilters = useMemo<ProductFiltersState>(() => ({
    categories: [],
    priceRange: priceBounds,
    availability: [],
    rating: null,
  }), [priceBounds]);
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const category = normalizeSlug(searchParams.get("category"));
    const matchedProduct = category ? products.find((product) => normalizeSlug(product.category) === category) : null;

    setFilters((current) => ({
      ...current,
      categories: matchedProduct ? [matchedProduct.category] : [],
      priceRange: priceBounds,
    }));
  }, [priceBounds, products, searchParams]);

  useEffect(() => {
    function syncRole() {
      const nextRole = getStoredUser()?.role || null;
      const nextPriceBounds: [number, number] = products.length
        ? [
            Math.min(...products.map((product) => getProductDisplayPrice(product, nextRole).price)),
            Math.max(...products.map((product) => getProductDisplayPrice(product, nextRole).price)),
          ]
        : [0, 100000];
      setRole(nextRole);
      setFilters((current) => ({ ...current, priceRange: nextPriceBounds }));
    }
    window.addEventListener("priyas-auth-changed", syncRole);
    return () => window.removeEventListener("priyas-auth-changed", syncRole);
  }, [products]);

  const filterCategories = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([value, count]) => ({
      value,
      label: value,
      count,
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch =
        filters.categories.length === 0 || filters.categories.includes(product.category);
      const priceMatch =
        getProductDisplayPrice(product, role).price >= filters.priceRange[0] && getProductDisplayPrice(product, role).price <= filters.priceRange[1];
      const availabilityMatch =
        filters.availability.length === 0 ||
        (product.stock === "out-of-stock"
          ? filters.availability.includes("out-of-stock")
          : filters.availability.includes("in-stock"));
      const ratingMatch = filters.rating === null || product.rating >= filters.rating;

      return categoryMatch && priceMatch && availabilityMatch && ratingMatch;
    });

    return sortProducts(filtered, sort, role);
  }, [filters, products, role, sort]);

  const clearFilters = () => {
    setFilters(initialFilters);
    toast.success("Filters cleared.");
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-400">
            <Link href="/" className="hover:text-[#12a8e6]">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Shop</span>
          </nav>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                {description}
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-white backdrop-blur-sm">
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
            "absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-lg bg-[#111a18]/95 p-4 text-slate-100 shadow-2xl backdrop-blur-xl transition duration-300",
            mobileFiltersOpen ? "translate-y-0" : "translate-y-full",
          )}
          aria-label="Mobile filters"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Filters</h2>
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
    </div>
  );
}

function normalizeSlug(value?: string | null) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortProducts(items: Product[], sort: SortOption, role?: string | null) {
  const sorted = [...items];

  if (sort === "price-asc") {
    return sorted.sort((a, b) => getProductDisplayPrice(a, role).price - getProductDisplayPrice(b, role).price);
  }
  if (sort === "price-desc") {
    return sorted.sort((a, b) => getProductDisplayPrice(b, role).price - getProductDisplayPrice(a, role).price);
  }
  if (sort === "top-rated") {
    return sorted.sort((a, b) => b.rating - a.rating);
  }
  if (sort === "newest") {
    return sorted.reverse();
  }

  return sorted;
}
