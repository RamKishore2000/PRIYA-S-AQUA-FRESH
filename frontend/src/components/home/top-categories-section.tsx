import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCarousel } from "@/components/home/category-carousel";
import type { Category } from "@/types/product";

export function TopCategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#0d1114] pb-8 pt-0 md:pb-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.12),transparent_30%),radial-gradient(circle_at_8%_18%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(112deg,#10171b_0%,#14201f_48%,#07120f_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[760px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#12a8e6]/[0.045] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#00BFA6]/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#12a8e6]">Shop by category</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-white md:text-2xl">
              Top Categories
            </h2>
            <p className="mt-1 text-sm text-slate-300">Explore our most popular product categories.</p>
          </div>
          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#12a8e6]/35 bg-[#12a8e6]/10 px-4 py-2 text-sm font-bold text-white transition hover:border-[#12a8e6] hover:bg-[#12a8e6] hover:text-white"
          >
            More Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryCarousel categories={categories} />
      </div>
    </section>
  );
}
