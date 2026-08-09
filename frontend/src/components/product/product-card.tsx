import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/components/common/rating-stars";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { PriceDisplay } from "@/components/product/price-display";
import { ProductShareButton } from "@/components/product/product-share-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <WishlistButton product={product} />
          <ProductShareButton product={product} />
        </div>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-8 transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-600">
          {product.category}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-2 line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-950 hover:text-teal-700"
        >
          {product.name}
        </Link>
        <div className="mt-3">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-3">
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} />
        </div>
        <div className="mt-auto pt-4">
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
