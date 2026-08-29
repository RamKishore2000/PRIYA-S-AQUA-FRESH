"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { CartIcon, HeartIcon, ShareIcon } from "@/components/ui/icons";
import { useCartFly } from "@/context/cart-fly-context";
import { useShop } from "@/context/shop-context";
import type { Product } from "@/types/product";

export function ProductDetailActions({ product }: { product: Product }) {
  const router = useRouter();
  const { user, addToCart, openLogin } = useShop();
  const { flyToCart } = useCartFly();

  async function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    const startRect = document.querySelector("[data-product-detail-image]")?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
    const added = await addToCart(product.id);
    if (added) {
      flyToCart({ image: product.image, startRect });
    }
  }

  function handleBuyNow() {
    if (!user) {
      openLogin();
      return;
    }
    router.push(`/checkout?buyNow=${product.id}`);
  }

  return (
    <>
      <div className="hidden lg:mt-8 lg:grid lg:gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleAddToCart} className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0A3A38] font-black text-white transition hover:bg-[#12383A]">
            <CartIcon className="h-5 w-5" />
            Add to Cart
          </button>
          <button type="button" onClick={handleBuyNow} className="inline-flex h-14 items-center justify-center rounded-full border border-[#C59A55] font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
            Buy Now
          </button>
        </div>
        <ProductDetailIconActions product={product} desktop />
      </div>

      <div data-product-detail-mobile-actions className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#D9C5AB] bg-[#FFF9F1]/96 px-4 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] pt-2.5 shadow-[0_-12px_28px_rgba(10,36,38,0.12)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2.5">
          <button onClick={handleAddToCart} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0A3A38] text-sm font-black text-white shadow-[0_10px_24px_rgba(10,58,56,0.18)] transition hover:bg-[#12383A]">
            <CartIcon className="h-4 w-4" />
            Add to Cart
          </button>
          <button type="button" onClick={handleBuyNow} className="inline-flex h-12 items-center justify-center rounded-full border border-[#C59A55] bg-[#FFF9F1] text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
}

export function ProductDetailIconActions({ product, desktop = false }: { product: Product; desktop?: boolean }) {
  const { toggleWishlist, wishlistIds } = useShop();
  const wished = wishlistIds.includes(product.id);
  const [showBurst, setShowBurst] = useState(false);
  const burstTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
    };
  }, []);

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
    <div className={`flex items-center justify-end gap-2 ${desktop ? "lg:gap-3" : ""}`}>
      <button onClick={handleWishlist} className={`relative grid place-items-center overflow-visible rounded-full border border-[#E5D8C7] shadow-[0_10px_24px_rgba(84,61,35,0.10)] transition hover:border-[#B68A45] ${desktop ? "h-14 w-14" : "h-11 w-11"} ${wished ? "bg-[#0A3A38] text-white" : "bg-[#FFF9F1]/95 text-[#0A3A38] backdrop-blur"}`} aria-label="Wishlist">
        {showBurst ? (
          <span aria-hidden="true" className="wishlist-burst pointer-events-none absolute inset-1/2 z-20">
            <span className="wishlist-burst-ring" />
            <span className="wishlist-burst-heart wishlist-burst-heart-1">?</span>
            <span className="wishlist-burst-heart wishlist-burst-heart-2">?</span>
            <span className="wishlist-burst-heart wishlist-burst-heart-3">?</span>
            <span className="wishlist-burst-heart wishlist-burst-heart-4">?</span>
            <span className="wishlist-burst-heart wishlist-burst-heart-5">?</span>
            <span className="wishlist-burst-heart wishlist-burst-heart-6">?</span>
            <span className="wishlist-burst-heart wishlist-burst-heart-7">?</span>
            <span className="wishlist-burst-heart wishlist-burst-heart-8">?</span>
          </span>
        ) : null}
        <HeartIcon className="h-5 w-5" />
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(product.name)}`} className={`grid place-items-center rounded-full border border-[#E5D8C7] bg-[#FFF9F1]/95 text-[#0A3A38] shadow-[0_10px_24px_rgba(84,61,35,0.10)] backdrop-blur transition hover:border-[#B68A45] ${desktop ? "h-14 w-14" : "h-11 w-11"}`} aria-label="Share">
        <ShareIcon className="h-5 w-5" />
      </a>
    </div>
  );
}