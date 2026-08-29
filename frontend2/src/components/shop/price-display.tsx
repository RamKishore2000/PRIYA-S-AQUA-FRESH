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
  stacked?: boolean;
  mobileInline?: boolean;
};

export function PriceDisplay({ product, className = "", priceClassName = "", originalClassName = "", labelClassName = "", center = false, stacked = false, mobileInline = false }: PriceDisplayProps) {
  const { user } = useShop();
  const display = getProductDisplayPrice(product, user?.role);

  if (stacked) {
    const hasSecondaryPrice = Boolean(display.originalPrice || user?.role === "DEALER");
    const layoutClass = mobileInline ? "flex flex-nowrap items-baseline justify-center gap-x-1.5 gap-y-0 overflow-hidden md:grid md:content-start md:gap-0.5" : "grid content-start gap-0.5";
    const heightClass = hasSecondaryPrice ? "min-h-[1.45rem] md:min-h-[2.45rem]" : "min-h-[1.1rem]";
    const alignClass = center ? (mobileInline ? "justify-center text-center md:justify-items-center" : "justify-items-center text-center") : "";

    return (
      <div data-price-display className={`${layoutClass} ${heightClass} ${alignClass} ${className}`}>
        <p data-current-price className={`whitespace-nowrap font-black leading-tight text-[#172C2D] ${priceClassName}`}>
          Rs. {display.price.toLocaleString("en-IN")}
        </p>
        <div className={`flex min-h-3 min-w-0 flex-nowrap items-center gap-1 ${center ? "justify-center" : ""}`}>
          {display.originalPrice ? (
            <p data-original-price className={`whitespace-nowrap font-bold leading-none text-[#9B958C] line-through ${originalClassName}`}>
              Rs. {display.originalPrice.toLocaleString("en-IN")}
            </p>
          ) : null}
          {user?.role === "DEALER" ? <span className={`text-[0.62rem] font-black uppercase leading-none tracking-[0.12em] text-[#B68A45] ${labelClassName}`}>{display.label}</span> : null}
        </div>
      </div>
    );
  }

  return (
    <div data-price-display className={`flex flex-nowrap items-end gap-2 overflow-hidden ${center ? "justify-center" : ""} ${className}`}>
      <p data-current-price className={`whitespace-nowrap font-black text-[#172C2D] ${priceClassName}`}>Rs. {display.price.toLocaleString("en-IN")}</p>
      {display.originalPrice ? <p data-original-price className={`whitespace-nowrap font-bold text-[#9B958C] line-through ${originalClassName}`}>Rs. {display.originalPrice.toLocaleString("en-IN")}</p> : null}
      {user?.role === "DEALER" ? <span className={`shrink-0 pb-1 text-xs font-black uppercase tracking-[0.14em] text-[#B68A45] ${labelClassName}`}>{display.label}</span> : null}
    </div>
  );
}