"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center justify-center lg:flex" aria-label="Main navigation">
      <div className="inline-flex items-center gap-7 rounded-full border border-white/25 px-5 py-2.5 shadow-[0_12px_34px_rgba(0,0,0,0.18)] backdrop-blur">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} active={isActive(pathname, item.href)} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={navLinkClass(active)}>
      {label}
    </Link>
  );
}

function navLinkClass(active: boolean) {
  return cn(
    "inline-flex items-center text-sm font-semibold tracking-wide transition",
    active
      ? "text-[#12a8e6]"
      : "text-slate-300 hover:text-white",
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
