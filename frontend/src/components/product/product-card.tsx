"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RatingStars } from "@/components/common/rating-stars";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { PriceDisplay } from "@/components/product/price-display";
import { ProductShareButton } from "@/components/product/product-share-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const images = useMemo(() => {
    const uniqueImages = Array.from(new Set([product.image, ...product.images].filter(Boolean)));
    return uniqueImages.length > 0 ? uniqueImages : [product.image];
  }, [product.image, product.images]);
  const [activeImage, setActiveImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering || images.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 850);

    return () => window.clearInterval(timer);
  }, [images.length, isHovering]);

  function resetSlider() {
    setIsHovering(false);
    setActiveImage(0);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div
        data-product-image-area
        className="relative aspect-square overflow-hidden bg-slate-50"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={resetSlider}
      >
        <div className="absolute right-3 top-3 z-10 flex flex-col items-center gap-3">
          <WishlistButton
            product={product}
            className="h-8 w-8 !border-0 !bg-transparent !p-0 text-white !shadow-none hover:!bg-transparent hover:text-white [&_svg]:h-7 [&_svg]:w-7 [&_svg]:stroke-white [&_svg]:drop-shadow-[0_2px_4px_rgba(0,0,0,0.72)] hover:[&_svg]:stroke-white"
          />
          <ProductShareButton
            product={product}
            className="h-8 w-8 !border-0 !bg-transparent !p-0 text-white !shadow-none hover:!bg-transparent hover:text-white [&_svg]:h-7 [&_svg]:w-7 [&_svg]:stroke-white [&_svg]:drop-shadow-[0_2px_4px_rgba(0,0,0,0.72)] hover:[&_svg]:stroke-white"
          />
        </div>
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeImage * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative min-w-full">
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-1.5 transition duration-500 group-hover:scale-105 sm:p-2"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-600">
          {product.category}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1.5 line-clamp-2 min-h-9 text-sm font-semibold leading-[1.15rem] text-slate-950 hover:text-teal-700"
        >
          {product.name}
        </Link>
        <div className="mt-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-2">
          <PriceDisplay product={product} />
        </div>
        <div className="mt-auto pt-2.5">
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
