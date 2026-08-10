"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { StatsCard } from "@/components/admin/stats-card";
import { adminApi } from "@/services/api";
import { formatCurrency } from "@/utils/format-currency";

const emptyStats = {
  totalUsers: 0,
  totalDealers: 0,
  totalOrders: 0,
  totalServices: 0,
  activeProducts: 0,
  totalRevenue: 0,
};

export default function DashboardPage() {
  const [stats, setStats] = useState(emptyStats);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminApi.getDashboard()
      .then((data) => setStats(data.stats))
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load dashboard."));
  }, []);

  const dashboardStats = [
    { title: "Total Users", value: String(stats.totalUsers), trend: "Registered accounts", icon: "users" },
    { title: "Total Dealers", value: String(stats.totalDealers), trend: "Dealer accounts", icon: "dealer" },
    { title: "Total Orders", value: String(stats.totalOrders), trend: "All orders", icon: "orders" },
    { title: "Total Services", value: String(stats.totalServices), trend: "Service requests", icon: "service" },
  ];

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title="Dashboard" description="Overview of sales, orders, customers, dealers, and services." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => <StatsCard key={stat.title} {...stat} />)}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend="Paid orders" icon="revenue" />
        <StatsCard title="Active Products" value={String(stats.activeProducts)} trend="Visible in catalog" icon="products" />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Recent Activity</h2>
        <p className="mt-2 text-sm text-slate-500">Orders and service activity will appear here after those APIs are connected.</p>
      </section>
    </AdminShell>
  );
}
