"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  open: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
};

export function MobileNavigation({ open, onClose, onOpenAuth }: MobileNavigationProps) {
  const pathname = usePathname();
  const orderedItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Services", href: "/services" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <div
      className={cn("fixed inset-0 z-[70] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        className={cn("absolute inset-0 bg-slate-950/40 transition", open ? "opacity-100" : "opacity-0")}
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute left-0 top-0 h-full w-80 max-w-[86vw] bg-white p-5 shadow-2xl transition duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile menu"
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-950">Priya&apos;s Aqua Fresh</span>
          <Button variant="ghost" size="icon" aria-label="Close menu" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid gap-1">
          {orderedItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "rounded-md border-l-2 px-3 py-3 font-semibold hover:bg-slate-100",
                isActive(pathname, item.href)
                  ? "border-[#12a8e6] bg-[#12a8e6]/10 text-[#0871cf]"
                  : "border-transparent text-slate-800",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/wishlist" onClick={onClose} className="rounded-md px-3 py-3 font-semibold text-slate-800 hover:bg-slate-100">
            Wishlist
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="rounded-md px-3 py-3 text-left font-semibold text-slate-800 hover:bg-slate-100"
          >
            Account / Login
          </button>
        </div>
      </aside>
    </div>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
