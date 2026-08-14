import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Heart, MapPin, Truck } from "lucide-react";
import { RatingStars } from "@/components/common/rating-stars";
import { SitePage } from "@/components/common/site-page";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/product/product-card";
import { PriceDisplay } from "@/components/product/price-display";
import { ProductShareButton } from "@/components/product/product-share-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { getProductBySlug, getProducts } from "@/services/catalog-service";

export default async function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();
  const products = await getProducts().catch(() => []);
  const relatedProducts = products
    .filter((item) => item.slug !== product.slug)
    .sort((first, second) => {
      const firstMatchesCategory = first.category === product.category ? 0 : 1;
      const secondMatchesCategory = second.category === product.category ? 0 : 1;
      return firstMatchesCategory - secondMatchesCategory;
    })
    .slice(0, 4);

  return (
    <SitePage>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-[#12a8e6]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#12a8e6]">Products</Link>
          <span>/</span>
          <span className="text-slate-300">{product.category}</span>
          <span>/</span>
          <span className="max-w-[280px] truncate text-white">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:sticky lg:top-24">
            <div>
              <h1 className="text-2xl font-semibold leading-tight text-white md:text-3xl">{product.name}</h1>
              <div className="mt-2">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              </div>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <PriceDisplay product={product} />
              <WishlistButton product={product} />
            </div>

            <div className="mt-7 border-t border-white/10 pt-5">
              <button type="button" className="flex w-full items-center justify-between text-sm font-semibold text-slate-200">
                <span>Category: {product.category}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {product.sku ? <p className="mt-3 text-sm font-semibold text-slate-400">Product Code: {product.sku}</p> : null}
            </div>

            <div className="mt-6 grid w-full grid-cols-[1fr_1fr_auto] items-center gap-4">
              <AddToCartButton product={product} className="h-14 min-w-0 flex-1 rounded-lg text-lg" />
              <Link
                href={`/checkout?buyNow=${product.id}`}
                className="inline-flex h-14 items-center justify-center rounded-lg border border-[#12a8e6]/45 px-6 text-base font-bold text-white transition hover:border-[#12a8e6] hover:bg-[#12a8e6]/15"
              >
                Buy Now
              </Link>
              <ProductShareButton product={product} variant="button" className="h-14 shrink-0 rounded-lg px-6 text-base whitespace-nowrap" />
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start gap-3 rounded-md border border-white/10 bg-[#111418] p-3 text-slate-300">
                <Truck className="mt-0.5 h-4 w-4 text-[#12a8e6]" />
                <p>Enjoy free delivery and free returns on selected orders.</p>
              </div>
              <div className="flex items-start gap-3 rounded-md border border-white/10 bg-[#111418] p-3 text-slate-300">
                <MapPin className="mt-0.5 h-4 w-4 text-[#12a8e6]" />
                <p>Installation support available for eligible purifier models.</p>
              </div>
              <div className="flex items-start gap-3 rounded-md border border-white/10 bg-[#111418] p-3 text-slate-300">
                <Heart className="mt-0.5 h-4 w-4 text-[#12a8e6]" />
                <p>Genuine Priya&apos;s Aqua Fresh products and spare parts.</p>
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <h2 className="text-sm font-bold text-white">Product Details</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{product.description}</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-16 border-t border-white/10 pt-10">
            <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#12a8e6]">Recommended</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-4xl">
                  You May Also Like <span className="text-[#12a8e6]">This Product</span>
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Similar Priya&apos;s Aqua Fresh products selected from the catalog.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex w-fit rounded-full border border-[#12a8e6]/35 bg-[#12a8e6]/10 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#12a8e6] hover:bg-[#12a8e6]"
              >
                View All Products
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </SitePage>
  );
}
