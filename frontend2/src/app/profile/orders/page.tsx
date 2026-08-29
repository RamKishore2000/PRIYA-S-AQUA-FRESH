"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Package, UserIcon } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { OrderListSkeleton } from "@/components/ui/skeletons";
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
        <section data-native-screen="orders" className="px-4 pb-28 md:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-6 text-center shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-10">
            <UserIcon className="mx-auto h-10 w-10 text-[#0A3A38]" />
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">Back to Home</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage eyebrow="Account" title="My Orders" description="Track confirmed orders, payment status, and product details.">
      <section data-native-screen="orders" className="px-4 pb-28 md:px-8">
        <div className="mx-auto max-w-6xl">
          {loading ? <OrderListSkeleton /> : null}
          {!loading && visibleOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D8B879] bg-[#FFF9F1] p-6 text-center shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-8">
              <Package className="mx-auto h-10 w-10 text-[#B68A45]" />
              <p className="mt-4 font-black text-[#1D2D2E]">No confirmed orders found yet.</p>
              <p className="mt-1 text-xs font-semibold text-[#5A6362] sm:text-sm">After payment confirmation, your orders will appear here.</p>
              <Link href="/products" className="mt-5 inline-flex rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">View Products</Link>
            </div>
          ) : null}

          <div className="grid gap-4">
            {visibleOrders.map((order) => {
              const firstItem = order.items[0];
              return (
                <Link key={order.id} href={`/profile/orders/detail?id=${order.id}`} className="group grid grid-cols-[4.75rem_1fr] gap-3 rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-3 shadow-[0_10px_30px_rgba(84,61,35,0.06)] transition hover:-translate-y-0.5 hover:border-[#C59A55] sm:grid-cols-[96px_1fr_auto] sm:gap-4 sm:p-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-white sm:h-24 sm:w-24">
                    <Image src={orderImageUrl(firstItem?.imageUrl)} alt={firstItem?.productName || order.orderNumber} fill className="object-contain p-2" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <p className="font-black text-[#1D2D2E]">{order.orderNumber}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[0.68rem] font-black sm:px-2.5 sm:py-1 sm:text-xs ${statusClass(order.paymentStatus)}`}>{order.paymentStatus}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[0.68rem] font-black sm:px-2.5 sm:py-1 sm:text-xs ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-black text-[#243A3B] sm:line-clamp-1 sm:text-base">{firstItem?.productName || "Order items"}</p>
                    <p className="mt-1 text-xs font-semibold text-[#5A6362] sm:text-sm">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"} - {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="col-span-2 flex flex-row items-center justify-between gap-3 border-t border-[#E5D8C7] pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
                    <span className="font-black text-[#0A3A38]">{formatPrice(order.totalAmount)}</span>
                    <span className="inline-flex h-9 items-center justify-center rounded-full bg-[#0A3A38] px-4 text-xs font-black text-white transition group-hover:bg-[#B68A45] sm:h-10 sm:text-sm">
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

