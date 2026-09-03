"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { CartIcon, HeartIcon, ShareIcon } from "@/components/ui/icons";
import { useCartFly } from "@/context/cart-fly-context";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";
import { getCanonicalProductUrl, getProductDetailHref } from "@/lib/product-links";
import { PriceDisplay } from "@/components/shop/price-display";
import { buildSelectedVariantPayload } from "@/services/shop-service";
import type { Product } from "@/types/product";

export function ProductCard({ product, onWishlistChange }: { product: Product; onWishlistChange?: (product: Product) => void }) {
  const router = useRouter();
  const { user, addToCart, toggleWishlist, wishlistIds, wishlistItemKeys, openLogin } = useShop();
  const { flyToCart } = useCartFly();
  const displayedVariant = product.imageVariants.find((variant) => variant.imageUrl === product.image);
  const selectedVariant = product.selectedVariantKey
    ? {
        selectedColorName: product.selectedColorName,
        selectedColorCode: product.selectedColorCode,
        selectedImageUrl: product.selectedImageUrl || product.image,
        selectedVariantKey: product.selectedVariantKey,
      }
    : displayedVariant
      ? displayedVariant
      : null;
  const selectedPayload = buildSelectedVariantPayload(selectedVariant);
  const selectedVariantKey = selectedPayload.selectedVariantKey || "";
  const wished = selectedVariantKey ? wishlistItemKeys.includes(`${product.id}:${selectedVariantKey}`) : wishlistIds.includes(product.id);
  const displayPrice = getProductDisplayPrice(product, user?.role);
  const [showBurst, setShowBurst] = useState(false);
  const burstTimer = useRef<number | null>(null);
  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || 0;
  const productHref = getProductDetailHref(product.slug);
  const shareLink = `https://wa.me/?text=${encodeURIComponent(`${product.name} - ${getCanonicalProductUrl(product.slug)}`)}`;

  useEffect(() => {
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
    };
  }, []);

  async function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    const startRect = event.currentTarget.closest("article")?.querySelector("[data-product-image-area]")?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
    const added = await addToCart(product.id, 1, selectedPayload);
    if (added) {
      flyToCart({ image: product.image, startRect });
    }
  }

  function handleBuyNow() {
    if (!user) {
      openLogin();
      return;
    }
    const params = new URLSearchParams({ buyNow: product.id });
    if (selectedPayload.selectedImageUrl) params.set("selectedImageUrl", selectedPayload.selectedImageUrl);
    if (selectedPayload.selectedColorName) params.set("selectedColorName", selectedPayload.selectedColorName);
    if (selectedPayload.selectedColorCode) params.set("selectedColorCode", selectedPayload.selectedColorCode);
    if (selectedPayload.selectedVariantKey) params.set("selectedVariantKey", selectedPayload.selectedVariantKey);
    router.push(`/checkout?${params.toString()}`);
  }

  async function handleWishlist() {
    if (!wished) {
      setShowBurst(false);
      window.requestAnimationFrame(() => setShowBurst(true));
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setShowBurst(false), 760);
    } else {
      setShowBurst(false);
    }

    await toggleWishlist(product.id, selectedPayload);
    onWishlistChange?.(product);
  }

  return (
    <article data-product-card className="group overflow-hidden rounded-[0.9rem] border border-[#D8EAF8] bg-[#FFFFFF] text-center text-[#253738] shadow-[0_8px_24px_rgba(0,87,200,0.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,87,200,0.12)]">
      <div className="relative isolate h-48 overflow-hidden md:h-52 lg:h-56">
        <Link href={productHref} className="absolute inset-0 flex items-center justify-center" aria-label={product.name}>
          <span data-product-image-area className="relative block aspect-square w-full max-w-[12.25rem] overflow-hidden bg-[#F3FAFF] md:max-w-[13.25rem] lg:max-w-[14.5rem]">


            <span className="absolute inset-x-8 bottom-4 h-12 rounded-[100%] bg-black/20 blur-xl transition duration-500 group-hover:bg-[#0057C8]/12" />
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="280px"
              className="object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
              unoptimized
            />
            <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 rounded-md bg-[#FFFFFF] px-2.5 py-1 text-xs font-black leading-none text-[#0057C8] shadow-[0_10px_22px_rgba(0,87,200,0.14)]">
              <span aria-hidden="true">{"\u2605"}</span>
              {rating.toFixed(1)}
              <span className="text-[#74879A]">({reviewCount})</span>
            </span>
          </span>
        </Link>

        <span className="absolute right-2 top-2 z-30 flex flex-col gap-1.5 lg:right-4 lg:top-4 lg:gap-2">
          <button
            onClick={handleWishlist}
            className={`relative grid h-8 w-8 place-items-center overflow-visible rounded-lg backdrop-blur transition lg:h-9 lg:w-9 ${wished ? "bg-[#0057C8] text-white" : "bg-[#FFFFFF]/90 text-[#0057C8] hover:bg-[#0057C8] hover:text-white"}`}
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
          <a href={shareLink} className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFFFFF]/90 text-[#0057C8] backdrop-blur transition hover:bg-[#0057C8] hover:text-white lg:h-9 lg:w-9" aria-label="Share">
            <ShareIcon className="h-4 w-4" />
          </a>
        </span>
      </div>

      <div data-product-card-body className="mx-auto w-full max-w-full px-3 pb-2 pt-1 lg:max-w-[18rem] lg:px-4 lg:pb-4 lg:pt-2">
        <p data-product-category-label className="mx-auto block w-full max-w-full truncate text-[0.56rem] font-black uppercase leading-none tracking-[0.12em] text-[#0057C8] lg:text-[0.68rem] lg:tracking-[0.18em]">{product.category}</p>
        <Link href={productHref} className="mx-auto mt-1 block min-w-0 max-w-full overflow-hidden text-[0.78rem] font-black leading-[0.95rem] text-[#253738] transition hover:text-[#0057C8] md:text-sm lg:mt-2 lg:text-base lg:leading-5">
          <span data-product-name-text className="line-clamp-2 min-h-[2.24rem] leading-[1.12rem] lg:min-h-0 lg:truncate">{product.name}</span>
        </Link>
        <PriceDisplay product={product} center stacked mobileInline className="mt-1 lg:mt-2" priceClassName="text-base md:text-lg lg:text-2xl" originalClassName="text-[0.68rem] md:text-sm" />
        <div data-product-actions className="mx-auto mt-2 grid w-full max-w-[15rem] grid-cols-[2.55rem_minmax(0,1fr)] items-center gap-1.5 lg:mt-3 lg:flex lg:w-full lg:gap-2">
          <button data-product-add-button onClick={handleAddToCart} className="inline-flex h-8 min-w-0 items-center justify-center gap-1 rounded-lg bg-[#0057C8] px-2 text-[0.62rem] font-black text-white transition hover:bg-[#124945] lg:h-10 lg:flex-1 lg:gap-1.5 lg:px-3 lg:text-xs whitespace-nowrap" aria-label={`Add ${product.name} to cart`}>
            <CartIcon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <span data-add-label aria-hidden="true">Add</span>
          </button>
          <button data-product-buy-button type="button" onClick={handleBuyNow} className="inline-flex h-9 min-w-0 items-center justify-center rounded-lg border border-[#D4A55D] bg-[linear-gradient(90deg,#B8863E,#D4A55D)] px-3 text-[0.72rem] font-black text-white shadow-[0_8px_18px_rgba(184,134,62,0.24)] transition hover:brightness-105 lg:h-10 lg:flex-1 lg:px-3 lg:text-xs whitespace-nowrap">
            <span data-buy-label-full>Buy Now</span>
            <span data-buy-label-short className="hidden">Buy</span>
          </button>
        </div>
      </div>
    </article>
  );
}
