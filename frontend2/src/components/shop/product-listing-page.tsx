"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { StarIcon } from "@/components/shop/star-icon";
import { ProductGrid } from "@/components/shop/product-grid";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";
import type { Category, Product } from "@/types/product";

type SortOption = "featured" | "price-asc" | "price-desc" | "top-rated" | "newest";
type AvailabilityFilter = "in-stock" | "out-of-stock";

type ProductListingPageProps = {
  products: Product[];
  categories: Category[];
  selectedCategory?: string;
  query?: string;
};

const ratings = [5, 4, 3];
const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Featured", value: "featured" },
  { label: "Price Low to High", value: "price-asc" },
  { label: "Price High to Low", value: "price-desc" },
  { label: "Top Rated", value: "top-rated" },
  { label: "Newest", value: "newest" },
];

export function ProductListingPage({ products, categories, selectedCategory = "", query = "" }: ProductListingPageProps) {
  const { user } = useShop();
  const priceBounds = useMemo<[number, number]>(() => {
    if (!products.length) return [0, 100000];
    return [
      Math.min(...products.map((product) => getProductDisplayPrice(product, user?.role).price)),
      Math.max(...products.map((product) => getProductDisplayPrice(product, user?.role).price)),
    ];
  }, [products, user?.role]);
  const [category, setCategory] = useState(selectedCategory);
  const [subcategory, setSubcategory] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeQuery, setActiveQuery] = useState(query);
  const [priceRange, setPriceRange] = useState<[number, number]>(priceBounds);
  const [availability, setAvailability] = useState<AvailabilityFilter[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextCategory = params.get("category") || selectedCategory;
    const nextSubcategory = params.get("subcategory") || "";
    const nextSort = params.get("sort");
    setCategory(nextCategory);
    setSubcategory(nextSubcategory);
    setActiveQuery((params.get("q") || query).toLowerCase());
    if (isSortOption(nextSort)) setSort(nextSort);
    if (nextCategory) setExpandedCategories((current) => current.includes(nextCategory) ? current : [...current, nextCategory]);
  }, [selectedCategory, query]);

  const categoryCounts = useMemo(() => {
    return categories.map((item) => ({
      ...item,
      count: products.filter((product) => product.categorySlug === item.slug || normalizeSlug(product.category) === item.slug).length,
      subcategories: (item.subcategories || []).map((child) => ({
        ...child,
        count: products.filter((product) => product.subcategorySlug === child.slug).length,
      })),
    }));
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = activeQuery.toLowerCase();
    const nextProducts = products.filter((product) => {
      const productCategorySlug = product.categorySlug || normalizeSlug(product.category);
      const productSubcategorySlug = product.subcategorySlug || "";
      const categoryMatch = category ? productCategorySlug === category : true;
      const subcategoryMatch = subcategory ? productSubcategorySlug === subcategory : true;
      const queryMatch = normalizedQuery
        ? [product.name, product.category, product.subcategory || "", product.description].some((value) => value.toLowerCase().includes(normalizedQuery))
        : true;
      const productPrice = getProductDisplayPrice(product, user?.role).price;
      const priceMatch = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      const availabilityMatch =
        availability.length === 0 ||
        (product.stock === "out-of-stock"
          ? availability.includes("out-of-stock")
          : availability.includes("in-stock"));
      const ratingMatch = rating === null || product.rating >= rating;

      return categoryMatch && subcategoryMatch && queryMatch && priceMatch && availabilityMatch && ratingMatch;
    });

    return sortProducts(nextProducts, sort, user?.role);
  }, [activeQuery, availability, category, priceRange, products, rating, sort, subcategory, user?.role]);

  function clearFilters() {
    setCategory("");
    setSubcategory("");
    setPriceRange(priceBounds);
    setAvailability([]);
    setRating(null);
    setSort("featured");
  }

  function selectCategory(slug: string) {
    setCategory(slug);
    setSubcategory("");
  }

  function selectSubcategory(categorySlug: string, subcategorySlug: string) {
    setCategory(categorySlug);
    setSubcategory(subcategorySlug);
    setExpandedCategories((current) => current.includes(categorySlug) ? current : [...current, categorySlug]);
  }

  function toggleCategory(slug: string) {
    setExpandedCategories((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  }

  function toggleAvailability(value: AvailabilityFilter) {
    setAvailability((current) => (
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    ));
  }

  const filterContent = (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Filters</h2>
        <button type="button" onClick={clearFilters} className="text-sm font-black text-[#0A3A38]">Reset</button>
      </div>

      <FilterSection title="Categories">
        <div className="grid gap-2">
          <button type="button" onClick={() => { setCategory(""); setSubcategory(""); }} className={filterButtonClass(!category && !subcategory)}>
            <span>All Products</span>
            <span>{products.length}</span>
          </button>
          {categoryCounts.map((item) => {
            const hasSubcategories = item.subcategories.length > 0;
            const expanded = expandedCategories.includes(item.slug);
            return (
              <div key={item.id} className="rounded-xl">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => selectCategory(item.slug)} className={filterButtonClass(category === item.slug && !subcategory, "min-w-0 flex-1 justify-between")}>
                    <span className="truncate">{item.name}</span>
                    <span>{item.count}</span>
                  </button>
                  {hasSubcategories ? (
                    <button type="button" onClick={() => toggleCategory(item.slug)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#526161] transition hover:bg-[#F5E9D8]" aria-label={`${expanded ? "Hide" : "Show"} ${item.name} subcategories`}>
                      {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  ) : null}
                </div>
                {hasSubcategories && expanded ? (
                  <div className="ml-3 mt-1 grid gap-1 border-l border-[#E5D8C7] pl-3">
                    {item.subcategories.map((child) => (
                      <button key={child.id} type="button" onClick={() => selectSubcategory(item.slug, child.slug)} className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-black transition ${subcategory === child.slug ? "bg-[#D6B47A] text-white" : "text-[#526161] hover:bg-[#F5E9D8]"}`}>
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md bg-white/70">
                            <Image src={child.image} alt={child.name} fill className="object-contain p-1" unoptimized />
                          </span>
                          <span className="truncate">{child.name}</span>
                        </span>
                        <span>{child.count}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRangeFilter min={priceBounds[0]} max={priceBounds[1]} value={priceRange} onChange={setPriceRange} />
      </FilterSection>

      <FilterSection title="Availability">
        <div className="grid gap-3">
          {[
            { label: "In Stock", value: "in-stock" as const },
            { label: "Out of Stock", value: "out-of-stock" as const },
          ].map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm font-black text-[#526161]">
              <input type="checkbox" checked={availability.includes(option.value)} onChange={() => toggleAvailability(option.value)} className="h-4 w-4 accent-[#0A3A38]" />
              {option.label}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="grid gap-2">
          {ratings.map((item) => (
            <button key={item} type="button" onClick={() => setRating(rating === item ? null : item)} className={filterButtonClass(rating === item, "justify-start gap-2")}>
              <span className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className={`h-4 w-4 ${index < item ? "fill-[#D4A55D] text-[#D4A55D]" : "text-[#CFC6B9]"}`} />
                ))}
              </span>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <section data-product-listing-section className="px-4 pb-20 md:px-8">
      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[18rem_1fr]">
        <aside className="hidden h-max self-start rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)] lg:sticky lg:top-24 lg:block">
          {filterContent}
        </aside>

        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="fixed left-0 top-1/2 z-40 inline-flex -translate-y-1/2 items-center gap-2 rounded-r-full border border-l-0 border-[#D9C5AB] bg-[#0A3A38] px-3.5 py-2.5 text-[0.68rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_rgba(10,36,38,0.18)] lg:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </button>

          <div className="mb-4 flex items-center justify-between gap-3 bg-transparent p-0 lg:mb-8 lg:flex-wrap lg:rounded-2xl lg:border lg:border-[#E8DCCB] lg:bg-[#FFF9F1]/95 lg:p-5 lg:shadow-[0_10px_30px_rgba(84,61,35,0.06)] lg:backdrop-blur">
            <p className="text-sm font-black text-[#1D2D2E] lg:text-base">{filteredProducts.length} products</p>
            <label className="flex items-center gap-2 text-xs font-black text-[#526161] lg:text-sm">
              Sort By
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="rounded-lg border border-[#D9C5AB] bg-[#FFF9F1] px-3 py-2 text-xs font-black text-[#1D2D2E] outline-none lg:rounded-xl lg:border-[#E5D8C7] lg:bg-white lg:px-4 lg:py-3 lg:text-sm">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
          <ProductGrid products={filteredProducts} columns={3} />
        </div>
      </div>

      <div data-mobile-filter-overlay className={`fixed inset-0 z-[1300] lg:hidden ${filterOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setFilterOpen(false)}
          className={`absolute inset-0 bg-[#061415]/45 transition-opacity duration-300 ${filterOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside data-mobile-filter-drawer className={`absolute bottom-0 left-0 top-0 flex w-[88vw] max-w-[420px] flex-col border-r border-[#D9C5AB] bg-[#FFF9F1] shadow-[18px_0_46px_rgba(10,36,38,0.22)] transition-transform duration-300 md:w-[420px] ${filterOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between border-b border-[#E5D8C7] px-5 py-4">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B68A45]">Filters</p>
            <button type="button" onClick={() => setFilterOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[#0A3A38] text-white" aria-label="Close filters">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-2">
            {filterContent}
          </div>
          <div data-mobile-filter-actions className="grid grid-cols-2 gap-3 border-t border-[#E5D8C7] bg-[#FFF9F1] px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            <button type="button" onClick={clearFilters} className="h-11 rounded-full border border-[#C59A55] bg-white text-sm font-black text-[#9B7137]">
              Clear Filters
            </button>
            <button type="button" onClick={() => setFilterOpen(false)} className="h-11 rounded-full bg-[#0A3A38] text-sm font-black text-white shadow-[0_10px_24px_rgba(10,58,56,0.18)]">
              Apply Filters
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function isSortOption(value: string | null): value is SortOption {
  return value === "featured" || value === "price-asc" || value === "price-desc" || value === "top-rated" || value === "newest";
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 border-t border-[#E5D8C7] pt-6">
      <h3 className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">{title}</h3>
      {children}
    </section>
  );
}

function PriceRangeFilter({ min, max, value, onChange }: { min: number; max: number; value: [number, number]; onChange: (value: [number, number]) => void }) {
  const safeMax = max <= min ? min + 1 : max;
  const [rawMin, rawMax] = value;
  const currentMin = Math.max(min, Math.min(rawMin, safeMax));
  const currentMax = Math.max(currentMin, Math.min(rawMax, safeMax));
  const denominator = safeMax - min;
  const minPercent = Math.max(0, Math.min(100, ((currentMin - min) / denominator) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((currentMax - min) / denominator) * 100));

  function updateMin(nextValue: number) {
    onChange([Math.min(nextValue, currentMax), currentMax]);
  }

  function updateMax(nextValue: number) {
    onChange([currentMin, Math.max(nextValue, currentMin)]);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm font-black text-[#526161]">
        <span>Rs. {currentMin.toLocaleString("en-IN")}</span>
        <span>Rs. {currentMax.toLocaleString("en-IN")}</span>
      </div>
      <div className="relative h-8">
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#E5D8C7]" />
        <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#0A3A38]" style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }} />
        <input type="range" min={min} max={safeMax} step={500} value={currentMin} onChange={(event) => updateMin(Number(event.target.value))} className="range-thumb pointer-events-none absolute inset-x-0 top-0 z-20 h-8 w-full appearance-none bg-transparent" aria-label="Minimum price" />
        <input type="range" min={min} max={safeMax} step={500} value={currentMax} onChange={(event) => updateMax(Number(event.target.value))} className="range-thumb pointer-events-none absolute inset-x-0 top-0 z-30 h-8 w-full appearance-none bg-transparent" aria-label="Maximum price" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-xs font-black text-[#7D7B75]">
          Min Price
          <input type="number" min={min} max={currentMax} value={currentMin} onChange={(event) => updateMin(Number(event.target.value))} className="h-10 rounded-lg border border-[#E5D8C7] bg-white px-3 text-sm font-black text-[#1D2D2E] outline-none focus:border-[#0A3A38]" />
        </label>
        <label className="grid gap-1 text-xs font-black text-[#7D7B75]">
          Max Price
          <input type="number" min={currentMin} max={safeMax} value={currentMax} onChange={(event) => updateMax(Number(event.target.value))} className="h-10 rounded-lg border border-[#E5D8C7] bg-white px-3 text-sm font-black text-[#1D2D2E] outline-none focus:border-[#0A3A38]" />
        </label>
      </div>
    </div>
  );
}

function filterButtonClass(active: boolean, extra = "justify-between") {
  return `flex items-center rounded-xl px-4 py-3 text-left text-sm font-black transition ${extra} ${active ? "bg-[#0A3A38] text-white" : "text-[#526161] hover:bg-[#F5E9D8]"}`;
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

  if (sort === "price-asc") return sorted.sort((a, b) => getProductDisplayPrice(a, role).price - getProductDisplayPrice(b, role).price);
  if (sort === "price-desc") return sorted.sort((a, b) => getProductDisplayPrice(b, role).price - getProductDisplayPrice(a, role).price);
  if (sort === "top-rated") return sorted.sort((a, b) => (b.rating * 100 + b.reviewCount) - (a.rating * 100 + a.reviewCount));
  if (sort === "newest") return sorted.sort((a, b) => {
    const firstTime = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
    const secondTime = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
    return secondTime - firstTime;
  });
  return sorted.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || Number(a.id) - Number(b.id));
}