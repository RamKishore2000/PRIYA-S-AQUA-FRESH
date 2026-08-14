import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CartFlyProvider } from "@/context/cart-fly-context";
import { ShopProvider } from "@/context/shop-context";
import { ReviewWidget } from "@/components/reviews/review-widget";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Priya's Aqua Fresh | Premium Water Purification",
  description: "Premium water purifiers, RO systems, alkaline water solutions and home purification support.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <ShopProvider>
          <CartFlyProvider>
            {children}
            <ReviewWidget />
          </CartFlyProvider>
        </ShopProvider>
      </body>
    </html>
  );
}
