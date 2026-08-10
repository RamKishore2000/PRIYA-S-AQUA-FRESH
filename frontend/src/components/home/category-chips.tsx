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
              "h-10 rounded-md border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
              activeCategory === chip
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700",
            )}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
