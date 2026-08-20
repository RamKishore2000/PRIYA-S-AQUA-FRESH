"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "next/navigation";
import { Check, Package, User } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { LinkButton } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getStoredUser } from "@/services/auth-service";
import { fetchMyOrder, orderImageUrl, type Order } from "@/services/order-service";

const progressSteps = [
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PACKED", label: "Packed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
] as const;

function statusClass(value: string) {
  if (value === "PAID" || value === "CONFIRMED" || value === "DELIVERED") return "bg-emerald-50 text-emerald-700";
  if (value === "PENDING") return "bg-amber-50 text-amber-700";
  if (value === "CANCELLED" || value === "FAILED") return "bg-red-50 text-red-700";
  return "bg-[#12a8e6]/15 text-[#12a8e6]";
}

function getProgressIndex(status: Order["orderStatus"]) {
  if (status === "CANCELLED" || status === "PENDING") return -1;
  return progressSteps.findIndex((step) => step.key === status);
}

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const [user] = useState(() => getStoredUser());
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user || !params.id) return;
    fetchMyOrder(params.id).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [params.id, user]);

  if (!user) {
    return (
      <SitePage>
        <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <User className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">Login Required</h1>
          <p className="mt-3 text-slate-600">Please login to view this order.</p>
          <LinkButton href="/" className="mt-6">Back to Home</LinkButton>
        </section>
      </SitePage>
    );
  }

  if (loading) {
    return <SitePage><section className="mx-auto max-w-5xl px-4 py-16 md:px-8">Loading order...</section></SitePage>;
  }

  if (!order) {
    return (
      <SitePage>
        <section className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8">
          <Package className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-4 font-bold text-white">Order not found.</p>
          <LinkButton href="/profile/orders" className="mt-5">Back to Orders</LinkButton>
        </section>
      </SitePage>
    );
  }

  const progressIndex = getProgressIndex(order.orderStatus);
  const progressPercent = progressIndex < 0 ? 0 : (progressIndex / (progressSteps.length - 1)) * 75;

  return (
    <SitePage>
      <PageHeader eyebrow="Order Details" title={order.orderNumber} description={`Placed on ${new Date(order.createdAt).toLocaleDateString("en-IN")}`} />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:px-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <section className="rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#12a8e6]">Order Progress</p>
                <h2 className="mt-1 text-xl font-bold text-white">{order.orderStatus === "CANCELLED" ? "Order Cancelled" : "Track your order"}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1 rounded-full bg-white/12" />
                <div
                  className="order-progress-fill-once absolute left-[12.5%] top-5 h-1 rounded-full bg-gradient-to-r from-[#12a8e6] to-[#00BFA6]"
                  style={{ "--order-progress-width": `${progressPercent}%` } as CSSProperties}
                />
                <div className="relative z-10 grid grid-cols-4 gap-2">
                  {progressSteps.map((step, index) => {
                    const done = progressIndex >= index;
                    return (
                      <div key={step.key} className="grid justify-items-center gap-2 text-center">
                        <span
                          className={`grid h-11 w-11 place-items-center rounded-full border-2 text-sm font-black transition ${
                            done
                              ? "order-progress-step-done border-[#0A4A45] text-white"
                              : "border-white/15 bg-[#111418] text-slate-400"
                          }`}
                          style={done ? { "--order-step-delay": `${320 + index * 260}ms` } as CSSProperties : undefined}
                        >
                          {done ? <Check className="h-5 w-5" /> : index + 1}
                        </span>
                        <span className={`text-xs font-bold ${done ? "text-[#12a8e6]" : "text-slate-400"}`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {order.orderStatus === "CANCELLED" ? <p className="mt-5 rounded-md bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300">This order has been cancelled.</p> : null}
            </div>
          </section>

          {order.items.map((item) => (
            <Link key={item.id} href={item.productSlug ? `/products/${item.productSlug}` : "/products"} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[112px_1fr_auto]">
              <div className="relative h-28 w-28 overflow-hidden rounded-md bg-slate-50">
                <Image src={orderImageUrl(item.imageUrl)} alt={item.productName} fill className="object-contain p-2" unoptimized />
              </div>
              <div>
                <p className="font-bold text-slate-950">{item.productName}</p>
                <p className="mt-1 text-sm text-slate-500">SKU: {item.productSku}</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">Qty: {item.quantity}</p>
              </div>
              <div className="font-bold text-slate-950 sm:text-right">
                <p>{formatPrice(item.lineTotal)}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{formatPrice(item.unitPrice)} each</p>
              </div>
            </Link>
          ))}
        </div>

        <aside className="h-fit space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-950">Status</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <Info label="Payment" value={order.paymentStatus} />
              <Info label="Order" value={order.orderStatus} />
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-950">Delivery Address</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.mobile}<br />
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-950">Price Details</h2>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotalAmount)} />
              <Row label="Discount" value={`-${formatPrice(order.discountAmount)}`} />
              <Row label="Shipping" value={formatPrice(order.shippingAmount)} />
              <div className="border-t border-slate-200 pt-3">
                <Row label="Total" value={formatPrice(order.totalAmount)} strong />
              </div>
            </div>
          </section>
        </aside>
      </section>
    </SitePage>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><span className="text-slate-500">{label}</span><span className="font-bold text-slate-900">{value}</span></div>;
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex justify-between ${strong ? "text-base font-bold text-slate-950" : "text-slate-600"}`}><span>{label}</span><span>{value}</span></div>;
}
