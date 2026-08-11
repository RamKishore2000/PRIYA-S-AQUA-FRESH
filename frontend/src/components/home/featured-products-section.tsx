"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CategoryChips } from "@/components/home/category-chips";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

export function FeaturedProductsSection({ products }: { products: Product[] }) {
  const categoryChips = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const [activeCategory, setActiveCategory] = useState(categoryChips[0]);

  const filteredProducts = useMemo(() => {
    return activeCategory === "All" ? products.slice(0, 8) : products.filter((product) => product.category === activeCategory).slice(0, 8);
  }, [activeCategory, products]);

  return (
    <section className="relative overflow-hidden bg-[#0d1114] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.12),transparent_30%),radial-gradient(circle_at_8%_18%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(112deg,#10171b_0%,#14201f_48%,#07120f_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-14 h-72 w-[760px] -translate-x-1/2 rounded-full bg-[#12a8e6]/[0.045] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-[#00BFA6]/[0.04] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-4xl">
              Shop by <span className="text-[#12a8e6]">Products</span>
            </h2>
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 text-sm font-bold text-white transition hover:border-white hover:bg-white hover:text-slate-950"
            >
              See All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <CategoryChips categories={categoryChips} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
