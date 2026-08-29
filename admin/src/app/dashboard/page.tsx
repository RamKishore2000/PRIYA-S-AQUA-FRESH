"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { StatsCard } from "@/components/admin/stats-card";
import { adminApi } from "@/services/api";
import type { Order, ServiceRequest } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

const emptyStats = {
  totalUsers: 0,
  totalDealers: 0,
  totalOrders: 0,
  totalServices: 0,
  activeProducts: 0,
  totalRevenue: 0,
};

type DashboardData = {
  stats: typeof emptyStats;
  orders: Order[];
  services: ServiceRequest[];
};

type MonthPoint = {
  key: string;
  label: string;
  value: number;
};

type StatusPoint = {
  label: string;
  value: number;
  color: string;
};

const initialData: DashboardData = {
  stats: emptyStats,
  orders: [],
  services: [],
};

const orderStatusColors: Record<string, string> = {
  Pending: "#f59e0b",
  Confirmed: "#0ea5e9",
  Packed: "#6366f1",
  Shipped: "#14b8a6",
  Delivered: "#16a34a",
  Cancelled: "#dc2626",
};

const serviceStatusColors: Record<string, string> = {
  New: "#0ea5e9",
  Assigned: "#6366f1",
  "In Progress": "#f59e0b",
  Completed: "#16a34a",
  Cancelled: "#dc2626",
};

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("en-IN", { month: "short" });
}

function getRecentMonths(count = 7): MonthPoint[] {
  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (count - 1 - index), 1);
    return { key: getMonthKey(date), label: getMonthLabel(date), value: 0 };
  });
}

function monthlyCount(items: { date: string }[], monthCount = 7) {
  const months = getRecentMonths(monthCount);
  const counts = new Map(months.map((month) => [month.key, 0]));

  items.forEach((item) => {
    const date = new Date(item.date);
    if (Number.isNaN(date.getTime())) return;
    const key = getMonthKey(date);
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  });

  return months.map((month) => ({ ...month, value: counts.get(month.key) || 0 }));
}

function statusDistribution<T extends string>(items: T[], statusOrder: T[], colors: Record<string, string>) {
  const counts = items.reduce<Record<string, number>>((result, status) => {
    result[status] = (result[status] || 0) + 1;
    return result;
  }, {});

  return statusOrder.map((status) => ({ label: status, value: counts[status] || 0, color: colors[status] }));
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(initialData);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getDashboard(),
      adminApi.listOrders(),
      adminApi.listServiceRequests(),
    ])
      .then(([dashboard, orders, services]) => {
        setData({ stats: dashboard.stats, orders, services });
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const dashboardStats = [
    { title: "Total Customers", value: String(data.stats.totalUsers), trend: "Registered accounts", icon: "users" },
    { title: "Total Dealers", value: String(data.stats.totalDealers), trend: "Dealer accounts", icon: "dealer" },
    { title: "Total Orders", value: String(data.stats.totalOrders), trend: "All orders", icon: "orders" },
    { title: "Total Services", value: String(data.stats.totalServices), trend: "Service requests", icon: "service" },
    { title: "Total Revenue", value: formatCurrency(data.stats.totalRevenue), trend: "Paid orders", icon: "revenue" },
  ];

  const orderMonthlyRows = useMemo(() => monthlyCount(data.orders.map((order) => ({ date: order.date }))), [data.orders]);
  const serviceMonthlyRows = useMemo(() => monthlyCount(data.services.map((service) => ({ date: service.createdDate }))), [data.services]);
  const orderStatusRows = useMemo(
    () => statusDistribution(data.orders.map((order) => order.status), ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"], orderStatusColors),
    [data.orders],
  );
  const serviceStatusRows = useMemo(
    () => statusDistribution(data.services.map((service) => service.status), ["New", "Assigned", "In Progress", "Completed", "Cancelled"], serviceStatusColors),
    [data.services],
  );

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title="Dashboard" description="Overview of sales, orders, customers, dealers, and services." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardStats.map((stat) => <StatsCard key={stat.title} {...stat} />)}
      </div>

      {loading ? <p className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-500 shadow-sm">Loading dashboard graphs...</p> : null}

      <div className="mt-6 grid gap-5">
        <DashboardGraphPair
          title="Product Orders"
          subtitle="Month-wise product order count. Hover a point to see exact orders."
          chartRows={orderMonthlyRows}
          chartLabel="Orders"
          statusTitle="Order Status Distribution"
          statusSubtitle="Current orders split by status."
          statusRows={orderStatusRows}
          tone="teal"
        />
        <DashboardGraphPair
          title="Service Requests"
          subtitle="Month-wise service request count. Hover a point to see exact requests."
          chartRows={serviceMonthlyRows}
          chartLabel="Requests"
          statusTitle="Service Status Distribution"
          statusSubtitle="Current service requests split by status."
          statusRows={serviceStatusRows}
          tone="indigo"
        />
      </div>
    </AdminShell>
  );
}

function DashboardGraphPair({
  title,
  subtitle,
  chartRows,
  chartLabel,
  statusTitle,
  statusSubtitle,
  statusRows,
  tone,
}: {
  title: string;
  subtitle: string;
  chartRows: MonthPoint[];
  chartLabel: string;
  statusTitle: string;
  statusSubtitle: string;
  statusRows: StatusPoint[];
  tone: "teal" | "indigo";
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
      <LineActivityChart title={title} subtitle={subtitle} rows={chartRows} label={chartLabel} tone={tone} />
      <StatusDonutChart title={statusTitle} subtitle={statusSubtitle} rows={statusRows} />
    </div>
  );
}

function LineActivityChart({ title, subtitle, rows, label, tone }: { title: string; subtitle: string; rows: MonthPoint[]; label: string; tone: "teal" | "indigo" }) {
  const [hovered, setHovered] = useState<MonthPoint | null>(null);
  const width = 720;
  const height = 330;
  const padding = { top: 28, right: 24, bottom: 46, left: 52 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...rows.map((row) => row.value));
  const ySteps = [maxValue, Math.ceil(maxValue * 0.75), Math.ceil(maxValue * 0.5), Math.ceil(maxValue * 0.25), 0].filter((value, index, array) => array.indexOf(value) === index);
  const color = tone === "teal" ? "#0f766e" : "#4f46e5";
  const fillColor = tone === "teal" ? "rgba(20, 184, 166, 0.16)" : "rgba(99, 102, 241, 0.15)";

  const points = rows.map((row, index) => {
    const x = padding.left + (rows.length <= 1 ? chartWidth / 2 : (index / (rows.length - 1)) * chartWidth);
    const y = padding.top + chartHeight - (row.value / maxValue) * chartHeight;
    return { ...row, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = points.length ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z` : "";
  const activePoint = hovered ? points.find((point) => point.key === hovered.key) : null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>

      <div className="relative mt-5 overflow-hidden">
        {activePoint ? (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg"
            style={{ left: `calc(${(activePoint.x / width) * 100}% - 3.5rem)`, top: Math.max(0, activePoint.y - 46) }}
          >
            <p className="font-bold text-slate-950">{activePoint.label}</p>
            <p>{activePoint.value} {label.toLowerCase()}</p>
          </div>
        ) : null}
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[21rem] w-full" role="img" aria-label={`${title} monthly line graph`}>
          <defs>
            <linearGradient id={`${tone}-activity-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={fillColor} />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {ySteps.map((value) => {
            const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
            return (
              <g key={value}>
                <line x1={padding.left} x2={padding.left + chartWidth} y1={y} y2={y} stroke="#dbe7f3" strokeDasharray="4 5" />
                <text x={padding.left - 12} y={y + 4} textAnchor="end" className="fill-slate-500 text-xs font-semibold">{value}</text>
              </g>
            );
          })}

          {points.map((point) => (
            <line key={point.key} x1={point.x} x2={point.x} y1={padding.top} y2={padding.top + chartHeight} stroke="#e2e8f0" strokeDasharray="4 5" />
          ))}

          <path d={areaPath} fill={`url(#${tone}-activity-fill)`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((point) => (
            <g key={point.key} onMouseEnter={() => setHovered(point)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <circle cx={point.x} cy={point.y} r="13" fill="transparent" />
              <circle cx={point.x} cy={point.y} r="4" fill="white" stroke={color} strokeWidth="3" />
              <text x={point.x} y={height - 12} textAnchor="middle" className="fill-slate-500 text-xs font-semibold">{point.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 flex justify-center gap-2 text-sm font-semibold" style={{ color }}>
        <span className="mt-2 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        {label} by month
      </div>
    </section>
  );
}

function StatusDonutChart({ title, subtitle, rows }: { title: string; subtitle: string; rows: StatusPoint[] }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>

      <div className="mt-8 grid place-items-center">
        <svg viewBox="0 0 180 180" className="h-56 w-56" role="img" aria-label={`${title} donut chart`}>
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="28" />
          {total > 0 ? rows.map((row) => {
            const dash = (row.value / total) * circumference;
            const segment = (
              <circle
                key={row.label}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={row.color}
                strokeWidth="28"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                transform="rotate(-90 90 90)"
              />
            );
            offset += dash;
            return segment;
          }) : null}
          <circle cx="90" cy="90" r="40" fill="white" />
          <text x="90" y="86" textAnchor="middle" className="fill-slate-950 text-xl font-bold">{total}</text>
          <text x="90" y="105" textAnchor="middle" className="fill-slate-500 text-xs font-semibold">Total</text>
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-600">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
              <span className="truncate">{row.label}</span>
            </span>
            <span className="font-bold text-slate-950">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}


