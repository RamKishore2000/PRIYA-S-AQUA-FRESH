import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/product";

export function ProductShowcase({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section data-home-reveal className="bg-[#FFF9F1] px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div data-reveal-item className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-10 lg:gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">Shop by Products</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1D2D2E] md:text-4xl lg:mt-3 lg:text-5xl">Top Products</h2>
          </div>
          <Link href="/products" className="rounded-lg border border-[#C59A55] px-5 py-2 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
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
