"use client";

import { Suspense } from "react";
import OrderDetailClient from "../[id]/order-detail-client";

export default function StaticOrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailClient />
    </Suspense>
  );
}
