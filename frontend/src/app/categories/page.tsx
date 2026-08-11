import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, PackageSearch } from "lucide-react";
import { SitePage } from "@/components/common/site-page";
import { getCategories } from "@/services/catalog-service";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <SitePage>
      <section className="relative overflow-hidden px-4 py-12 md:px-8 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(18,168,230,0.16),transparent_30%),radial-gradient(circle_at_8%_40%,rgba(45,212,191,0.08),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#12a8e6]/25 bg-[#12a8e6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#12a8e6]">
                <PackageSearch className="h-4 w-4" />
                Categories
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Shop by <span className="text-[#12a8e6]">Category</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Choose from Priya&apos;s Aqua Fresh purifier ranges, electronics, commercial systems, and service-ready spare parts.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-white backdrop-blur-sm">
              <span className="block text-3xl font-black text-[#12a8e6]">{categories.length}</span>
              <span className="text-sm font-semibold text-slate-300">Active categories</span>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="category-reveal group relative min-h-[180px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#111a18]/88 p-5 backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-[#12a8e6]/55 hover:bg-[#15231f]"
                style={{ "--category-delay": `${index * 80}ms` } as CSSProperties}
              >
                <span className="pointer-events-none absolute -left-16 top-1/2 h-36 w-44 -translate-y-1/2 rounded-full bg-[#12a8e6]/16 blur-3xl transition duration-500 group-hover:bg-[#12a8e6]/28" />
                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),transparent_42%,rgba(18,168,230,0.045))]" />
                <div className="relative flex h-full items-center gap-5">
                  <div className="relative h-32 w-36 shrink-0">
                    <span className="absolute inset-x-4 bottom-2 h-8 rounded-full bg-black/55 blur-xl transition duration-500 group-hover:bg-[#12a8e6]/25" />
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="144px"
                      className="object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.42)] transition duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Explore Range</p>
                    <h2 className="mt-2 text-xl font-black leading-tight text-[#12a8e6] transition group-hover:text-[#49cfff] md:text-2xl">
                      {category.name}
                    </h2>
                    <p className="mt-3 text-sm font-semibold text-slate-300">
                      {category.productCount > 0 ? `${category.productCount} products available` : "Products coming soon"}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition group-hover:text-[#12a8e6]">
                      View Products <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SitePage>
  );
}
