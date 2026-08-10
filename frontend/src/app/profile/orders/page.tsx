"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Package, User } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { LinkButton } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getStoredUser } from "@/services/auth-service";
import { fetchMyOrders, orderImageUrl, type Order } from "@/services/order-service";

function statusClass(value: string) {
  if (value === "PAID" || value === "CONFIRMED" || value === "DELIVERED") return "bg-emerald-50 text-emerald-700";
  if (value === "PENDING") return "bg-amber-50 text-amber-700";
  if (value === "CANCELLED" || value === "FAILED") return "bg-red-50 text-red-700";
  return "bg-blue-50 text-blue-700";
}

function isVisibleOrder(order: Order) {
  return order.paymentStatus !== "PENDING" && order.orderStatus !== "PENDING";
}

export default function OrdersPage() {
  const [user] = useState(() => getStoredUser());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) return;
    fetchMyOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, [user]);

  const visibleOrders = useMemo(() => orders.filter(isVisibleOrder), [orders]);

  if (!user) {
    return (
      <SitePage>
        <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <User className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">Login Required</h1>
          <p className="mt-3 text-slate-600">Please login from the header account icon to view your orders.</p>
          <LinkButton href="/" className="mt-6">Back to Home</LinkButton>
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage>
      <PageHeader eyebrow="Account" title="My Orders" description="Track confirmed orders, payment status, and product details." />
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        {loading ? <p className="rounded-lg border border-slate-200 bg-white p-5 font-semibold text-slate-600">Loading orders...</p> : null}
        {!loading && visibleOrders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-4 font-semibold text-slate-700">No confirmed orders found yet.</p>
            <p className="mt-1 text-sm text-slate-500">After payment confirmation, your orders will appear here.</p>
            <LinkButton href="/products" className="mt-5">Shop Products</LinkButton>
          </div>
        ) : null}
        <div className="space-y-4">
          {visibleOrders.map((order) => {
            const firstItem = order.items[0];
            return (
              <Link key={order.id} href={`/profile/orders/${order.id}`} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md sm:grid-cols-[96px_1fr_auto]">
                <div className="relative h-24 w-24 overflow-hidden rounded-md bg-slate-50">
                  <Image src={orderImageUrl(firstItem?.imageUrl)} alt={firstItem?.productName || order.orderNumber} fill className="object-contain p-2" unoptimized />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-slate-950">{order.orderNumber}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(order.paymentStatus)}`}>{order.paymentStatus}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                  </div>
                  <p className="mt-2 line-clamp-1 font-semibold text-slate-700">{firstItem?.productName || "Order items"}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"} - {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="flex items-center font-bold text-slate-950 sm:justify-end">{formatPrice(order.totalAmount)}</div>
              </Link>
            );
          })}
        </div>
      </section>
    </SitePage>
  );
}
