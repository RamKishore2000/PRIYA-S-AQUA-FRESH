"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import type { Product } from "@/types/product";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useShop();
  const disabled = product.stock === "out-of-stock";

  return (
    <Button
      type="button"
      className="w-full"
      disabled={disabled}
      onClick={() => addToCart(product)}
    >
      <ShoppingCart className="h-4 w-4" />
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
