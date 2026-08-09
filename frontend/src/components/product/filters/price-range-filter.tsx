"use client";

import { formatPrice } from "@/lib/utils";

type PriceRangeFilterProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

export function PriceRangeFilter({ min, max, value, onChange }: PriceRangeFilterProps) {
  const [currentMin, currentMax] = value;
  const minPercent = ((currentMin - min) / (max - min)) * 100;
  const maxPercent = ((currentMax - min) / (max - min)) * 100;

  const updateMin = (nextValue: number) => {
    onChange([Math.min(nextValue, currentMax), currentMax]);
  };

  const updateMax = (nextValue: number) => {
    onChange([currentMin, Math.max(nextValue, currentMin)]);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{formatPrice(currentMin)}</span>
        <span>{formatPrice(currentMax)}</span>
      </div>
      <div className="relative h-8">
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-teal-600"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={currentMin}
          onChange={(event) => updateMin(Number(event.target.value))}
          className="range-thumb pointer-events-none absolute inset-x-0 top-0 h-8 w-full appearance-none bg-transparent"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={500}
          value={currentMax}
          onChange={(event) => updateMax(Number(event.target.value))}
          className="range-thumb pointer-events-none absolute inset-x-0 top-0 h-8 w-full appearance-none bg-transparent"
          aria-label="Maximum price"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="grid gap-1 text-xs font-semibold text-slate-500">
          Min Price
          <input
            type="number"
            min={min}
            max={currentMax}
            value={currentMin}
            onChange={(event) => updateMin(Number(event.target.value))}
            className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-slate-500">
          Max Price
          <input
            type="number"
            min={currentMin}
            max={max}
            value={currentMax}
            onChange={(event) => updateMax(Number(event.target.value))}
            className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-950 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>
      </div>
    </div>
  );
}
