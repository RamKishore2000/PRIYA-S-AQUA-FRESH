"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/api";
import type { Order } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("All");
  const [status, setStatus] = useState("All");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listOrders()
      .then(setOrders)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch = !term || [order.orderNumber, order.buyerName, order.buyerMobile, order.buyerEmail, order.firstProductName].some((value) => value.toLowerCase().includes(term));
      const matchesPayment = payment === "All" || order.payment === payment;
      const matchesStatus = status === "All" || order.status === status;
      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [orders, payment, search, status]);

  const paidOrders = orders.filter((order) => order.payment === "Paid" || order.payment === "Partial").length;
  const confirmedOrders = orders.filter((order) => order.status === "Confirmed").length;
  const totalRevenue = orders.reduce((total, order) => total + Number(order.paidAmount || 0), 0);

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title="Orders" description="View customer and dealer orders with product images and payment status." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Orders" value={String(orders.length)} trend="All placed orders" icon="orders" />
        <StatsCard title="Paid Orders" value={String(paidOrders)} trend="Payment completed" icon="revenue" />
        <StatsCard title="Confirmed" value={String(confirmedOrders)} trend="Ready for processing" icon="grid" />
        <StatsCard title="Paid Revenue" value={formatCurrency(totalRevenue)} trend="Paid order value" icon="revenue" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-5 lg:grid-cols-[1fr_180px_180px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, mobile, product" className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
          <select value={payment} onChange={(event) => setPayment(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500">
            {["All", "Paid", "Partial", "Pending", "Failed"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500">
            {["All", "Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Product", "Order", "Customer", "Items", "Amount", "Payment", "Status", "Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                        <Image src={order.firstProductImage || "/admin/file.svg"} alt={order.firstProductName} fill className="object-contain p-1.5" unoptimized />
                      </div>
                      <p className="line-clamp-2 max-w-[220px] font-semibold text-slate-700">{order.firstProductName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-950">{order.orderNumber}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{order.buyerName}</p>
                    <p className="text-xs text-slate-500">{order.buyerMobile}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{order.items}</td>
                  <td className="px-5 py-4"><p className="font-bold text-slate-950">{formatCurrency(order.amount)}</p><p className="mt-1 text-xs font-semibold text-slate-500">Paid: {formatCurrency(order.paidAmount || 0)}</p>{Number(order.balanceAmount || 0) > 0 ? <p className="text-xs font-semibold text-amber-700">Balance: {formatCurrency(order.balanceAmount || 0)}</p> : null}</td>
                  <td className="px-5 py-4"><div className="flex flex-col items-start gap-1"><StatusBadge value={order.payment} /><span className="text-xs font-semibold text-slate-500">{order.paymentType || (order.paymentMethod === "COD" ? "Advance Payment" : "Full Payment")}</span></div></td>
                  <td className="px-5 py-4"><StatusBadge value={order.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{order.date}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown actions={[{ label: "View Order", icon: "view", onClick: () => router.push(`/orders/detail?id=${order.id}`) }]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredOrders.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No orders found.</p> : null}
          {loading ? <p className="p-5 text-sm font-semibold text-slate-500">Loading orders...</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}
