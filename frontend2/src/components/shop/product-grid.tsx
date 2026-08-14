import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/product";

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  if (!products.length) {
    return <div className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-10 text-center font-semibold text-[#5A6362] shadow-[0_10px_30px_rgba(84,61,35,0.06)]">No products found.</div>;
  }

  return (
    <div className={`grid gap-8 sm:grid-cols-2 ${columns === 3 ? "xl:grid-cols-3" : "lg:grid-cols-4"}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
