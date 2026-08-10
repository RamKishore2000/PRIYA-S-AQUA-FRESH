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

export function ProductCard({ product, surface = "hover" }: { product: Product; surface?: "hover" | "solid" }) {
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
    <article className={`group relative flex h-full flex-col overflow-hidden transition duration-500 hover:-translate-y-1.5 hover:scale-[1.012] ${surface === "solid" ? "bg-[#050607] hover:bg-[#111418]" : "bg-transparent hover:bg-[#050607]"}`}>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#0871cf]/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-70" />
      <div
        data-product-image-area
        className="relative m-3 aspect-[1.05/1] overflow-hidden rounded-[1.05rem] bg-transparent"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={resetSlider}
      >
        <div className="pointer-events-none absolute inset-x-8 bottom-4 h-12 rounded-full bg-transparent blur-2xl transition duration-500 group-hover:scale-105" />
        {product.discount > 0 ? (
          <div className="absolute left-0 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#0871cf] text-center text-[10px] font-black uppercase leading-tight tracking-[0.04em] text-white shadow-[0_10px_22px_rgba(8,113,207,0.34)]">
            <span>{product.discount}%<br />Off</span>
          </div>
        ) : null}
        {product.stock === "out-of-stock" ? (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_22px_rgba(0,0,0,0.22)]">
            Sold Out
          </div>
        ) : null}
        <div className="absolute right-3 top-3 z-10 flex flex-col items-center gap-2 opacity-95 transition duration-300 group-hover:opacity-100">
          <WishlistButton
            product={product}
            className="h-8 w-8 !border-0 !bg-transparent !p-0 text-white !shadow-none hover:!bg-transparent hover:text-white [&_svg]:h-6 [&_svg]:w-6 [&_svg]:stroke-white [&_svg]:drop-shadow-[0_3px_7px_rgba(0,0,0,0.8)] hover:[&_svg]:stroke-white"
          />
          <ProductShareButton
            product={product}
            className="h-8 w-8 !border-0 !bg-transparent !p-0 text-white !shadow-none hover:!bg-transparent hover:text-white [&_svg]:h-6 [&_svg]:w-6 [&_svg]:stroke-white [&_svg]:drop-shadow-[0_3px_7px_rgba(0,0,0,0.8)] hover:[&_svg]:stroke-white"
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
                className="object-contain p-3 transition duration-700 group-hover:scale-[1.08] sm:p-4"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center px-4 pb-4 pt-1 text-center">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[#12a8e6]">
          {product.category}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-2 line-clamp-2 min-h-10 text-center text-[15px] font-extrabold leading-5 text-white transition hover:text-[#12a8e6]"
        >
          {product.name}
        </Link>
        <div className="mt-0 max-h-0 translate-y-2 overflow-hidden rounded-full bg-white/[0.05] px-3 py-0 opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-8 group-hover:translate-y-0 group-hover:py-1.5 group-hover:opacity-100 [&>div]:justify-center [&>div]:text-slate-300 [&_span.font-semibold]:text-white">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-3 [&>div]:justify-center [&_span:first-child]:text-xl [&_span:first-child]:text-white [&_span]:text-slate-400">
          <PriceDisplay product={product} />
        </div>
        <div className="mt-auto w-full max-h-0 translate-y-3 overflow-hidden pt-0 opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:translate-y-0 group-hover:pt-4 group-hover:opacity-100">
          <AddToCartButton
            product={product}
            className="h-11 rounded-full !bg-[#0871cf] !text-white shadow-[0_16px_34px_rgba(8,113,207,0.3)] transition hover:!bg-[#12a8e6]"
          />
        </div>
      </div>
    </article>
  );
}
