"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("priyas-admin-auth") !== "true") {
      router.replace("/login");
      return;
    }
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, [router]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">Loading admin...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className={`fixed inset-y-0 left-0 z-40 hidden transition-all lg:block ${collapsed ? "w-20" : "w-72"}`}>
        <AdminSidebar collapsed={collapsed} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close sidebar" type="button" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-slate-950/40" />
          <div className="relative h-full w-80 max-w-[86vw]">
            <AdminSidebar collapsed={false} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className={`transition-all ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <AdminHeader onMenuClick={() => setMobileOpen(true)} onToggleSidebar={() => setCollapsed((value) => !value)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
