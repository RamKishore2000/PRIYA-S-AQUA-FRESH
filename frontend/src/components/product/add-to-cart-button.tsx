"use client";

import { ShoppingCart } from "lucide-react";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { useCartFly } from "@/context/cart-fly-context";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const { addToCart } = useShop();
  const { flyToCart } = useCartFly();
  const disabled = product.stock === "out-of-stock";

  async function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    const productCard = event.currentTarget.closest("article");
    const startRect = productCard?.querySelector("[data-product-image-area]")?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
    const added = await addToCart(product);

    if (added) {
      flyToCart({ image: product.image, startRect });
    }
  }

  return (
    <Button
      type="button"
      className={cn("w-full", className)}
      disabled={disabled}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="h-4 w-4" />
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
