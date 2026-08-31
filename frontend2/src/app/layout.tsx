import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CartFlyProvider } from "@/context/cart-fly-context";
import { ShopProvider } from "@/context/shop-context";
import { ReviewWidget } from "@/components/reviews/review-widget";
import { CapacitorAppRuntime } from "@/components/app/capacitor-app-runtime";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#F3FAFF",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Priya's Aqua Fresh | Premium Water Purification",
  description: "Premium water purifiers, RO systems, alkaline water solutions and home purification support.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="preload" href="/images/brand/priyas-aqua-fresh-logo-cropped.png" as="image" />
      </head>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(location.hostname==='localhost'||location.protocol==='capacitor:'){document.body.classList.add('priyas-native-app')}}catch(e){}`,
          }}
        />
        <ShopProvider>
          <CartFlyProvider>
            <CapacitorAppRuntime />

            {children}
            <ReviewWidget />
          </CartFlyProvider>
        </ShopProvider>
      </body>
    </html>
  );
}