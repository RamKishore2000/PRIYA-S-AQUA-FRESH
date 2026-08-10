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
    <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
      {navItems.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} active={isActive(pathname, item.href)} />
      ))}
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
    "relative inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-semibold transition after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:origin-left after:rounded-full after:bg-teal-600 after:transition-transform",
    active
      ? "text-teal-700 after:scale-x-100"
      : "text-slate-700 after:scale-x-0 hover:text-slate-950 hover:after:scale-x-100",
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
