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
    <section className="relative overflow-hidden bg-[#0d1114] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.12),transparent_30%),radial-gradient(circle_at_8%_18%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(112deg,#10171b_0%,#14201f_48%,#07120f_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[680px] -translate-x-1/2 rounded-full bg-[#12a8e6]/[0.045] blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#00BFA6]/[0.04] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader title={title} subtitle={subtitle} variant="dark" />
        <div className={carousel ? "flex snap-x gap-4 overflow-x-auto pb-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
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
