"use client";

import { AdminModalShell } from "@/components/admin/admin-modal-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import type { Coupon, CouponComputedStatus } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

export function CouponViewDialog({ coupon, status, onClose }: { coupon: Coupon; status: CouponComputedStatus; onClose: () => void }) {
  const rows = [
    ["Offer Title", coupon.title || "Not set"],
    ["Offer Subtitle", coupon.subtitle || "Not set"],
    ["Coupon Code", coupon.code],
    ["Discount Type", coupon.discountType],
    ["Discount Value", coupon.discountType === "Percentage" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)],
    ["Minimum Order", formatCurrency(coupon.minimumOrderAmount)],
    ["Maximum Discount", coupon.maximumDiscountAmount ? formatCurrency(coupon.maximumDiscountAmount) : "Not set"],
    ["Start Date & Time", `${coupon.startDate} ${coupon.startTime}`],
    ["End Date & Time", `${coupon.endDate} ${coupon.endTime}`],
    ["Usage Limit", String(coupon.usageLimit)],
    ["Applies To", coupon.applicableProductIds.length ? "Selected Products" : "All Products"],
    ["Selected Products", coupon.applicableProducts?.length ? coupon.applicableProducts.map((product) => product.name).join(", ") : "All products"],
    ["Sort Order", String(coupon.sortOrder)],
  ];

  return (
    <AdminModalShell labelledBy="coupon-view-title" maxWidth="lg" onClose={onClose}>
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div>
          <h2 id="coupon-view-title" className="text-lg font-bold text-slate-950">{coupon.code}</h2>
          <p className="text-sm text-slate-500">Coupon details</p>
        </div>
        <StatusBadge value={status} />
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end border-t border-slate-200 p-5">
        <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Close</button>
      </div>
    </AdminModalShell>
  );
}
