"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Home, ShoppingBag, User, Wrench } from "lucide-react";
import { useShop } from "@/context/shop-context";
import { cn } from "@/lib/utils";
import { getStoredUser, type AuthUser } from "@/services/auth-service";

const bottomNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/products", icon: ShoppingBag },
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Account", href: "/profile", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { requestLogin, wishlistIds } = useShop();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  useEffect(() => {
    function syncUser() {
      setUser(getStoredUser());
    }
    window.addEventListener("priyas-auth-changed", syncUser);
    return () => window.removeEventListener("priyas-auth-changed", syncUser);
  }, []);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#08120f]/95 px-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_36px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:hidden"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
        {bottomNavItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          const count = item.href === "/wishlist" ? wishlistIds.length : 0;
          const accountNeedsLogin = item.href === "/profile" && !user;
          const className = cn(
            "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[10px] font-bold transition",
            active ? "text-[#12a8e6]" : "text-slate-300 hover:text-white",
          );
          const content = (
            <>
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition",
                  active ? "bg-[#12a8e6]/15" : "bg-transparent",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="max-w-full truncate">{item.label}</span>
              {count > 0 ? (
                <span className="absolute right-[18%] top-1 h-4 min-w-4 rounded-full bg-[#12a8e6] px-1 text-center text-[10px] font-black leading-4 text-white">
                  {count}
                </span>
              ) : null}
            </>
          );

          if (accountNeedsLogin) {
            return (
              <button key={item.href} type="button" className={className} onClick={requestLogin}>
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
