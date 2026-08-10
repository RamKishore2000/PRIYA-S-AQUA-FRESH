import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { SitePage } from "@/components/common/site-page";
import { PageHeader } from "@/components/common/page-header";
import { getCategories } from "@/services/catalog-service";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <SitePage>
      <PageHeader
        eyebrow="Categories"
        title="Shop by Category"
        description="Explore Priya's Aqua Fresh product ranges for homes, businesses, electronics, and service parts."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 md:grid-cols-2 md:px-8 xl:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="category-reveal group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-600 hover:bg-emerald-600 hover:shadow-xl"
            style={{ "--category-delay": `${index * 80}ms` } as CSSProperties}
          >
            <div className={`relative aspect-[5/4] overflow-hidden transition duration-300 group-hover:bg-white ${category.accent}`}>
              <div className="absolute inset-x-8 bottom-8 h-16 rounded-full bg-cyan-200/30 blur-2xl transition duration-500 group-hover:scale-110" />
              <Image src={category.image} alt={category.name} fill sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-8 transition duration-500 group-hover:scale-105" unoptimized />
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-950 transition group-hover:text-white md:text-xl">{category.name}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-400 transition group-hover:text-emerald-50">{category.productCount} products available</p>
              </div>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-emerald-700">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </SitePage>
  );
}
