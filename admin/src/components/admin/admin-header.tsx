"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/admin/icon";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/categories": "Categories",
  "/products": "Products",
  "/products/new": "Add Product",
  "/customers": "Customers",
  "/dealers": "Dealers",
  "/orders": "Orders",
  "/services": "Services",
  "/testimonials": "Testimonials",
  "/coupons": "Coupons",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function AdminHeader({ onMenuClick, onToggleSidebar }: { onMenuClick: () => void; onToggleSidebar: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const title = titles[pathname] ?? (pathname.startsWith("/dealers") ? "Dealers" : pathname.startsWith("/coupons") ? "Coupons" : "Admin");

  useEffect(() => {
    function closeProfile(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", closeProfile);
    return () => document.removeEventListener("mousedown", closeProfile);
  }, []);

  function logout() {
    sessionStorage.removeItem("priyas-admin-auth");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 lg:hidden">
          <Icon name="menu" />
        </button>
        <button type="button" onClick={onToggleSidebar} className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 lg:inline-flex">
          <Icon name="menu" />
        </button>
        <div>
          <p className="text-xs font-medium text-slate-500">Admin / {title}</p>
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex">
          <Icon name="search" className="text-slate-400" />
          <input className="w-48 bg-transparent outline-none" placeholder="Search admin..." />
        </label>
        <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600">
          <Icon name="bell" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div ref={profileRef} className="relative">
          <button
            type="button"
            aria-label="Open admin profile menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((value) => !value)}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-950 text-xs font-bold text-white">AD</span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-4 text-slate-700">Admin</span>
              <span className="block text-xs text-slate-400">Administrator</span>
            </span>
            <Icon name="chevron" className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
          {profileOpen ? (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-sm font-bold text-slate-950">Admin</p>
                <p className="text-xs text-slate-500">admin@priyasaquafresh.com</p>
              </div>
              <button className="mt-1 flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <Icon name="user" className="h-4 w-4" />
                My Profile
              </button>
              <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50">
                <Icon name="settings" className="h-4 w-4" />
                Settings
              </button>
              <button onClick={logout} className="mt-1 flex w-full items-center gap-2 rounded border-t border-slate-100 px-3 py-2 pt-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
                <Icon name="logout" className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
