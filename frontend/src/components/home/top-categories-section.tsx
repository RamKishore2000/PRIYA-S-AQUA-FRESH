import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCarousel } from "@/components/home/category-carousel";
import type { Category } from "@/types/product";

export function TopCategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-transparent pb-8 pt-6 md:pb-12 md:pt-8 lg:pt-0">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#12a8e6] sm:text-xs sm:tracking-[0.28em]">Shop by category</p>
            <h2 className="mt-2 text-lg font-extrabold tracking-tight text-white sm:text-xl md:text-2xl">
              Top Categories
            </h2>
            <p className="mt-1 hidden max-w-[15rem] text-xs leading-5 text-slate-300 lg:block lg:max-w-none lg:text-sm">Explore our most popular product categories.</p>
          </div>
          <Link
            href="/categories"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border border-[#12a8e6]/35 bg-[#12a8e6]/10 px-3 text-[11px] font-bold text-white transition hover:border-[#12a8e6] hover:bg-[#12a8e6] hover:text-white sm:h-10 sm:px-4 sm:text-sm"
          >
            Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryCarousel categories={categories} />
      </div>
    </section>
  );
}
