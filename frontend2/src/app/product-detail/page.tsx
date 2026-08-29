import { Suspense } from "react";
import { ProductDetailClient } from "@/components/shop/product-detail-client";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProductDetailClient />
    </Suspense>
  );
}