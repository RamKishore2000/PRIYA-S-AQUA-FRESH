"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/product";

type ProductShowcaseProps = {
  products: Product[];
  title?: string;
  eyebrow?: string;
  viewAllHref?: string;
  tone?: "light" | "soft";
};

export function ProductShowcase({
  products,
  title = "Top Products",
  eyebrow = "Shop by Products",
  viewAllHref = "/products",
  tone = "light",
}: ProductShowcaseProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scrollProducts(direction: "left" | "right") {
    rowRef.current?.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  }

  if (!products.length) return null;

  return (
    <section data-home-reveal className={`${tone === "soft" ? "bg-[#F8F3EC]" : "bg-[#FFF9F1]"} px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-16`}>
      <div className="mx-auto max-w-7xl">
        <div data-reveal-item className="mb-6 flex items-end justify-between gap-3 lg:mb-10 lg:gap-6">
          <div className="min-w-0 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">{eyebrow}</p>
            <h2 data-home-section-title className="mt-2 font-serif text-3xl font-semibold text-[#1D2D2E] md:text-4xl lg:mt-3 lg:text-5xl">{title}</h2>
          </div>
          <Link href={viewAllHref} className="shrink-0 whitespace-nowrap rounded-lg border border-[#C59A55] px-3 py-2 text-xs font-black text-[#9B7137] transition hover:bg-[#F5E9D8] sm:px-5 sm:text-sm">
            View All
          </Link>
        </div>

        <div ref={rowRef} data-native-home-product-row className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {products.map((product) => (
            <div key={product.id} data-reveal-item data-native-home-product-card className="w-[var(--home-product-card-width)] max-w-none shrink-0 snap-start sm:max-w-[18rem] md:w-[31vw] lg:w-auto lg:max-w-none" style={{ "--home-product-card-width": "calc((100vw - 3.1rem) / 2)" } as CSSProperties}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {products.length > 1 ? (
          <div className="mt-2 flex items-center justify-between gap-3">
            <div data-home-scroll-cue className="flex justify-center gap-1.5" aria-hidden="true">
              <span className="h-1.5 w-5 rounded-full bg-[#0A3A38]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#CDBB9C]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#CDBB9C]" />
            </div>
            <div data-home-carousel-controls className="flex items-center gap-2" aria-label="Product carousel controls">
              <button type="button" onClick={() => scrollProducts("left")} className="grid h-9 w-9 place-items-center rounded-full border border-[#D8C8B4] bg-[#FFF9F1] text-[#0A3A38] shadow-[0_8px_18px_rgba(84,61,35,0.1)] transition hover:border-[#0A3A38] hover:bg-white" aria-label="Scroll products left" title="Scroll left">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => scrollProducts("right")} className="grid h-9 w-9 place-items-center rounded-full bg-[#0A3A38] text-white shadow-[0_8px_18px_rgba(10,58,56,0.2)] transition hover:bg-[#124945]" aria-label="Scroll products right" title="Scroll right">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
