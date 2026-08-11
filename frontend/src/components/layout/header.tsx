"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";
import { getStoredUser, logoutUser, type AuthUser } from "@/services/auth-service";

type HeaderProps = {
  overlay?: boolean;
};

export function Header({ overlay = false }: HeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const { cartCount, wishlistIds } = useShop();
  const overlayAtTop = overlay && !scrolled;

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
      <header
        className={cn(
          "z-50 text-white transition",
          overlayAtTop
            ? "absolute inset-x-0 top-0 border-transparent bg-transparent"
            : "sticky top-0 border-b border-white/10 bg-[linear-gradient(112deg,rgba(16,23,27,0.92),rgba(20,32,31,0.9),rgba(7,18,15,0.94))] shadow-[0_18px_45px_rgba(0,0,0,0.26)] backdrop-blur-xl",
          overlay && scrolled ? "fixed inset-x-0" : null,
          scrolled ? "shadow-[0_18px_48px_rgba(0,0,0,0.34)]" : null,
        )}
      >
        <div className={cn("mx-auto grid max-w-7xl items-center gap-4 px-4 transition-all md:px-8", overlayAtTop ? "grid-cols-[minmax(140px,200px)_1fr_auto] py-2" : "grid-cols-[minmax(130px,190px)_1fr_auto] py-2")}>
          <Link
            href="/"
            className={cn(
              "relative flex min-w-0 items-center overflow-visible",
              overlayAtTop
                ? "h-[46px] w-[140px] sm:h-[52px] sm:w-[160px] lg:h-[58px] lg:w-[180px]"
                : "h-[44px] w-[132px] sm:h-[50px] sm:w-[150px] lg:h-[56px] lg:w-[170px]",
            )}
            aria-label="Priya's Aqua Fresh home"
          >
            <Image
              src="/logo-header.png"
              alt="Priya's Aquafresh"
              width={486}
              height={191}
              priority
              className="h-full w-full object-contain"
            />
          </Link>

          <div className="min-w-0">
            {searchOpen ? (
              <div className="mx-auto w-full max-w-[620px]">
                <SearchBar compact />
              </div>
            ) : (
              <DesktopNavigation />
            )}
          </div>

          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={searchOpen ? "Close search" : "Open search"}
              className={cn("text-white hover:bg-white/10", searchOpen && "bg-white/10 text-white")}
              onClick={() => setSearchOpen((open) => !open)}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d10]"
            >
              <Heart className="h-5 w-5" />
              {wishlistIds.length > 0 ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-slate-100 px-1 text-[10px] font-bold leading-4 text-slate-950">{wishlistIds.length}</span> : null}
            </Link>
            <Button
              id="header-cart-target"
              variant="ghost"
              size="icon"
              aria-label="Open cart"
              className="relative text-white hover:bg-white/10"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-slate-100 px-1 text-[10px] font-bold leading-4 text-slate-950">{cartCount}</span> : null}
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                aria-label="Account"
                onClick={openAccount}
                className={cn(
                  "h-10 rounded-full bg-[#12a8e6] px-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(18,168,230,0.24)] brightness-100 transition hover:bg-[#0871cf] hover:text-white sm:px-5",
                  user && "bg-[#12a8e6]",
                )}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user ? "Account" : "Login"}</span>
              </Button>
              {profileOpen && user ? (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-white/10 bg-[#111418] p-2 text-sm shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="font-bold text-white">{user.fullName}</p>
                    <p className="truncate text-xs text-slate-300">{user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setProfileOpen(false)} className="mt-1 block rounded-md px-3 py-2 font-semibold text-slate-200 hover:bg-white/10">
                    My Profile
                  </Link>
                  <Link href="/profile/orders" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 font-semibold text-slate-200 hover:bg-white/10">
                    Order History
                  </Link>
                  <button type="button" onClick={logout} className="block w-full rounded-md px-3 py-2 text-left font-semibold text-red-300 hover:bg-red-500/10">
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
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
