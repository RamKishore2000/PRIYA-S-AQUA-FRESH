import { SectionHeader } from "@/components/common/section-header";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

type ProductGridProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  carousel?: boolean;
};

export function ProductGrid({ title, subtitle, products, carousel = false }: ProductGridProps) {
  return (
    <section className="relative overflow-hidden bg-transparent py-14 md:py-20">
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader title={title} subtitle={subtitle} variant="dark" />
        <div className={carousel ? "flex snap-x gap-4 overflow-x-auto pb-2" : "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4"}>
          {products.map((product) => (
            <div key={product.id} className={carousel ? "w-[280px] shrink-0 snap-start md:w-[300px]" : ""}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
