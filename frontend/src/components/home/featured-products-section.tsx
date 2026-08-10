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
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="mb-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Products
          </h2>
          <Link
            href="/products"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-950 px-4 text-sm font-bold text-slate-950 transition hover:bg-slate-950 hover:text-white"
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
    </section>
  );
}
