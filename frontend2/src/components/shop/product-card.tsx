"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { CartIcon, HeartIcon, ShareIcon } from "@/components/ui/icons";
import { useCartFly } from "@/context/cart-fly-context";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";
import { PriceDisplay } from "@/components/shop/price-display";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const { user, addToCart, toggleWishlist, wishlistIds } = useShop();
  const { flyToCart } = useCartFly();
  const wished = wishlistIds.includes(product.id);
  const displayPrice = getProductDisplayPrice(product, user?.role);
  const [showBurst, setShowBurst] = useState(false);
  const burstTimer = useRef<number | null>(null);
  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || 0;
  const shareLink = `https://wa.me/?text=${encodeURIComponent(`${product.name} - ${typeof window === "undefined" ? "" : window.location.origin}/products/${product.slug}`)}`;

  useEffect(() => {
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
    };
  }, []);

  async function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    const startRect = event.currentTarget.closest("article")?.querySelector("[data-product-image-area]")?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
    const added = await addToCart(product.id);
    if (added) {
      flyToCart({ image: product.image, startRect });
    }
  }

  function handleWishlist() {
    if (!wished) {
      setShowBurst(false);
      window.requestAnimationFrame(() => setShowBurst(true));
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setShowBurst(false), 760);
    } else {
      setShowBurst(false);
    }

    void toggleWishlist(product.id);
  }

  return (
    <article className="group overflow-hidden rounded-[0.9rem] border border-[#E8DCCB] bg-[#FFFBF6] text-center text-[#253738] shadow-[0_8px_24px_rgba(70,50,25,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(82,60,30,0.12)]">
      <div className="relative isolate h-40 overflow-hidden md:h-48 lg:h-56">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 flex items-center justify-center" aria-label={product.name}>
          <span data-product-image-area className="relative block aspect-square w-full max-w-[10rem] overflow-hidden bg-[#F7F0E7] md:max-w-[12rem] lg:max-w-[14.5rem]">
            {displayPrice.discount ? (
              <span className="absolute left-0 top-4 z-20 bg-[#0A3A38] px-3 py-1.5 text-[11px] font-black uppercase leading-none tracking-[0.12em] text-white shadow-[0_12px_24px_rgba(10,58,56,0.18)]">
                {displayPrice.discount}% Off
                <span className="absolute -right-3 top-0 h-0 w-0 border-y-[12px] border-l-[12px] border-y-transparent border-l-[#0A3A38]" />
                <span className="absolute left-0 top-full h-0 w-0 border-r-[8px] border-t-[7px] border-r-transparent border-t-[#12383A]" />
              </span>
            ) : null}
            <span className="absolute inset-x-8 bottom-4 h-12 rounded-[100%] bg-black/20 blur-xl transition duration-500 group-hover:bg-[#0A3A38]/12" />
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="280px"
              className="object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
              unoptimized
            />
            <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 rounded-md bg-[#FFF9F1] px-2.5 py-1 text-xs font-black leading-none text-[#B68A45] shadow-[0_10px_22px_rgba(84,61,35,0.16)]">
              <span aria-hidden="true">{"\u2605"}</span>
              {rating.toFixed(1)}
              <span className="text-[#7D7B75]">({reviewCount})</span>
            </span>
          </span>
        </Link>

        <span className="absolute right-2 top-2 z-30 flex flex-col gap-1.5 lg:right-4 lg:top-4 lg:gap-2">
          <button
            onClick={handleWishlist}
            className={`relative grid h-8 w-8 place-items-center overflow-visible rounded-lg backdrop-blur transition lg:h-9 lg:w-9 ${wished ? "bg-[#0A3A38] text-white" : "bg-[#FFF9F1]/90 text-[#0A3A38] hover:bg-[#0A3A38] hover:text-white"}`}
            aria-label="Wishlist"
          >
            {showBurst ? (
              <span aria-hidden="true" className="wishlist-burst pointer-events-none absolute inset-1/2 z-20">
                <span className="wishlist-burst-ring" />
                <span className="wishlist-burst-heart wishlist-burst-heart-1">♥</span>
                <span className="wishlist-burst-heart wishlist-burst-heart-2">♥</span>
                <span className="wishlist-burst-heart wishlist-burst-heart-3">♥</span>
                <span className="wishlist-burst-heart wishlist-burst-heart-4">♥</span>
                <span className="wishlist-burst-heart wishlist-burst-heart-5">♥</span>
                <span className="wishlist-burst-heart wishlist-burst-heart-6">♥</span>
                <span className="wishlist-burst-heart wishlist-burst-heart-7">♥</span>
                <span className="wishlist-burst-heart wishlist-burst-heart-8">♥</span>
              </span>
            ) : null}
            <HeartIcon className="h-4 w-4" />
          </button>
          <a href={shareLink} className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFF9F1]/90 text-[#0A3A38] backdrop-blur transition hover:bg-[#0A3A38] hover:text-white lg:h-9 lg:w-9" aria-label="Share">
            <ShareIcon className="h-4 w-4" />
          </a>
        </span>
      </div>

      <div className="mx-auto max-w-[18rem] px-2.5 pb-3 pt-2 lg:px-4 lg:pb-4">
        <p className="truncate text-[0.58rem] font-black uppercase leading-none tracking-[0.14em] text-[#B68A45] lg:text-[0.68rem] lg:tracking-[0.18em]">{product.category}</p>
        <Link href={`/products/${product.slug}`} className="mx-auto mt-2 block text-sm font-black leading-4 text-[#253738] transition hover:text-[#0A3A38] lg:text-base lg:leading-5">
          <span className="line-clamp-2 min-h-8 lg:min-h-0 lg:truncate">{product.name}</span>
        </Link>
        <PriceDisplay product={product} center className="mt-2" priceClassName="text-lg lg:text-2xl" originalClassName="pb-0.5 text-xs lg:text-sm" />
        <div className="mx-auto mt-3 grid max-w-[15rem] grid-cols-2 gap-1.5 lg:gap-2">
          <button onClick={handleAddToCart} className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-[#0A3A38] px-2 text-[0.68rem] font-black text-white transition hover:bg-[#124945] lg:h-10 lg:gap-1.5 lg:px-3 lg:text-xs">
            <CartIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            Add
          </button>
          <Link href={`/checkout?buyNow=${product.id}`} className="inline-flex h-9 items-center justify-center rounded-lg border border-[#C59A55] px-2 text-[0.68rem] font-black text-[#9B7137] transition hover:bg-[#F5E9D8] lg:h-10 lg:px-3 lg:text-xs">
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}
