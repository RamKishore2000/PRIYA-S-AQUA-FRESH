"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/types/product";

const preferredCategoryOrder = [
  "ro-water-purifiers",
  "ro-water-purifier",
  "alkaline-water-purifiers",
  "alkaline-water-purifier",
  "commercial-water-purifiers",
  "commercial-water-purifier",
  "commercial-ro",
  "water-softeners",
  "water-softener",
  "spare-parts",
  "spear-parts",
  "geysers",
  "geyser",
  "geser",
  "smart-tv",
  "smart-tvs",
];

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const visibleCategories = getOrderedCategories(categories);
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const scrollRow = row;

    function updateScrollState() {
      const maxScroll = scrollRow.scrollWidth - scrollRow.clientWidth;
      setCanScrollLeft(scrollRow.scrollLeft > 4);
      setCanScrollRight(scrollRow.scrollLeft < maxScroll - 4);
    }

    updateScrollState();
    scrollRow.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      scrollRow.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [visibleCategories.length]);

  function scrollCategories(direction: "left" | "right") {
    rowRef.current?.scrollBy({ left: direction === "left" ? -240 : 240, behavior: "smooth" });
  }

  if (!visibleCategories.length) return null;

  return (
    <section data-home-reveal className="relative bg-[#F3FAFF] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl px-0 pb-0 pt-0 lg:rounded-[1rem] lg:border lg:border-[#EFE4D5] lg:bg-[#FFFFFF] lg:px-5 lg:pb-7 lg:pt-5 lg:shadow-[0_10px_30px_rgba(80,58,30,0.06)]">
        <div data-reveal-item className="mb-5 flex items-center justify-between gap-4 lg:mb-7 lg:justify-center">
          <div className="grid w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-6">
            <DecorativeArrow direction="right" />
            <h2 className="whitespace-nowrap text-center font-serif text-2xl font-semibold leading-none text-[#102033] md:text-[2rem]">Top Categories</h2>
            <DecorativeArrow direction="left" />
          </div>
          <Link href="/categories" className="shrink-0 text-xs font-black text-[#0057C8] lg:hidden">More</Link>
        </div>

        <div ref={rowRef} data-home-category-row className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:gap-4 lg:mx-0 lg:overflow-x-auto lg:px-0 lg:pb-1">
          {visibleCategories.map((category) => (
            <Link key={category.id} data-reveal-item data-home-category-card href={`/products?category=${category.slug}`} className="group grid w-24 shrink-0 gap-2 overflow-visible rounded-none border-0 bg-transparent px-1 py-1 text-center shadow-none transition duration-300 hover:-translate-y-0.5 md:w-28 lg:min-h-[134px] lg:grid-cols-[1fr_6.25rem] lg:items-center lg:overflow-hidden lg:rounded-[0.8rem] lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF] lg:px-4 lg:py-4 lg:text-left lg:shadow-[0_8px_22px_rgba(0,87,200,0.05)] lg:hover:border-[#00AEEF] lg:hover:bg-[#F8FCFF] lg:hover:shadow-[0_12px_28px_rgba(40,180,99,0.10)]">
              <div className="relative order-1 mx-auto h-20 w-20 lg:order-2 lg:h-24 lg:w-24 lg:justify-self-end">
                <Image src={category.image} alt={category.name} fill sizes="112px" className="object-contain object-center transition duration-500 group-hover:scale-105" unoptimized />
              </div>
              <div className="relative z-10 order-2 min-w-0 self-center lg:order-1">
                <h3 className="line-clamp-2 text-xs font-black leading-4 text-[#102033] lg:max-w-[8.5rem] lg:text-[0.95rem] lg:leading-6">{category.name}</h3>
                <p className="mt-5 hidden text-xs font-black text-[#B17932] lg:block">Shop Now -&gt;</p>
              </div>
            </Link>
          ))}
        </div>

        {visibleCategories.length > 2 ? (
          <div className="mt-2 flex items-center justify-between gap-3">
            <div data-home-scroll-cue className="flex justify-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-5 rounded-full bg-[#0057C8]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#CDBB9C]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#CDBB9C]" />
            </div>
            <div data-home-carousel-controls className="flex items-center gap-2" aria-label="Category carousel controls">
              <button type="button" onClick={() => scrollCategories("left")} disabled={!canScrollLeft} className={`grid h-9 w-9 place-items-center rounded-full border shadow-[0_8px_18px_rgba(0,87,200,0.10)] transition ${canScrollLeft ? "border-[#0057C8] bg-[#0057C8] text-white hover:bg-[#124945]" : "border-[#D8C8B4] bg-[#FFFFFF] text-[#AFA391]"}`} aria-label="Scroll categories left" title="Scroll left">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => scrollCategories("right")} disabled={!canScrollRight} className={`grid h-9 w-9 place-items-center rounded-full border shadow-[0_8px_18px_rgba(10,58,56,0.2)] transition ${canScrollRight ? "border-[#0057C8] bg-[#0057C8] text-white hover:bg-[#124945]" : "border-[#D8C8B4] bg-[#FFFFFF] text-[#AFA391]"}`} aria-label="Scroll categories right" title="Scroll right">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function getOrderedCategories(categories: Category[]) {
  const used = new Set<string>();
  const ordered: Category[] = [];

  for (const slug of preferredCategoryOrder) {
    const category = categories.find((item) => !used.has(item.id) && (normalizeSlug(item.slug) === slug || normalizeSlug(item.name) === slug));
    if (category) {
      ordered.push(category);
      used.add(category.id);
    }
  }

  return [...ordered, ...categories.filter((category) => !used.has(category.id))];
}

function normalizeSlug(value?: string | null) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function DecorativeArrow({ direction }: { direction: "left" | "right" }) {
  const flip = direction === "left" ? "scale-x-[-1]" : "";

  return (
    <span className={`flex min-w-0 items-center ${direction === "right" ? "justify-end" : "justify-start"}`}>
      <svg className={`h-3 w-full max-w-28 text-[#0057C8] ${flip}`} viewBox="0 0 128 14" fill="none" aria-hidden="true">
        <path d="M1 7L15 1V5.6H113V1L127 7L113 13V8.4H15V13L1 7Z" fill="currentColor" />
      </svg>
    </span>
  );
}
