"use client";

import { useEffect, useState } from "react";
import { SitePage } from "@/components/layout/site-page";
import { ProductListingPage } from "@/components/shop/product-listing-page";
import { ProductListingSkeleton } from "@/components/ui/skeletons";
import { getCategories, getProducts } from "@/services/catalog-service";
import type { Category, Product } from "@/types/product";

export function ProductsPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getProducts().catch(() => []), getCategories().catch(() => [])]).then(([nextProducts, nextCategories]) => {
      if (!active) return;
      setProducts(nextProducts);
      setCategories(nextCategories);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SitePage eyebrow="Shop" title="Shop All Products" description="Explore premium purification, commercial RO systems, electronics and spare parts." nativeCleanHero>
      {loading ? <ProductListingSkeleton /> : <ProductListingPage products={products} categories={categories} />}
    </SitePage>
  );
}
