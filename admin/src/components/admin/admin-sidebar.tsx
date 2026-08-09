"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/admin/icon";

const groups = [
  { title: "Main", items: [{ label: "Dashboard", href: "/dashboard", icon: "dashboard" }] },
  {
    title: "Catalog",
    items: [
      { label: "Categories", href: "/categories", icon: "categories" },
      { label: "Products", href: "/products", icon: "products" },
    ],
  },
  {
    title: "Users",
    items: [
      { label: "Customers", href: "/customers", icon: "users" },
      { label: "Dealers", href: "/dealers", icon: "dealer" },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", href: "/orders", icon: "orders" },
      { label: "Coupons", href: "/coupons", icon: "coupon" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Services", href: "/services", icon: "service" },
      { label: "Testimonials", href: "/testimonials", icon: "customer" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Reports", href: "/reports", icon: "reports" },
      { label: "Settings", href: "/settings", icon: "settings" },
    ],
  },
];

export function AdminSidebar({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    sessionStorage.removeItem("priyas-admin-auth");
    router.push("/login");
  }

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center border-b border-slate-200 px-4">
        <div className={`relative shrink-0 bg-white ${collapsed ? "h-12 w-12" : "h-14 w-44"}`}>
          <Image
            src="/images/brand/priyas-aqua-fresh-logo-cropped.png"
            alt="Priya's Aqua Fresh"
            fill
            sizes={collapsed ? "48px" : "176px"}
            className="object-contain"
            priority
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed ? <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{group.title}</p> : null}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                      active ? "bg-teal-50 text-teal-700 shadow-[inset_3px_0_0_#0d9488]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <Icon name={item.icon} className={active ? "text-teal-700" : "text-slate-500"} />
                    {!collapsed ? <span>{item.label}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
          title={collapsed ? "Logout" : undefined}
        >
          <Icon name="logout" className="text-slate-500" />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  );
}
