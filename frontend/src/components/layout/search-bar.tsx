"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";

const popularSearches = ["Alkaline Purifier", "RO Purifier", "Commercial RO", "Water Softener", "Filters"];

type SearchBarProps = {
  compact?: boolean;
  panel?: boolean;
};

export function SearchBar({ compact = false, panel = false }: SearchBarProps) {
  return (
    <div className={cn("w-full", panel ? "" : "group relative")}>
      <label className="sr-only" htmlFor={compact ? "mobile-search" : "site-search"}>
        Search products
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          id={compact ? "mobile-search" : "site-search"}
          className="h-12 w-full rounded-md border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
          placeholder="Search water purifiers, RO systems, spare parts..."
          autoFocus={panel}
        />
      </div>
      <div
        className={cn(
          "rounded-lg border border-slate-200 bg-white p-4 shadow-xl transition",
          panel
            ? "mt-4"
            : "invisible absolute left-0 right-0 top-[calc(100%+10px)] z-50 opacity-0 group-focus-within:visible group-focus-within:opacity-100",
        )}
      >
        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Popular Searches</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularSearches.map((item) => (
                <Link
                  key={item}
                  href={`/products?search=${encodeURIComponent(item)}`}
                  className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Suggested Products</p>
            <div className="mt-3 grid gap-3">
              {products.slice(0, 3).map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="flex items-center gap-3 rounded-md p-2 hover:bg-slate-50">
                  <span className="relative h-12 w-12 rounded-md bg-slate-50">
                    <Image src={product.image} alt={product.name} fill sizes="48px" className="object-contain p-1" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-950">{product.name}</span>
                    <span className="text-sm text-teal-700">{formatPrice(product.price)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
