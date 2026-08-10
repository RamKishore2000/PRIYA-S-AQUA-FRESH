import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Heart, MapPin, Truck } from "lucide-react";
import { RatingStars } from "@/components/common/rating-stars";
import { SitePage } from "@/components/common/site-page";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductGallery } from "@/components/product/product-gallery";
import { PriceDisplay } from "@/components/product/price-display";
import { ProductShareButton } from "@/components/product/product-share-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { getProductBySlug } from "@/services/catalog-service";

export default async function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  return (
    <SitePage>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-teal-700">Products</Link>
          <span>/</span>
          <span className="text-slate-600">{product.category}</span>
          <span>/</span>
          <span className="max-w-[280px] truncate text-slate-900">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:sticky lg:top-24">
            <div>
              <h1 className="text-2xl font-semibold leading-tight text-slate-950 md:text-3xl">{product.name}</h1>
              <div className="mt-2">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              </div>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <PriceDisplay product={product} />
              <WishlistButton product={product} />
            </div>

            <div className="mt-7 border-t border-slate-200 pt-5">
              <button type="button" className="flex w-full items-center justify-between text-sm font-semibold text-slate-700">
                <span>Category: {product.category}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {product.sku ? <p className="mt-3 text-sm font-semibold text-slate-500">Product Code: {product.sku}</p> : null}
            </div>

            <div className="mt-6 flex w-full items-center gap-4">
              <AddToCartButton product={product} className="h-14 min-w-0 flex-1 rounded-lg text-lg" />
              <ProductShareButton product={product} variant="button" className="h-14 shrink-0 rounded-lg px-6 text-base whitespace-nowrap" />
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start gap-3 rounded-md bg-slate-50 p-3 text-slate-600">
                <Truck className="mt-0.5 h-4 w-4 text-teal-700" />
                <p>Enjoy free delivery and free returns on selected orders.</p>
              </div>
              <div className="flex items-start gap-3 rounded-md bg-slate-50 p-3 text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 text-teal-700" />
                <p>Installation support available for eligible purifier models.</p>
              </div>
              <div className="flex items-start gap-3 rounded-md bg-slate-50 p-3 text-slate-600">
                <Heart className="mt-0.5 h-4 w-4 text-teal-700" />
                <p>Genuine Priya&apos;s Aqua Fresh products and spare parts.</p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <h2 className="text-sm font-bold text-slate-950">Product Details</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
