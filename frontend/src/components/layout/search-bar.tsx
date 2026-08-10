"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getProducts } from "@/services/catalog-service";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type SearchBarProps = {
  compact?: boolean;
  panel?: boolean;
};

export function SearchBar({ compact = false, panel = false }: SearchBarProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getProducts().then((items) => setProducts(items)).catch(() => setProducts([]));
  }, []);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return products
      .filter((product) =>
        [product.name, product.category, product.sku || ""].some((value) => value.toLowerCase().includes(normalizedQuery)),
      )
      .slice(0, 6);
  }, [products, query]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) return;
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  }

  return (
    <div className={cn("w-full", panel ? "" : "group relative")}>
      <label className="sr-only" htmlFor={compact ? "mobile-search" : "site-search"}>
        Search products
      </label>
      <form className="relative" onSubmit={submitSearch}>
        <input
          id={compact ? "mobile-search" : "site-search"}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 w-full rounded-md border border-white/15 bg-white/95 pl-4 pr-14 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          placeholder="Search water purifiers, RO systems, spare parts..."
          autoFocus={panel}
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1.5 top-1/2 inline-flex h-9 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-slate-950 text-white transition hover:bg-slate-800"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
      {query.trim() ? (
        <div
          className={cn(
            "rounded-lg border border-slate-200 bg-white p-3 shadow-xl transition",
            panel
              ? "mt-4"
              : "invisible absolute left-0 right-0 top-[calc(100%+10px)] z-50 opacity-0 group-focus-within:visible group-focus-within:opacity-100",
          )}
        >
        <p className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Search Suggestions
        </p>
        <div className="mt-2 grid max-h-[360px] gap-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => router.push(`/search?q=${encodeURIComponent(query.trim())}`)}
            className="mb-1 flex items-center justify-between rounded-md bg-slate-950 px-3 py-2 text-left text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <span>View all results for &quot;{query.trim()}&quot;</span>
            <Search className="h-4 w-4" />
          </button>
          {suggestions.length > 0 ? (
            suggestions.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="grid grid-cols-[58px_1fr] items-center gap-3 rounded-md p-2 transition hover:bg-slate-100">
                <span className="relative h-14 w-14 overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                  <Image src={product.image} alt={product.name} fill sizes="56px" className="object-contain p-1" unoptimized />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-950">{product.name}</span>
                </span>
              </Link>
            ))
          ) : (
            <div className="rounded-md bg-slate-50 p-4 text-sm font-semibold text-slate-500">
              No matching products found.
            </div>
          )}
        </div>
      </div>
      ) : null}
    </div>
  );
}
