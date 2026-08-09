import { formatPrice } from "@/lib/utils";

type PriceDisplayProps = {
  price: number;
  originalPrice?: number;
};

export function PriceDisplay({ price, originalPrice }: PriceDisplayProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-lg font-bold text-slate-950">{formatPrice(price)}</span>
      {originalPrice ? (
        <span className="text-sm font-medium text-slate-400 line-through">
          {formatPrice(originalPrice)}
        </span>
      ) : null}
    </div>
  );
}
