"use client";

import { MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type ProductShareButtonProps = {
  product: Product;
  variant?: "icon" | "button";
  className?: string;
};

export function ProductShareButton({ product, variant = "icon", className }: ProductShareButtonProps) {
  function shareToWhatsApp() {
    const productUrl = `${window.location.origin}/products/${product.slug}`;
    const message = `Check this product: ${product.name} - ${productUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  if (variant === "button") {
    return (
      <Button type="button" variant="secondary" onClick={shareToWhatsApp} className={className}>
        <MessageCircle className="h-4 w-4" />
        Share on WhatsApp
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={`Share ${product.name} on WhatsApp`}
      title="Share on WhatsApp"
      className={cn("h-9 w-9 rounded-full bg-white/95 shadow-sm", className)}
      onClick={shareToWhatsApp}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
