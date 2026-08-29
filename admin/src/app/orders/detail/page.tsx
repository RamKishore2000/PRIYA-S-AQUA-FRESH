"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi, mapOrderStatusToApi } from "@/services/api";
import type { Order, OrderStatus } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

const statuses: OrderStatus[] = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrderDetailsPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("Pending");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") || "";
    setOrderId(id);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    adminApi.getOrder(orderId)
      .then((item) => {
        setOrder(item);
        setStatus(item.status);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load order."))
      .finally(() => setLoading(false));
  }, [orderId]);

  function saveStatus() {
    if (!order) return;
    setSaving(true);
    adminApi.setOrderStatus(order.id, mapOrderStatusToApi(status))
      .then((updatedOrder) => {
        setOrder(updatedOrder);
        setStatus(updatedOrder.status);
        setMessage("Order status updated successfully.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update order."))
      .finally(() => setSaving(false));
  }

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title={order?.orderNumber || "Order Details"} description="Review products, customer details, payment, delivery address, and update order status." />
      {loading ? <p className="rounded-lg border border-slate-200 bg-white p-5 font-semibold text-slate-500">Loading order...</p> : null}
      {!loading && !order ? <p className="rounded-lg border border-slate-200 bg-white p-5 font-semibold text-slate-500">Order not found.</p> : null}
      {order ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5"><h2 className="text-base font-bold text-slate-950">Products</h2></div>
            <div className="divide-y divide-slate-100">
              {order.products.map((product) => (
                <div key={product.id} className="grid gap-4 p-5 sm:grid-cols-[80px_1fr_auto]">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                    <Image src={product.imageUrl || "/admin/file.svg"} alt={product.productName} fill className="object-contain p-1.5" unoptimized />
                  </div>
                  <div><p className="font-bold text-slate-950">{product.productName}</p><p className="mt-1 text-sm text-slate-500">SKU: {product.productSku}</p><p className="mt-2 text-sm font-semibold text-slate-700">Qty: {product.quantity}</p></div>
                  <div className="font-bold text-slate-950 sm:text-right"><p>{formatCurrency(product.lineTotal)}</p><p className="mt-1 text-xs text-slate-500">{formatCurrency(product.unitPrice)} each</p></div>
                </div>
              ))}
            </div>
          </section>
          <aside className="space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-950">Status</h2>
              <div className="mt-4 flex flex-wrap gap-2"><StatusBadge value={order.payment} /><StatusBadge value={order.status} /></div>
              <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)} className="mt-4 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500">
                {statuses.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button type="button" onClick={saveStatus} disabled={saving} className="mt-3 h-10 w-full rounded-md bg-teal-600 px-4 text-sm font-bold text-white transition hover:bg-teal-700 disabled:opacity-60">{saving ? "Saving..." : "Update Status"}</button>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-950">Customer</h2><Info label="Name" value={order.buyerName} /><Info label="Mobile" value={order.buyerMobile} /><Info label="Email" value={order.buyerEmail || "-"} /><Info label="Role" value={order.role} /></section>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-950">Delivery Address</h2><p className="mt-3 text-sm leading-6 text-slate-600">{order.shippingAddress?.fullName}<br />{order.shippingAddress?.mobile}<br />{order.shippingAddress?.addressLine1}{order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br />{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p></section>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-950">Price Details</h2><div className="mt-4 space-y-3 text-sm"><Row label="Subtotal" value={formatCurrency(order.subtotalAmount)} /><Row label="Discount" value={`-${formatCurrency(order.discountAmount)}`} /><Row label="Shipping" value={formatCurrency(order.shippingAmount)} /><div className="border-t border-slate-200 pt-3"><Row label="Total" value={formatCurrency(order.amount)} strong /></div><Row label="Payment Type" value={order.paymentType || (order.paymentMethod === "COD" ? "Advance Payment" : "Full Payment")} /><Row label={order.paymentType === "Advance Payment" ? "Advance Paid" : "Paid Amount"} value={formatCurrency(order.paidAmount || 0)} /><Row label="Balance Amount" value={formatCurrency(order.balanceAmount || 0)} /></div></section>
          </aside>
        </div>
      ) : null}
    </AdminShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="mt-3 flex justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm"><span className="text-slate-500">{label}</span><span className="font-bold text-slate-900">{value}</span></div>;
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex justify-between ${strong ? "text-base font-bold text-slate-950" : "text-slate-600"}`}><span>{label}</span><span>{value}</span></div>;
}