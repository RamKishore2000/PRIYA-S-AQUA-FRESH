"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ShopProvider } from "@/context/shop-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ShopProvider>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </ShopProvider>
  );
}
