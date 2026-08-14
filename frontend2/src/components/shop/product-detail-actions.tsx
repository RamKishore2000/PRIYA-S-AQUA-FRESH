"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { CartIcon, HeartIcon, ShareIcon } from "@/components/ui/icons";
import { useCartFly } from "@/context/cart-fly-context";
import { useShop } from "@/context/shop-context";
import type { Product } from "@/types/product";

export function ProductDetailActions({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlistIds } = useShop();
  const { flyToCart } = useCartFly();
  const wished = wishlistIds.includes(product.id);
  const [showBurst, setShowBurst] = useState(false);
  const burstTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
    };
  }, []);

  async function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    const startRect = document.querySelector("[data-product-detail-image]")?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
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
    <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
      <button onClick={handleAddToCart} className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0A3A38] font-black text-white transition hover:bg-[#12383A]">
        <CartIcon className="h-5 w-5" />
        Add to Cart
      </button>
      <Link href={`/checkout?buyNow=${product.id}`} className="inline-flex h-14 items-center justify-center rounded-full border border-[#C59A55] font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
        Buy Now
      </Link>
      <button onClick={handleWishlist} className={`relative grid h-14 w-14 place-items-center overflow-visible rounded-full border border-[#E5D8C7] transition hover:border-[#B68A45] ${wished ? "bg-[#0A3A38] text-white" : "bg-white text-[#0A3A38]"}`} aria-label="Wishlist">
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
        <HeartIcon className="h-5 w-5" />
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(product.name)}`} className="grid h-14 w-14 place-items-center rounded-full border border-[#E5D8C7] bg-white text-[#0A3A38] transition hover:border-[#B68A45]" aria-label="Share">
        <ShareIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
