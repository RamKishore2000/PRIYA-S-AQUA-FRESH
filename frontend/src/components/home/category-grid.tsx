import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/home/category-card";
import { categories } from "@/data/categories";

export function CategoryGrid() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-600 md:text-sm">
              Shop By Category
            </p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-950 md:text-3xl">
              Find what you need
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden items-center gap-1 text-sm font-bold text-blue-600 hover:text-teal-700 sm:inline-flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        <Link
          href="/categories"
          className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-teal-700 sm:hidden"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
