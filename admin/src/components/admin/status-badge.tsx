import type { BuyerRole, CouponComputedStatus, OrderStatus, ServiceStatus, Status } from "@/types/admin";

type BadgeValue = Status | CouponComputedStatus | OrderStatus | ServiceStatus | BuyerRole | "Paid" | "Failed";

const colorMap: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  Upcoming: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Expired: "bg-red-50 text-red-700 ring-red-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Confirmed: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Packed: "bg-blue-50 text-blue-700 ring-blue-200",
  Shipped: "bg-blue-50 text-blue-700 ring-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Cancelled: "bg-red-50 text-red-700 ring-red-200",
  New: "bg-teal-50 text-teal-700 ring-teal-200",
  Assigned: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-200",
  Customer: "bg-sky-50 text-sky-700 ring-sky-200",
  Dealer: "bg-violet-50 text-violet-700 ring-violet-200",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Failed: "bg-red-50 text-red-700 ring-red-200",
};

export function StatusBadge({ value }: { value: BadgeValue }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${colorMap[value]}`}>
      {value}
    </span>
  );
}
