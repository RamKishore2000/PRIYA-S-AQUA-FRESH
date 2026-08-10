import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCarousel } from "@/components/home/category-carousel";
import type { Category } from "@/types/product";

export function TopCategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-950 md:text-2xl">
              Top Categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">Explore our most popular product categories.</p>
          </div>
          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-900 transition hover:border-teal-500 hover:text-teal-700"
          >
            More Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryCarousel categories={categories.slice(0, 6)} />
      </div>
    </section>
  );
}
