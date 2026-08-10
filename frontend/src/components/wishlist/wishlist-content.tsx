"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { LinkButton } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { getProducts } from "@/services/catalog-service";
import type { Product } from "@/types/product";

export function WishlistContent() {
  const { wishlistIds } = useShop();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const wishlistProducts = products.filter((product) => wishlistIds.includes(product.id));

  if (wishlistProducts.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-6 w-6" />}
        title="Your wishlist is empty."
        description="Save products you love and come back to them anytime."
        action={<LinkButton href="/products">Continue Shopping</LinkButton>}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {wishlistProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
