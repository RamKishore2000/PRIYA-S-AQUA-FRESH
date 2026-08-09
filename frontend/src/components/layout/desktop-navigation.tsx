"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
      {navItems.slice(0, 2).map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} active={isActive(pathname, item.href)} />
      ))}
      <div className="group relative">
        <Link href="/categories" className={navLinkClass(isActive(pathname, "/categories"))}>
          Categories <ChevronDown className="h-4 w-4" />
        </Link>
        <div className="invisible absolute left-0 top-full z-50 mt-3 w-[620px] rounded-lg border border-slate-200 bg-white p-4 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="rounded-md p-3 hover:bg-slate-50"
              >
                <span className="block font-semibold text-slate-950">{category.name}</span>
                <span className="text-sm text-slate-500">{category.productCount} products</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {navItems.slice(2).map((item) => (
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
