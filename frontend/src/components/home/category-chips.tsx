"use client";

import { cn } from "@/lib/utils";

type CategoryChipsProps = {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export function CategoryChips({ categories, activeCategory, onCategoryChange }: CategoryChipsProps) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-3">
        {categories.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onCategoryChange(chip)}
            className={cn(
              "h-10 rounded-md border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
              activeCategory === chip
                ? "border-white bg-white text-slate-950"
                : "border-white/15 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10 hover:text-white",
            )}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
