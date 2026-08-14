"use client";

import { getProductDisplayPrice } from "@/lib/pricing";
import { useShop } from "@/context/shop-context";
import type { Product } from "@/types/product";

type PriceDisplayProps = {
  product: Product;
  className?: string;
  priceClassName?: string;
  originalClassName?: string;
  labelClassName?: string;
  center?: boolean;
};

export function PriceDisplay({ product, className = "", priceClassName = "", originalClassName = "", labelClassName = "", center = false }: PriceDisplayProps) {
  const { user } = useShop();
  const display = getProductDisplayPrice(product, user?.role);

  return (
    <div className={`flex flex-wrap items-end gap-2 ${center ? "justify-center" : ""} ${className}`}>
      <p className={`font-black text-[#172C2D] ${priceClassName}`}>Rs. {display.price.toLocaleString("en-IN")}</p>
      {display.originalPrice ? <p className={`font-bold text-[#9B958C] line-through ${originalClassName}`}>Rs. {display.originalPrice.toLocaleString("en-IN")}</p> : null}
      {user?.role === "DEALER" ? <span className={`pb-1 text-xs font-black uppercase tracking-[0.14em] text-[#B68A45] ${labelClassName}`}>{display.label}</span> : null}
    </div>
  );
}
