"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ChevronDown, Heart, Mail, Menu, Phone, Search, ShoppingCart, User, X } from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";
import { getStoredUser, logoutUser, type AuthUser } from "@/services/auth-service";
import { getCategories } from "@/services/catalog-service";
import type { Category } from "@/types/product";

export function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const { cartCount, wishlistIds } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function syncUser() {
      setUser(getStoredUser());
    }
    window.addEventListener("priyas-auth-changed", syncUser);
    return () => window.removeEventListener("priyas-auth-changed", syncUser);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function openAccount() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setProfileOpen((open) => !open);
  }

  function logout() {
    logoutUser();
    setUser(null);
    setProfileOpen(false);
    router.push("/");
  }

  return (
    <>
      <div className="bg-emerald-700 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-sm font-semibold leading-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:px-8">
          <span className="inline-flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0" />
            <span>Head Office: 2-4-1082, NO.102, OM SRI SAI NILAYAM, NIMBOLIADDA, KACHIGUDA</span>
          </span>
          <span className="inline-flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="mailto:priyasaquafreshsales@gmail.com" className="inline-flex items-center gap-2 transition hover:text-cyan-100">
              <Mail className="h-4 w-4 shrink-0" />
              priyasaquafreshsales@gmail.com
            </a>
            <a href="tel:+919951078699" className="inline-flex items-center gap-2 transition hover:text-cyan-100">
              <Phone className="h-4 w-4 shrink-0" />
              +919951078699
            </a>
          </span>
        </div>
      </div>
      <header className={cn("sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition", scrolled ? "border-slate-200 shadow-sm" : "border-transparent")}>
        <div className={cn("mx-auto grid max-w-7xl grid-cols-[minmax(118px,190px)_1fr_auto] items-center gap-4 px-4 transition-all md:px-8", scrolled ? "py-2" : "py-4")}>
          <Link href="/" className="flex min-w-0 items-center" aria-label="Priya's Aqua Fresh home">
            <Image
              src="/images/brand/priyas-aqua-fresh-logo-cropped.png"
              alt="Priya's Aquafresh"
              width={1180}
              height={445}
              priority
              className="h-auto w-[118px] object-contain sm:w-[145px] lg:w-[172px]"
            />
          </Link>

          <div className="mx-auto hidden w-full max-w-[590px] min-w-0 lg:block">
            <SearchBar />
          </div>

          <div className="flex items-center justify-end gap-1.5 sm:gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={searchOpen ? "Close search" : "Open search"}
              className={cn("lg:hidden", searchOpen && "bg-teal-50 text-teal-700")}
              onClick={() => setSearchOpen((open) => !open)}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                onClick={openAccount}
                className={cn("h-12 w-12 flex-col gap-0 rounded-md text-slate-900 lg:h-14 lg:w-16", user && "bg-teal-50 text-teal-700")}
              >
                <User className="h-5 w-5" />
                <span className="hidden text-[11px] font-bold leading-4 lg:block">Account</span>
              </Button>
              {profileOpen && user ? (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="font-bold text-slate-950">{user.fullName}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setProfileOpen(false)} className="mt-1 block rounded-md px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">
                    My Profile
                  </Link>
                  <Link href="/profile/orders" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">
                    Order History
                  </Link>
                  <button type="button" onClick={logout} className="block w-full rounded-md px-3 py-2 text-left font-semibold text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative inline-flex h-12 w-12 flex-col items-center justify-center gap-0 rounded-md text-slate-900 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 lg:h-14 lg:w-16"
            >
              <Heart className="h-5 w-5" />
              <span className="hidden text-[11px] font-bold leading-4 lg:block">Favorites</span>
              {wishlistIds.length > 0 ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-teal-600 px-1 text-[10px] leading-4 text-white">{wishlistIds.length}</span> : null}
            </Link>
            <Button
              id="header-cart-target"
              variant="ghost"
              size="icon"
              aria-label="Open cart"
              className="relative h-12 w-12 flex-col gap-0 rounded-md text-slate-900 lg:h-14 lg:w-14"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden text-[11px] font-bold leading-4 lg:block">Cart</span>
              {cartCount > 0 ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-teal-600 px-1 text-[10px] leading-4 text-white">{cartCount}</span> : null}
            </Button>
          </div>
        </div>
        <div className="hidden border-t border-slate-100 bg-white lg:block">
          <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 md:px-8">
            <div className="group relative">
              <Link
                href="/categories"
                className="inline-flex h-11 min-w-[184px] items-center justify-between gap-3 rounded-md bg-emerald-700 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Menu className="h-5 w-5" />
                  All Categories
                </span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 mt-2 w-[520px] rounded-lg border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="rounded-md p-3 hover:bg-emerald-50"
                    >
                      <span className="block font-semibold text-slate-950">{category.name}</span>
                      <span className="text-sm text-slate-500">{category.productCount} products</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <DesktopNavigation />
            <div className="ml-auto hidden items-center gap-3 xl:flex">
              <a
                href="tel:+919951078699"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 text-sm font-bold text-emerald-800 transition hover:border-emerald-200 hover:bg-emerald-100"
              >
                <Phone className="h-4 w-4" />
                <span>Need Help?</span>
                <span className="text-emerald-700">+919951078699</span>
              </a>
              <a
                href="mailto:priyasaquafreshsales@gmail.com"
                aria-label="Mail Priya's Aqua Fresh sales"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLogin={setUser} />
    </>
  );
}
