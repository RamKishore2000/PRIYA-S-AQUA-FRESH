"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductGridSkeleton } from "@/components/ui/skeletons";
import { getProducts } from "@/services/catalog-service";
import type { Product } from "@/types/product";

export function SearchResultsClient() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    let active = true;
    getProducts()
      .then((nextProducts) => {
        if (active) setProducts(nextProducts);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) => [product.name, product.category, product.description, product.sku || ""].some((value) => value.toLowerCase().includes(normalized)));
  }, [products, query]);

  return (
    <>
      {query ? <p className="mb-6 text-sm font-black text-[#40576C]">Showing results for: <span className="text-[#0057C8]">{query}</span></p> : null}
      {loading ? <ProductGridSkeleton /> : <ProductGrid products={filteredProducts} />}
    </>
  );
}