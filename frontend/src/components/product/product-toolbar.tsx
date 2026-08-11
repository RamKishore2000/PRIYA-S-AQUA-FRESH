"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SortOption } from "@/types/filters";

type ProductToolbarProps = {
  count: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenFilters: () => void;
};

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "top-rated" },
  { label: "Newest", value: "newest" },
];

export function ProductToolbar({ count, sort, onSortChange, onOpenFilters }: ProductToolbarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" className="lg:hidden" onClick={onOpenFilters}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        <p className="text-sm font-semibold text-slate-300">Showing {count} products</p>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
        Sort By
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="h-10 rounded-md border border-white/10 bg-[#111a18]/85 px-3 text-sm font-semibold text-white outline-none focus:border-[#12a8e6] focus:ring-2 focus:ring-[#12a8e6]/20"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
