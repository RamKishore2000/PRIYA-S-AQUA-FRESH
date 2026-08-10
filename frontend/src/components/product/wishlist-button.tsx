"use client";

import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const { isWishlisted, toggleWishlist } = useShop();
  const active = isWishlisted(product.id);
  const [showBurst, setShowBurst] = useState(false);
  const burstTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (burstTimer.current) {
        window.clearTimeout(burstTimer.current);
      }
    };
  }, []);

  function handleWishlistClick() {
    if (!active) {
      setShowBurst(false);
      window.requestAnimationFrame(() => setShowBurst(true));

      if (burstTimer.current) {
        window.clearTimeout(burstTimer.current);
      }

      burstTimer.current = window.setTimeout(() => {
        setShowBurst(false);
      }, 760);
    } else {
      setShowBurst(false);
    }

    toggleWishlist(product);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn("relative h-9 w-9 overflow-visible rounded-full bg-white/95 shadow-sm", className)}
      onClick={handleWishlistClick}
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
      <Heart className={cn("h-4 w-4", active && "fill-rose-500 text-rose-500")} />
    </Button>
  );
}
