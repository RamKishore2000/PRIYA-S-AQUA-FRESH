"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Package, UserIcon } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { getStoredUser } from "@/services/auth-service";
import { fetchMyOrders, orderImageUrl, type Order } from "@/services/order-service";

function formatPrice(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function statusClass(value: string) {
  if (value === "PAID" || value === "CONFIRMED" || value === "DELIVERED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (value === "PARTIAL") return "bg-blue-50 text-blue-700 border-blue-200";
  if (value === "PENDING") return "bg-amber-50 text-amber-700 border-amber-200";
  if (value === "CANCELLED" || value === "FAILED") return "bg-red-50 text-red-700 border-red-200";
  return "bg-[#F5E9D8] text-[#8A5F23] border-[#D8B879]";
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
      <SitePage eyebrow="Orders" title="Login Required" description="Please login from the header account icon to view your orders.">
        <section className="px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-10 text-center shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
            <UserIcon className="mx-auto h-10 w-10 text-[#0A3A38]" />
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">Back to Home</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage eyebrow="Account" title="My Orders" description="Track confirmed orders, payment status, and product details.">
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          {loading ? <p className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 font-black text-[#5A6362]">Loading orders...</p> : null}
          {!loading && visibleOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D8B879] bg-[#FFF9F1] p-8 text-center shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
              <Package className="mx-auto h-10 w-10 text-[#B68A45]" />
              <p className="mt-4 font-black text-[#1D2D2E]">No confirmed orders found yet.</p>
              <p className="mt-1 text-sm font-semibold text-[#5A6362]">After payment confirmation, your orders will appear here.</p>
              <Link href="/products" className="mt-5 inline-flex rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">View Products</Link>
            </div>
          ) : null}

          <div className="grid gap-4">
            {visibleOrders.map((order) => {
              const firstItem = order.items[0];
              return (
                <Link key={order.id} href={`/profile/orders/${order.id}`} className="group grid gap-4 rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-4 shadow-[0_10px_30px_rgba(84,61,35,0.06)] transition hover:-translate-y-0.5 hover:border-[#C59A55] sm:grid-cols-[96px_1fr_auto]">
                  <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-white">
                    <Image src={orderImageUrl(firstItem?.imageUrl)} alt={firstItem?.productName || order.orderNumber} fill className="object-contain p-2" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-[#1D2D2E]">{order.orderNumber}</p>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass(order.paymentStatus)}`}>{order.paymentStatus}</span>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                    </div>
                    <p className="mt-2 line-clamp-1 font-black text-[#243A3B]">{firstItem?.productName || "Order items"}</p>
                    <p className="mt-1 text-sm font-semibold text-[#5A6362]">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"} - {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-3 sm:items-end">
                    <span className="font-black text-[#0A3A38]">{formatPrice(order.totalAmount)}</span>
                    <span className="inline-flex h-10 items-center justify-center rounded-full bg-[#0A3A38] px-4 text-sm font-black text-white transition group-hover:bg-[#B68A45]">
                      Order Details
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </SitePage>
  );
}
