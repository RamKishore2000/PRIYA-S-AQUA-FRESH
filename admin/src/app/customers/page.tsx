"use client";

import { useMemo, useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/api";
import type { Customer, Status } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

type ApiCustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

function toApiStatus(status: Status): ApiCustomerStatus {
  if (status === "Blocked") return "BLOCKED";
  return status === "Active" ? "ACTIVE" : "INACTIVE";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listCustomers()
      .then(setCustomers)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load customers."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter((customer) => customer.status === "Active").length,
    inactive: customers.filter((customer) => customer.status === "Inactive").length,
    blocked: customers.filter((customer) => customer.status === "Blocked").length,
  }), [customers]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((customer) =>
      [customer.fullName, customer.mobile, customer.status].some((value) => String(value || "").toLowerCase().includes(term)),
    );
  }, [customers, search]);

  function updateStatus(customer: Customer, status: Status) {
    adminApi.setCustomerStatus(customer.id, toApiStatus(status))
      .then((updatedCustomer) => {
        setCustomers((current) => current.map((item) => item.id === customer.id ? updatedCustomer : item));
        setMessage(`Customer marked ${status.toLowerCase()}.`);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update customer."));
  }

  function getStatusActions(customer: Customer) {
    return [
      customer.status !== "Active" ? { label: "Activate Customer", icon: "settings", onClick: () => updateStatus(customer, "Active") } : null,
      customer.status !== "Inactive" ? { label: "Mark Inactive", icon: "alert", onClick: () => updateStatus(customer, "Inactive") } : null,
      customer.status !== "Blocked" ? { label: "Block Customer", icon: "alert", tone: "destructive" as const, onClick: () => updateStatus(customer, "Blocked") } : null,
    ].filter((action): action is NonNullable<typeof action> => Boolean(action));
  }

  return (
    <AdminShell>
      <AdminToast message={message} />

      <PageHeader title="Customers" description="Manage customer accounts, access status, and purchase activity." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Customers" value={String(stats.total)} trend="Registered customer accounts" icon="users" />
        <StatsCard title="Active" value={String(stats.active)} trend="Can login and shop" icon="customer" />
        <StatsCard title="Inactive" value={String(stats.inactive)} trend="Access paused" icon="alert" />
        <StatsCard title="Blocked" value={String(stats.blocked)} trend="Access denied" icon="settings" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">Customer List</h2>
            <p className="text-sm text-slate-500">Inactive and blocked customers cannot login until reactivated.</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or mobile"
            className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 lg:w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Customer Name", "Mobile", "Orders", "Total Spent", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-5 py-4 font-bold text-slate-950">{customer.fullName}</td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{customer.mobile}</td>                  <td className="px-5 py-4 text-slate-600">{customer.totalOrders}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-5 py-4"><StatusBadge value={customer.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{customer.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={getStatusActions(customer)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredCustomers.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No customers found.</p> : null}
          {loading ? <p className="p-5 text-sm font-semibold text-slate-500">Loading customers...</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}
