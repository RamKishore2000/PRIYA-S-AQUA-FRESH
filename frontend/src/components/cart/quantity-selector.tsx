"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function QuantitySelector({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8"
        aria-label="Decrease quantity"
        onClick={onDecrease}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="flex h-8 min-w-10 items-center justify-center rounded-md border border-slate-200 text-sm font-semibold">
        {quantity}
      </span>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8"
        aria-label="Increase quantity"
        onClick={onIncrease}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
