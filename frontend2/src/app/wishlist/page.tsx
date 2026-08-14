"use client";

import { useEffect, useState } from "react";
import { SitePage } from "@/components/layout/site-page";
import { ProductGrid } from "@/components/shop/product-grid";
import { fetchWishlist } from "@/services/shop-service";
import type { Product } from "@/types/product";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("Loading wishlist...");

  useEffect(() => {
    fetchWishlist().then((wishlist) => setProducts(wishlist.products)).catch((error) => setMessage(error.message));
  }, []);

  return (
    <SitePage eyebrow="Wishlist" title="Saved products" description="Products you saved for later.">
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-10 text-center font-semibold text-[#5A6362] shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
              {message}
            </div>
          )}
        </div>
      </section>
    </SitePage>
  );
}
