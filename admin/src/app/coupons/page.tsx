"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { CouponFormDialog } from "@/components/admin/coupon-form-dialog";
import { CouponViewDialog } from "@/components/admin/coupon-view-dialog";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/api";
import type { Coupon, CouponComputedStatus } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

function getCouponStatus(coupon: Coupon): CouponComputedStatus {
  if (coupon.manualStatus === "Inactive") return "Inactive";
  const now = new Date();
  const start = new Date(`${coupon.startDate}T${coupon.startTime}`);
  const end = new Date(`${coupon.endDate}T${coupon.endTime}`);
  if (now < start) return "Upcoming";
  if (now > end) return "Expired";
  return "Active";
}

function formatValidity(coupon: Coupon) {
  const start = new Date(`${coupon.startDate}T${coupon.startTime}`);
  const end = new Date(`${coupon.endDate}T${coupon.endTime}`);
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return { start: formatter.format(start), end: formatter.format(end) };
}

function discountText(coupon: Coupon) {
  return coupon.discountType === "Percentage" ? `${coupon.discountValue}% OFF` : `${formatCurrency(coupon.discountValue)} OFF`;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [viewCoupon, setViewCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const statusCounts = coupons.reduce<Record<CouponComputedStatus, number>>(
    (acc, coupon) => {
      acc[getCouponStatus(coupon)] += 1;
      return acc;
    },
    { Active: 0, Inactive: 0, Upcoming: 0, Expired: 0 },
  );

  useEffect(() => {
    adminApi.listCoupons()
      .then(setCoupons)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load coupons."))
      .finally(() => setLoading(false));
  }, []);

  function openAddCoupon() {
    setFormMode("add");
    setSelectedCoupon(null);
    setFormOpen(true);
  }

  function openEditCoupon(coupon: Coupon) {
    setFormMode("edit");
    setSelectedCoupon(coupon);
    setFormOpen(true);
  }

  async function saveCoupon(coupon: Coupon) {
    try {
      const savedCoupon = formMode === "edit" ? await adminApi.updateCoupon(coupon) : await adminApi.createCoupon(coupon);
      setCoupons((current) =>
        formMode === "edit"
          ? current.map((item) => (item.id === savedCoupon.id ? savedCoupon : item))
          : [savedCoupon, ...current],
      );
      setMessage(formMode === "edit" ? "Coupon updated successfully." : "Coupon added successfully.");
      setFormOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save coupon.");
    }
  }

  function toggleCoupon(coupon: Coupon) {
    const nextStatus = coupon.manualStatus === "Active" ? "Inactive" : "Active";
    adminApi.setCouponStatus(coupon.id, nextStatus === "Active" ? "ACTIVE" : "INACTIVE")
      .then((updatedCoupon) => {
        setCoupons((current) => current.map((item) => item.id === coupon.id ? updatedCoupon : item));
        setMessage(nextStatus === "Active" ? "Coupon activated successfully." : "Coupon deactivated successfully.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update coupon."));
  }

  return (
    <AdminShell>
      <AdminToast message={message} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Coupons</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage promotional coupon codes.</p>
        </div>
        <button type="button" onClick={openAddCoupon} className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
          Add Coupon
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Coupons" value={String(coupons.length)} trend="All promotional codes" icon="coupon" />
        <StatsCard title="Active" value={String(statusCounts.Active)} trend="Currently usable" icon="coupon" />
        <StatsCard title="Upcoming" value={String(statusCounts.Upcoming)} trend="Scheduled coupons" icon="clock" />
        <StatsCard title="Expired" value={String(statusCounts.Expired)} trend="Past validity" icon="alert" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Coupon Code", "Discount", "Minimum Order", "Validity", "Usage Limit", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((coupon) => {
                const validity = formatValidity(coupon);
                const status = getCouponStatus(coupon);
                return (
                  <tr key={coupon.id}>
                    <td className="px-5 py-4 font-bold text-slate-950">{coupon.code}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <p className="font-bold">{discountText(coupon)}</p>
                      {coupon.maximumDiscountAmount ? <p className="text-xs text-slate-400">Max {formatCurrency(coupon.maximumDiscountAmount)}</p> : null}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{formatCurrency(coupon.minimumOrderAmount)}</td>
                    <td className="px-5 py-4 text-slate-500">
                      <p>{validity.start}</p>
                      <p className="text-xs">to {validity.end}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{coupon.usageLimit}</td>
                    <td className="px-5 py-4"><StatusBadge value={status} /></td>
                    <td className="px-5 py-4 text-slate-500">{coupon.createdDate}</td>
                    <td className="px-5 py-4">
                      <RowActionsDropdown
                        actions={[
                          { label: "View Coupon", icon: "view", onClick: () => setViewCoupon(coupon) },
                          { label: "Edit Coupon", icon: "edit", onClick: () => openEditCoupon(coupon) },
                          { label: coupon.manualStatus === "Active" ? "Deactivate Coupon" : "Activate Coupon", icon: "settings", onClick: () => toggleCoupon(coupon) },
                          {
                            label: "Delete Coupon",
                            confirmItemName: "Coupon",
                            onConfirm: () => {
                              adminApi.deleteCoupon(coupon.id)
                                .then(() => {
                                  setCoupons((current) => current.filter((item) => item.id !== coupon.id));
                                  setMessage("Coupon deleted successfully.");
                                })
                                .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to delete coupon."));
                            },
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && coupons.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No coupons found. Add your first coupon.</p> : null}
        </div>
      </section>

      <CouponFormDialog
        key={`${formOpen ? "open" : "closed"}-${formMode}-${selectedCoupon?.id ?? "new"}`}
        mode={formMode}
        open={formOpen}
        initialCoupon={selectedCoupon}
        onClose={() => setFormOpen(false)}
        onSave={saveCoupon}
      />
      {viewCoupon ? <CouponViewDialog coupon={viewCoupon} status={getCouponStatus(viewCoupon)} onClose={() => setViewCoupon(null)} /> : null}
    </AdminShell>
  );
}
