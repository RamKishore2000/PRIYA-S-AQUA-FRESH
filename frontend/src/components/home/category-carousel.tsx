"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryItem } from "@/components/home/category-item";
import type { Category } from "@/types/product";
import { cn } from "@/lib/utils";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollCategories(direction: "left" | "right") {
    const container = scrollRef.current;
    if (!container) return;
    const distance = Math.min(container.clientWidth * 0.75, 520);
    container.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => scrollCategories("left")}
        className={cn(
          "absolute left-0 top-[78px] z-10 hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-slate-950 text-white shadow-md transition hover:bg-slate-800 md:inline-flex",
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div ref={scrollRef} className="hide-scrollbar overflow-x-auto overflow-y-hidden scroll-smooth">
        <div className="flex min-w-max items-start justify-center gap-3 px-1 py-1 sm:gap-4 md:min-w-0 md:gap-3 lg:gap-4">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Next categories"
        onClick={() => scrollCategories("right")}
        className="absolute right-0 top-[78px] z-10 hidden h-9 w-9 translate-x-1/2 items-center justify-center rounded-full bg-teal-600 text-white shadow-md transition hover:bg-teal-700 md:inline-flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
