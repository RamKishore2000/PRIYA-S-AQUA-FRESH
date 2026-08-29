import { Suspense } from "react";
import OrderDetailClient from "./order-detail-client";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailClient />
    </Suspense>
  );
}
