import { ProductGrid } from "@/components/shop/product-grid";
import { SitePage } from "@/components/layout/site-page";
import { searchProducts } from "@/services/catalog-service";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = await searchProducts(q).catch(() => []);

  return (
    <SitePage eyebrow="Search" title={q ? `Results for "${q}"` : "Search products"} description="Find purifiers, electronics and spare parts quickly.">
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <form action="/search" className="mb-10 flex max-w-2xl overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
            <input name="q" defaultValue={q} placeholder="Search products..." className="min-w-0 flex-1 bg-transparent px-6 py-4 font-semibold text-white outline-none placeholder:text-slate-500" />
            <button className="bg-[#12a8e6] px-7 font-black text-white">Search</button>
          </form>
          <ProductGrid products={products} />
        </div>
      </section>
    </SitePage>
  );
}
