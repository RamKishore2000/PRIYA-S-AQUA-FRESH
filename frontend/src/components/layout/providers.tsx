"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Toaster } from "sonner";
import { AuthModal } from "@/components/auth/auth-modal";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { ReviewWidget } from "@/components/reviews/review-widget";
import { CartFlyProvider } from "@/context/cart-fly-context";
import { ShopProvider } from "@/context/shop-context";

export function Providers({ children }: { children: ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <ShopProvider onRequireLogin={() => setAuthOpen(true)}>
      <CartFlyProvider>
        {children}
        <ReviewWidget />
        <BottomNavigation />
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        <Toaster
          position="bottom-center"
          closeButton={false}
          icons={{ success: null, error: null, info: null, warning: null }}
          duration={2600}
          visibleToasts={3}
          toastOptions={{
            classNames: {
              toast: "priyas-toast",
              title: "priyas-toast-title",
              description: "priyas-toast-description",
              closeButton: "priyas-toast-close",
            },
          }}
        />
      </CartFlyProvider>
    </ShopProvider>
  );
}
