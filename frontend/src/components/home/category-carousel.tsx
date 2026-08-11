"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryItem } from "@/components/home/category-item";
import type { Category } from "@/types/product";
import { cn } from "@/lib/utils";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const showArrows = categories.length > 4;

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
          "absolute left-0 top-[64px] z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#12a8e6]/35 bg-[#111418]/95 text-[#12a8e6] shadow-[0_18px_36px_rgba(0,0,0,0.28)] backdrop-blur transition hover:bg-[#12a8e6] hover:text-white md:inline-flex",
          !showArrows && "md:hidden",
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={scrollRef}
        className={cn(
          "hide-scrollbar overflow-y-hidden scroll-smooth",
          showArrows ? "overflow-x-auto" : "overflow-x-visible",
        )}
      >
        <div
          className={cn(
            "items-start px-1 py-2",
            showArrows
              ? "flex min-w-max justify-start gap-4 md:gap-5"
              : "grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4",
          )}
        >
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Next categories"
        onClick={() => scrollCategories("right")}
        className={cn(
          "absolute right-0 top-[64px] z-10 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full border border-[#12a8e6]/35 bg-[#12a8e6] text-white shadow-[0_18px_36px_rgba(8,113,207,0.24)] transition hover:bg-[#0871cf] md:inline-flex",
          !showArrows && "md:hidden",
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
