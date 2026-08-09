"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { cartCount, wishlistIds } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 text-center text-xs font-medium text-slate-200 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>Free Delivery on Selected Orders</span>
          <span>Premium Water Purification Solutions</span>
          <span>Need Help? Contact Our Experts</span>
        </div>
      </div>
      <header className={cn("sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition", scrolled ? "border-slate-200 shadow-sm" : "border-transparent")}>
        <div className={cn("mx-auto grid max-w-7xl grid-cols-[minmax(120px,180px)_1fr_auto] items-center gap-4 px-4 transition-all md:px-8", scrolled ? "py-1.5" : "py-2")}>
          <Link href="/" className="flex min-w-0 items-center" aria-label="Priya's Aqua Fresh home">
            <Image
              src="/images/brand/priyas-aqua-fresh-logo-cropped.png"
              alt="Priya's Aquafresh"
              width={1180}
              height={445}
              priority
              className="h-auto w-[110px] object-contain sm:w-[135px] lg:w-[165px]"
            />
          </Link>

          <DesktopNavigation />

          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={searchOpen ? "Close search" : "Open search"}
              className={cn(searchOpen && "bg-teal-50 text-teal-700")}
              onClick={() => setSearchOpen((open) => !open)}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Account" onClick={() => setAuthOpen(true)}>
              <User className="h-5 w-5" />
            </Button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              <Heart className="h-5 w-5" />
              {wishlistIds.length > 0 ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-teal-600 px-1 text-[10px] leading-4 text-white">{wishlistIds.length}</span> : null}
            </Link>
            <Button variant="ghost" size="icon" aria-label="Open cart" className="relative" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-teal-600 px-1 text-[10px] leading-4 text-white">{cartCount}</span> : null}
            </Button>
          </div>
        </div>
        {searchOpen ? (
          <div className="border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
              <SearchBar compact panel />
            </div>
          </div>
        ) : null}
      </header>

      <MobileNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenAuth={() => setAuthOpen(true)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
