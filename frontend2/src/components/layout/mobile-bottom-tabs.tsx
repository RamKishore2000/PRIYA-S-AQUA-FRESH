"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Home, ShoppingBag, User, Wrench } from "lucide-react";
import { useShop } from "@/context/shop-context";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/products", icon: ShoppingBag },
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Training", href: "/ro-training-institute", icon: GraduationCap },
];

export function MobileBottomTabs() {
  const pathname = usePathname();
  const { user, openLogin } = useShop();
  const hideForProductDetail = pathname.startsWith("/products/") || pathname.startsWith("/product-detail");

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <nav data-mobile-bottom-tabs className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#D9C5AB] bg-[#FFF9F1]/96 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 shadow-[0_-12px_30px_rgba(10,36,38,0.12)] backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
      <div className="mx-auto flex w-full items-end justify-between gap-0">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative grid min-h-12 place-items-center gap-0.5 w-[3.65rem] rounded-xl px-0 text-[0.64rem] font-black transition ${
                active ? "text-[#0A3A38]" : "text-[#63706E]"
              }`}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-full transition ${active ? "bg-[#0A3A38] text-white" : "bg-transparent"}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
        {user ? (
          <Link
            href="/profile"
            aria-current={isActive("/profile") ? "page" : undefined}
            className={`grid min-h-12 place-items-center gap-0.5 w-[3.65rem] rounded-xl px-0 text-[0.64rem] font-black transition ${
              isActive("/profile") ? "text-[#0A3A38]" : "text-[#63706E]"
            }`}
          >
            <span className={`grid h-7 w-7 place-items-center rounded-full transition ${isActive("/profile") ? "bg-[#0A3A38] text-white" : "bg-transparent"}`}>
              <User className="h-4 w-4" />
            </span>
            <span>Account</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={openLogin}
            className="grid min-h-12 place-items-center gap-0.5 w-[3.65rem] rounded-xl px-0 text-[0.64rem] font-black text-[#63706E] transition"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full">
              <User className="h-4 w-4" />
            </span>
            <span>Account</span>
          </button>
        )}
      </div>
    </nav>
  );
}
