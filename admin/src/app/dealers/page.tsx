"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { dealers as initialDealers } from "@/data/admin";
import type { Dealer } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

export default function DealersPage() {
  const router = useRouter();
  const [dealers, setDealers] = useState<Dealer[]>(initialDealers);
  const [resetDealer, setResetDealer] = useState<Dealer | null>(null);
  const [message, setMessage] = useState("");
  const activeDealers = dealers.filter((dealer) => dealer.status === "Active").length;
  const inactiveDealers = dealers.filter((dealer) => dealer.status === "Inactive").length;

  function toggleDealerStatus(dealer: Dealer) {
    const nextStatus = dealer.status === "Active" ? "Inactive" : "Active";
    setDealers((current) => current.map((item) => item.id === dealer.id ? { ...item, status: nextStatus } : item));
    setMessage(nextStatus === "Active" ? "Dealer activated successfully." : "Dealer deactivated successfully.");
  }

  return (
    <AdminShell>
      <AdminToast message={message} />

      <PageHeader title="Dealers" description="Manage dealer accounts and access." actionHref="/dealers/new" actionLabel="Add Dealer" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Total Dealers" value={String(dealers.length)} trend="All dealer accounts" icon="dealer" />
        <StatsCard title="Active Dealers" value={String(activeDealers)} trend="Can place dealer orders" icon="users" />
        <StatsCard title="Inactive Dealers" value={String(inactiveDealers)} trend="Access paused" icon="alert" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">Dealer List</h2>
            <p className="text-sm text-slate-500">Dealer accounts are created by admin. Dealers do not self-register.</p>
          </div>
          <input placeholder="Search dealers" className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 lg:w-72" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Dealer Name", "Business Name", "Dealer Code", "Mobile", "Email", "GST Number", "Total Orders", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dealers.map((dealer) => (
                <tr key={dealer.id}>
                  <td className="px-5 py-4 font-bold text-slate-950">{dealer.name}</td>
                  <td className="px-5 py-4 text-slate-600">{dealer.businessName}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{dealer.dealerCode}</td>
                  <td className="px-5 py-4 text-slate-600">{dealer.mobile}</td>
                  <td className="px-5 py-4 text-slate-600">{dealer.email}</td>
                  <td className="px-5 py-4 text-slate-500">{dealer.gstNumber}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-700">{dealer.totalOrders}</p>
                    <p className="text-xs text-slate-400">{formatCurrency(dealer.totalPurchaseValue)}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge value={dealer.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{dealer.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        { label: "View Dealer", icon: "view", onClick: () => router.push(`/dealers/${dealer.id}`) },
                        { label: "Edit Dealer", icon: "edit", onClick: () => router.push(`/dealers/${dealer.id}/edit`) },
                        { label: "View Orders", icon: "orders", onClick: () => router.push(`/orders?dealer=${dealer.id}`) },
                        { label: "Reset Password", icon: "settings", onClick: () => setResetDealer(dealer) },
                        { label: dealer.status === "Active" ? "Deactivate Dealer" : "Activate Dealer", icon: "settings", onClick: () => toggleDealerStatus(dealer) },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {resetDealer ? (
        <ResetPasswordDialog
          dealerName={resetDealer.name}
          onClose={() => setResetDealer(null)}
          onSuccess={() => {
            setResetDealer(null);
            setMessage("Dealer password updated successfully.");
          }}
        />
      ) : null}
    </AdminShell>
  );
}
