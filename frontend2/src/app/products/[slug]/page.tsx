import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Truck } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { PriceDisplay } from "@/components/shop/price-display";
import { ProductDetailActions } from "@/components/shop/product-detail-actions";
import { ProductGrid } from "@/components/shop/product-grid";
import { StarIcon } from "@/components/shop/star-icon";
import { getProductBySlug, getProducts } from "@/services/catalog-service";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getProducts().catch(() => [])]);

  if (!product) {
    return (
      <SitePage eyebrow="Product" title="Product not found" description="The product you are looking for is not available.">
        <section className="px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/products" className="font-black text-[#0A3A38]">Browse products</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  const related = allProducts
    .filter((item) => item.slug !== product.slug)
    .sort((first, second) => {
      const firstMatchesCategory = first.category === product.category ? 0 : 1;
      const secondMatchesCategory = second.category === product.category ? 0 : 1;
      return firstMatchesCategory - secondMatchesCategory;
    })
    .slice(0, 4);

  return (
    <SitePage eyebrow={product.category} title={product.name} description="Review product details, pricing and support options before checkout.">
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-[#7D7B75]">
            <Link href="/" className="hover:text-[#0A3A38]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#0A3A38]">Products</Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="max-w-[280px] truncate text-[#1D2D2E]">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-[5.5rem_1fr]">
                <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:pb-0">
                  {product.images.map((image) => (
                    <span key={image} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] shadow-[0_8px_24px_rgba(84,61,35,0.06)]">
                      <Image src={image} alt="" fill sizes="80px" className="object-contain p-1.5" unoptimized />
                    </span>
                  ))}
                </div>
                <div data-product-detail-image className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-[#E5D8C7] bg-[#FFF9F1] shadow-[0_24px_70px_rgba(84,61,35,0.12)]">
                  <span className="absolute inset-x-16 bottom-10 h-16 rounded-full bg-[#0A3A38]/12 blur-2xl" />
                  <Image src={product.image} alt={product.name} fill sizes="620px" className="object-contain p-8" unoptimized />
                </div>
              </div>
              <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_14px_42px_rgba(84,61,35,0.08)]">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#B68A45]">Product Details</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5A6362]">{product.description}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_18px_60px_rgba(84,61,35,0.08)] lg:sticky lg:top-28 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">{product.category}</p>
              <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#1D2D2E] md:text-4xl">{product.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-[#5A6362]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0A3A38] px-3 py-1 text-white">
                  <StarIcon className="h-4 w-4 fill-[#D8B879] text-[#D8B879]" />
                  {(product.rating || 4.8).toFixed(1)}
                </span>
                <span>({product.reviewCount || 0} reviews)</span>
              </div>

              <PriceDisplay product={product} className="mt-5" priceClassName="text-4xl" originalClassName="pb-1 text-xl" />

              <div className="mt-7 border-y border-[#E5D8C7] py-5">
                <p className="font-black text-[#1D2D2E]">Category: <span className="text-[#0A3A38]">{product.category}</span></p>
                {product.sku ? <p className="mt-3 font-black text-[#5A6362]">Product Code: {product.sku}</p> : null}
              </div>

              <ProductDetailActions product={product} />

              <div className="mt-6 grid gap-3 text-sm">
                <div className="flex items-start gap-3 rounded-xl border border-[#E5D8C7] bg-white p-3 font-semibold text-[#5A6362]">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#B68A45]" />
                  <p>Enjoy free delivery and free returns on selected orders.</p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-[#E5D8C7] bg-white p-3 font-semibold text-[#5A6362]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B68A45]" />
                  <p>Installation support available for eligible purifier models.</p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-[#E5D8C7] bg-white p-3 font-semibold text-[#5A6362]">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#B68A45]" />
                  <p>Genuine Priya&apos;s Aqua Fresh products and spare parts.</p>
                </div>
              </div>

            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-16 border-t border-[#E5D8C7] pt-10">
              <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">Recommended</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1D2D2E] md:text-5xl">
                    You May Also Like This Product
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#5A6362]">
                    Similar Priya&apos;s Aqua Fresh products selected from the catalog.
                  </p>
                </div>
                <Link href="/products" className="inline-flex w-fit rounded-full border border-[#C59A55] bg-[#FFF9F1] px-5 py-2.5 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
                  View All Products
                </Link>
              </div>
              <ProductGrid products={related} />
            </section>
          ) : null}
        </div>
      </section>
    </SitePage>
  );
}
