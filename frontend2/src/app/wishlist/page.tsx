"use client";

import { useEffect, useState } from "react";
import { SitePage } from "@/components/layout/site-page";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductGridSkeleton } from "@/components/ui/skeletons";
import { fetchWishlist } from "@/services/shop-service";
import type { Product } from "@/types/product";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist().then((wishlist) => setProducts(wishlist.products)).catch((error) => setMessage(error.message)).finally(() => setLoading(false));
  }, []);

  return (
    <SitePage eyebrow="Wishlist" title="Saved products" description="Products you saved for later.">
      <section data-native-screen="wishlist" data-product-listing-section className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <ProductGridSkeleton />
          ) : products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-6 text-center font-semibold text-[#40576C] shadow-[0_10px_30px_rgba(0,87,200,0.07)] md:p-10">
              {message}
            </div>
          )}
        </div>
      </section>
    </SitePage>
  );
}
