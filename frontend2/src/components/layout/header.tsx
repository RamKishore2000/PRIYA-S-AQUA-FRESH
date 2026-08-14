"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import type { SVGProps } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { useShop } from "@/context/shop-context";

type HeaderProps = {
  overlay?: boolean;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

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
  { label: "X", href: "https://x.com/priyasaquafresh", icon: XIcon, className: "text-[#1D2D2E]" },
];

const dealerSupportNumbers = ["+91 98765 43210", "+91 91234 56789"];

export function Header({ overlay = false }: HeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, cartCount, wishlistCount, openLogin, logout } = useShop();
  const isDealer = user?.role === "DEALER";
  const visibleNavLinks = isDealer ? navLinks.filter((link) => link.href !== "/services") : navLinks;
  const isActiveLink = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    if (!overlay) return;

    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  return (
    <>
    <header
      className={`inset-x-0 top-0 z-50 bg-[#F8F3EC] transition-shadow duration-300 ${
        overlay && scrolled
          ? "fixed shadow-[0_14px_36px_rgba(84,61,35,0.16)]"
          : "sticky"
      }`}
    >
      <div className="hidden border-b border-[#E5D8C7] bg-[#0A2426] text-[#FFF9F1] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-1.5 text-xs font-semibold">
          {isDealer ? (
            <div className="flex items-center gap-4">
              <span className="uppercase tracking-[0.18em] text-[#D8B879]">Dealer Support</span>
              {dealerSupportNumbers.map((number) => (
                <a key={number} href={`tel:${number.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-white transition hover:text-[#D8B879]">
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
                <social.icon className={`h-4 w-4 ${social.className}`} />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[150px_1fr_auto] items-center gap-4 px-4 py-3 md:grid-cols-[190px_1fr_auto] md:px-6">
        <Link href="/" className="relative flex h-12 w-36 shrink-0 items-center overflow-visible md:h-14 md:w-48" aria-label="Priya's Aqua Fresh">
          <Image
            src="/logo-header.png"
            alt="Priya's Aqua Fresh"
            width={486}
            height={191}
            className="h-full w-full object-contain"
            priority
          />
        </Link>

        <div className="hidden min-w-0 items-center justify-center lg:flex">
          <nav className={`flex items-center gap-1 transition-all duration-700 ease-out ${searchOpen ? "max-w-[430px] -translate-x-5 opacity-70" : "max-w-[640px] translate-x-0 opacity-100"}`}>
            {visibleNavLinks.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3 py-2 text-sm font-bold transition after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:origin-left after:rounded-full after:bg-[#B68A45] after:transition xl:px-4 ${
                    active
                      ? "text-[#B68A45] after:scale-x-100"
                      : "text-[#1D2D2E] after:scale-x-0 hover:bg-white/55 hover:text-[#0A2426] hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <nav className="hidden justify-self-center items-center gap-1 md:flex lg:hidden">
          {visibleNavLinks.slice(0, 4).map((link) => {
            const active = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-sm font-bold transition ${
                  active ? "text-[#B68A45]" : "text-[#1D2D2E] hover:bg-white/55 hover:text-[#B68A45]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 text-[#1D2D2E]">
          <form
            action="/search"
            className={`hidden items-center overflow-hidden rounded-lg border border-[#E5D8C7] bg-white shadow-[0_8px_24px_rgba(84,61,35,0.06)] transition-all duration-700 ease-out lg:flex ${searchOpen ? "w-[320px] px-3 py-1.5 opacity-100" : "w-10 px-0 py-0 opacity-100"}`}
            onMouseEnter={() => setSearchOpen(true)}
            onMouseLeave={() => setSearchOpen(false)}
          >
            <button type="button" onClick={() => setSearchOpen((open) => !open)} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#0A3A38]" aria-label="Search">
              <SearchIcon className="h-5 w-5" />
            </button>
            <input name="q" placeholder="Search purifiers, filters, spare parts..." className={`min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75] transition duration-500 ${searchOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`} />
          </form>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-[#E5D8C7] bg-white shadow-sm transition hover:border-[#B68A45] hover:text-[#0A3A38] lg:hidden" aria-label="Search">
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link href="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-lg border border-[#E5D8C7] bg-white shadow-sm transition hover:border-[#B68A45] hover:text-[#0A3A38]" aria-label="Wishlist">
            <HeartIcon className="h-5 w-5" />
            {wishlistCount ? <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#B68A45] text-[0.65rem] font-black text-white">{wishlistCount}</span> : null}
          </Link>
          <div className="group relative">
            <button onClick={() => (user ? undefined : openLogin())} className="grid h-10 w-10 place-items-center rounded-lg border border-[#E5D8C7] bg-white shadow-sm transition hover:border-[#B68A45] hover:text-[#0A3A38]" aria-label="Account">
              <UserIcon className="h-5 w-5" />
            </button>
            {user ? (
              <div className="invisible absolute right-0 top-10 z-50 w-72 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_20px_50px_rgba(84,61,35,0.12)]">
                  <p className="text-lg font-black text-[#1D2D2E]">{user.fullName}</p>
                  <p className="truncate text-sm text-[#5A6362]">{user.email}</p>
                  <div className="mt-4 grid gap-3 border-t border-[#E5D8C7] pt-4">
                    <Link href="/profile" className="font-black text-[#1D2D2E] hover:text-[#B68A45]">My Profile</Link>
                    <Link href="/profile/orders" className="font-black text-[#1D2D2E] hover:text-[#B68A45]">Order History</Link>
                    <button onClick={logout} className="text-left font-black text-red-600">Logout</button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <button id="header-cart-target" type="button" onClick={() => setCartOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-lg bg-[#0A3A38] text-white shadow-[0_8px_22px_rgba(10,36,38,0.18)] transition hover:bg-[#12383A]" aria-label="Cart">
            <CartIcon className="h-5 w-5" />
            {cartCount ? <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#B68A45] text-[0.65rem] font-black text-white">{cartCount}</span> : null}
          </button>
        </div>
      </div>
    </header>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
