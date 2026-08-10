"use client";

import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceRangeFilter } from "@/components/product/filters/price-range-filter";
import { cn } from "@/lib/utils";
import type { AvailabilityFilter, ProductFiltersState } from "@/types/filters";

type FilterCategory = {
  label: string;
  value: string;
  count: number;
};

type ProductFiltersProps = {
  filters: ProductFiltersState;
  categories: FilterCategory[];
  priceBounds: [number, number];
  onChange: (filters: ProductFiltersState) => void;
  onClear: () => void;
};

const availabilityOptions: Array<{ label: string; value: AvailabilityFilter }> = [
  { label: "In Stock", value: "in-stock" },
  { label: "Out of Stock", value: "out-of-stock" },
];

const ratings = [5, 4, 3];

export function ProductFilters({
  filters,
  categories,
  priceBounds,
  onChange,
  onClear,
}: ProductFiltersProps) {
  const setCategory = (category: string) => {
    onChange({
      ...filters,
      categories: category === "All Products" ? [] : [category],
    });
  };

  const toggleAvailability = (availability: AvailabilityFilter) => {
    const exists = filters.availability.includes(availability);
    onChange({
      ...filters,
      availability: exists
        ? filters.availability.filter((item) => item !== availability)
        : [...filters.availability, availability],
    });
  };

  return (
    <aside className="rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Filters</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Reset
        </Button>
      </div>

      <FilterSection title="Categories">
        <div className="grid gap-1">
          <button
            type="button"
            onClick={() => setCategory("All Products")}
            className={cn(
              "flex items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition",
              filters.categories.length === 0
                ? "bg-[#12a8e6]/15 text-[#12a8e6]"
                : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
            )}
          >
            All Products <span>{categories.reduce((total, item) => total + item.count, 0)}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setCategory(category.value)}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition",
                filters.categories.includes(category.value)
                  ? "bg-[#12a8e6]/15 text-[#12a8e6]"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              {category.label} <span>{category.count}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRangeFilter
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={filters.priceRange}
          onChange={(priceRange) => onChange({ ...filters, priceRange })}
        />
      </FilterSection>

      <FilterSection title="Availability">
        <div className="grid gap-3">
          {availabilityOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={filters.availability.includes(option.value)}
                onChange={() => toggleAvailability(option.value)}
                className="h-4 w-4 accent-teal-600"
              />
              {option.label}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="grid gap-2">
          {ratings.map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange({ ...filters, rating: filters.rating === rating ? null : rating })}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                filters.rating === rating
                  ? "bg-[#12a8e6]/15 text-[#12a8e6]"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <span className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "h-4 w-4",
                      index < rating ? "fill-amber-400 text-amber-400" : "text-slate-300",
                    )}
                  />
                ))}
              </span>
              & Up
            </button>
          ))}
        </div>
      </FilterSection>

      <Button type="button" variant="secondary" className="mt-5 w-full" onClick={onClear}>
        Clear All Filters
      </Button>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5 border-t border-white/10 pt-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">{title}</h3>
      {children}
    </section>
  );
}
