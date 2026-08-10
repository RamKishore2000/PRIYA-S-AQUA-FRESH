"use client";

import { useEffect, useState } from "react";
import { getProductDisplayPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { getStoredUser } from "@/services/auth-service";
import type { Product } from "@/types/product";

type PriceDisplayProps = {
  product?: Product;
  price?: number;
  originalPrice?: number;
};

export function PriceDisplay({ product, price, originalPrice }: PriceDisplayProps) {
  const [role, setRole] = useState<string | null>(() => getStoredUser()?.role || null);

  useEffect(() => {
    function syncRole() {
      setRole(getStoredUser()?.role || null);
    }
    window.addEventListener("priyas-auth-changed", syncRole);
    return () => window.removeEventListener("priyas-auth-changed", syncRole);
  }, []);

  const display = product ? getProductDisplayPrice(product, role) : { price: price || 0, originalPrice };

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-lg font-bold text-white">{formatPrice(display.price)}</span>
      {display.originalPrice ? (
        <span className="text-sm font-medium text-slate-400 line-through">
          {formatPrice(display.originalPrice)}
        </span>
      ) : null}
      {product && role === "DEALER" ? <span className="text-xs font-bold text-[#12a8e6]">Dealer Price</span> : null}
    </div>
  );
}
