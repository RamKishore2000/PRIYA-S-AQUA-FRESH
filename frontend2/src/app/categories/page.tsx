import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, PackageSearch } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { getCategories } from "@/services/catalog-service";

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <SitePage eyebrow="Categories" title="Shop by Category" description="Choose from Priya's Aqua Fresh purifier ranges, electronics, commercial systems, and service-ready spare parts.">
      <section className="relative overflow-hidden px-5 pb-20 md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(10,58,56,0.12),transparent_30%),radial-gradient(circle_at_8%_40%,rgba(182,138,69,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C59A55]/35 bg-[#FFF9F1] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#9B7137] shadow-[0_10px_28px_rgba(84,61,35,0.06)]">
              <PackageSearch className="h-4 w-4" />
              Product Ranges
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="category-reveal group relative min-h-[180px] overflow-hidden rounded-[1.35rem] border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_14px_42px_rgba(84,61,35,0.08)] transition duration-500 hover:-translate-y-1 hover:border-[#C59A55] hover:bg-white hover:shadow-[0_24px_60px_rgba(84,61,35,0.13)]"
                style={{ "--category-delay": `${index * 80}ms` } as CSSProperties}
              >
                <span className="pointer-events-none absolute -left-16 top-1/2 h-36 w-44 -translate-y-1/2 rounded-full bg-[#0A3A38]/10 blur-3xl transition duration-500 group-hover:bg-[#B68A45]/18" />
                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),transparent_42%,rgba(182,138,69,0.08))]" />
                <div className="relative flex h-full items-center gap-5">
                  <div className="relative h-32 w-36 shrink-0">
                    <span className="absolute inset-x-4 bottom-2 h-8 rounded-full bg-[#0A3A38]/16 blur-xl transition duration-500 group-hover:bg-[#B68A45]/20" />
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="144px"
                      className="object-contain drop-shadow-[0_14px_22px_rgba(84,61,35,0.22)] transition duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B68A45]">Explore Range</p>
                    <h2 className="mt-2 text-xl font-black leading-tight text-[#1D2D2E] transition group-hover:text-[#0A3A38] md:text-2xl">
                      {category.name}
                    </h2>
                    <p className="mt-3 text-sm font-semibold text-[#5A6362]">
                      {category.productCount > 0 ? `${category.productCount} products available` : "Products coming soon"}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0A3A38] transition group-hover:text-[#B68A45]">
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
