import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/product";

export function ProductGrid({ products, columns = 4, onWishlistChange }: { products: Product[]; columns?: 3 | 4; onWishlistChange?: (product: Product) => void }) {
  if (!products.length) {
    return <div className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-10 text-center font-semibold text-[#40576C] shadow-[0_10px_30px_rgba(0,87,200,0.07)]">No products found.</div>;
  }

  return (
    <div data-product-grid className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 ${columns === 3 ? "lg:gap-8 xl:grid-cols-3" : "lg:grid-cols-4 lg:gap-8"}`}>
      {products.map((product) => (
        <ProductCard key={`${product.id}:${product.selectedVariantKey || ""}`} product={product} onWishlistChange={onWishlistChange} />
      ))}
    </div>
  );
}
