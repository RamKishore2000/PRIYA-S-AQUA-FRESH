"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function WishlistButton({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useShop();
  const active = isWishlisted(product.id);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      className="h-9 w-9 rounded-full bg-white/95 shadow-sm"
      onClick={() => toggleWishlist(product)}
    >
      <Heart className={cn("h-4 w-4", active && "fill-rose-500 text-rose-500")} />
    </Button>
  );
}
