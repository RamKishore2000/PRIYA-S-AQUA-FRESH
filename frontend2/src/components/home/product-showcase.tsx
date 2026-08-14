import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/product";

export function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <section data-home-reveal className="bg-[#FFF9F1] px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div data-reveal-item className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">Shop by Products</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#1D2D2E] md:text-5xl">Featured Products</h2>
          </div>
          <Link href="/products" className="rounded-lg border border-[#C59A55] px-5 py-2 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
            View All
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} data-reveal-item>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
