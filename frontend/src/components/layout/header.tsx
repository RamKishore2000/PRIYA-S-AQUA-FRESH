"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Phone, Search, ShoppingCart, User, X } from "lucide-react";
import type { SVGProps } from "react";
import { SearchBar } from "@/components/layout/search-bar";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";
import { getStoredUser, logoutUser, type AuthUser } from "@/services/auth-service";

type HeaderProps = {
  overlay?: boolean;
};

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.48 0 .12 5.36.12 11.96c0 2.1.55 4.16 1.6 5.97L0 24l6.22-1.63a11.95 11.95 0 0 0 5.86 1.5h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.53-8.43ZM12.09 21.85h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.69.97.99-3.6-.23-.37a9.86 9.86 0 0 1-1.51-5.3c0-5.45 4.44-9.89 9.9-9.89a9.84 9.84 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 6.99c-.01 5.45-4.45 9.89-9.94 9.89Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.8-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.52 3.58 12 3.58 12 3.58s-7.52 0-9.39.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12c1.87.5 9.39.5 9.39.5s7.52 0 9.39-.5a3 3 0 0 0 2.11-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.23H4.29l13.32 17.42Z" />
    </svg>
  );
}

const topSocialLinks = [
  { label: "WhatsApp", href: "https://wa.me/919121043483", icon: WhatsAppIcon, className: "text-[#25d366]" },
  { label: "Facebook", href: "https://www.facebook.com/priyasaquafresh", icon: FacebookIcon, className: "text-[#1877f2]" },
  { label: "YouTube", href: "https://www.youtube.com/@priyasaquafresh", icon: YouTubeIcon, className: "text-[#ff0000]" },
  { label: "Instagram", href: "https://www.instagram.com/priyasaquafresh", icon: InstagramIcon, className: "text-[#e4405f]" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/priyas-aqua-fresh", icon: LinkedInIcon, className: "text-[#0a66c2]" },
  { label: "X", href: "https://x.com/priyasaquafresh", icon: XIcon, className: "text-slate-950" },
];

const dealerSupportNumbers = ["+91 98765 43210", "+91 91234 56789"];

export function Header({ overlay = false }: HeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const { cartCount, wishlistIds } = useShop();
  const overlayAtTop = overlay && !scrolled;
  const isDealer = user?.role === "DEALER";

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
        <div className="hidden border-b border-white/10 bg-[#06120f]/85 md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-1.5 text-xs font-semibold text-slate-300">
            {isDealer ? (
              <div className="flex items-center gap-4">
                <span className="uppercase tracking-[0.18em] text-[#12a8e6]">Dealer Support</span>
                {dealerSupportNumbers.map((number) => (
                  <a key={number} href={`tel:${number.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-white transition hover:text-[#12a8e6]">
                    <Phone className="h-3.5 w-3.5" />
                    {number}
                  </a>
                ))}
              </div>
            ) : (
              <span>Follow Priya&apos;s Aqua Fresh</span>
            )}
            <div className="flex items-center gap-2">
              {topSocialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="grid h-7 w-7 place-items-center rounded-full bg-white transition hover:-translate-y-0.5"
                >
                  <social.icon className={cn("h-4 w-4", social.className)} />
                </Link>
              ))}
            </div>
          </div>
        </div>
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
              <div className="mx-auto hidden w-full max-w-[620px] lg:block">
                <SearchBar compact />
              </div>
            ) : (
              <DesktopNavigation hideServices={isDealer} />
            )}
          </div>

          <div className="flex items-center justify-end gap-1">
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
              className="relative hidden h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d10] lg:inline-flex"
            >
              <Heart className="h-5 w-5" />
              {wishlistIds.length > 0 ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-[#12a8e6] px-1 text-[10px] font-bold leading-4 text-white shadow-[0_6px_14px_rgba(18,168,230,0.35)]">{wishlistIds.length}</span> : null}
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
              {cartCount > 0 ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-[#12a8e6] px-1 text-[10px] font-bold leading-4 text-white shadow-[0_6px_14px_rgba(18,168,230,0.35)]">{cartCount}</span> : null}
            </Button>
            <div
              className="relative hidden lg:block"
              onMouseEnter={() => {
                if (user) setProfileOpen(true);
              }}
              onMouseLeave={() => {
                if (user) setProfileOpen(false);
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                onClick={() => {
                  if (!user) openAccount();
                }}
                className={cn(
                  "relative h-10 w-10 rounded-md !bg-transparent !p-0 !text-white shadow-none transition hover:!bg-white/10 hover:!text-white focus-visible:!bg-white/10 active:!bg-white/10",
                  user && "!text-[#12a8e6] hover:!text-[#12a8e6]",
                )}
              >
                <User className="h-5 w-5" />
              </Button>
              {profileOpen && user ? (
                <div className="absolute right-0 top-10 z-50 w-56 pt-2">
                  <div className="rounded-lg border border-[#12a8e6]/20 bg-[#111a18] p-2 text-sm shadow-xl">
                    <div className="border-b border-white/10 px-3 py-2">
                      <p className="font-bold text-white">{user.fullName}</p>
                      <p className="truncate text-xs text-slate-300">{user.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setProfileOpen(false)} className="mt-1 block rounded-md px-3 py-2 font-semibold text-slate-200 hover:bg-[#12a8e6]/15 hover:text-[#12a8e6]">
                      My Profile
                    </Link>
                    <Link href="/profile/orders" onClick={() => setProfileOpen(false)} className="block rounded-md px-3 py-2 font-semibold text-slate-200 hover:bg-[#12a8e6]/15 hover:text-[#12a8e6]">
                      Order History
                    </Link>
                    <button type="button" onClick={logout} className="block w-full rounded-md px-3 py-2 text-left font-semibold text-red-300 hover:bg-red-500/10">
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {searchOpen ? (
            <div className="col-span-3 lg:hidden">
              <SearchBar compact panel />
            </div>
          ) : null}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLogin={setUser} />
    </>
  );
}
