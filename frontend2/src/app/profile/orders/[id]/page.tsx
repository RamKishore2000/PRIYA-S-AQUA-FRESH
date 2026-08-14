"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useParams } from "next/navigation";
import { Check, Package, Truck, UserIcon } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { getStoredUser } from "@/services/auth-service";
import { fetchMyOrder, orderImageUrl, type Order } from "@/services/order-service";

const progressSteps = [
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PACKED", label: "Packed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
] as const;

function formatPrice(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function statusClass(value: string) {
  if (value === "PAID" || value === "CONFIRMED" || value === "DELIVERED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (value === "PENDING") return "bg-amber-50 text-amber-700 border-amber-200";
  if (value === "CANCELLED" || value === "FAILED") return "bg-red-50 text-red-700 border-red-200";
  return "bg-[#F5E9D8] text-[#8A5F23] border-[#D8B879]";
}

function getProgressIndex(status: Order["orderStatus"]) {
  if (status === "CANCELLED" || status === "PENDING") return -1;
  return progressSteps.findIndex((step) => step.key === status);
}

export default function OrderDetailPage() {
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
      <SitePage eyebrow="Order" title="Login Required" description="Please login to view this order.">
        <section className="px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-10 text-center shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
            <UserIcon className="mx-auto h-10 w-10 text-[#0A3A38]" />
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">Back to Home</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  if (loading) {
    return (
      <SitePage eyebrow="Order" title="Order details" description="Loading your order details.">
        <section className="px-5 pb-20 md:px-8">
          <p className="mx-auto max-w-5xl rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 font-black text-[#5A6362]">Loading order...</p>
        </section>
      </SitePage>
    );
  }

  if (!order) {
    return (
      <SitePage eyebrow="Order" title="Order not found" description="We could not find this order.">
        <section className="px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-[#B68A45]" />
            <Link href="/profile/orders" className="mt-5 inline-flex rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">Back to Orders</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  const progressIndex = getProgressIndex(order.orderStatus);
  const progressPercent = progressIndex < 0 ? 0 : (progressIndex / (progressSteps.length - 1)) * 75;

  return (
    <SitePage eyebrow="Order Details" title={order.orderNumber} description={`Placed on ${new Date(order.createdAt).toLocaleDateString("en-IN")}`}>
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B68A45]">Order Progress</p>
                  <h2 className="mt-1 text-xl font-black text-[#1D2D2E]">{order.orderStatus === "CANCELLED" ? "Order Cancelled" : "Track your order"}</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1 rounded-full bg-[#E5D8C7]" />
                  <div className="order-progress-fill-once absolute left-[12.5%] top-5 h-1 rounded-full" style={{ "--order-progress-width": `${progressPercent}%` } as CSSProperties} />
                  <div className="relative z-10 grid grid-cols-4 gap-2">
                    {progressSteps.map((step, index) => {
                      const done = progressIndex >= index;
                      return (
                        <div key={step.key} className="grid justify-items-center gap-2 text-center">
                          <span
                            className={`grid h-11 w-11 place-items-center rounded-full border-2 text-sm font-black transition ${done ? "order-progress-step-done border-[#0A3A38] text-white" : "border-[#E5D8C7] bg-[#FFF9F1] text-[#B68A45]"}`}
                            style={done ? { "--order-step-delay": `${320 + index * 260}ms` } as CSSProperties : undefined}
                          >
                            {done ? <Check className="h-5 w-5" /> : index + 1}
                          </span>
                          <span className={`text-xs font-black ${done ? "text-[#0A3A38]" : "text-[#7D7B75]"}`}>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {order.orderStatus === "CANCELLED" ? <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">This order has been cancelled.</p> : null}
              </div>
            </section>

            <section className="grid gap-4">
              {order.items.map((item) => (
                <Link key={item.id} href={item.productSlug ? `/products/${item.productSlug}` : "/products"} className="grid gap-4 rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-4 shadow-[0_10px_30px_rgba(84,61,35,0.06)] sm:grid-cols-[112px_1fr_auto]">
                  <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-white">
                    <Image src={orderImageUrl(item.imageUrl)} alt={item.productName} fill className="object-contain p-2" unoptimized />
                  </div>
                  <div>
                    <p className="font-black text-[#1D2D2E]">{item.productName}</p>
                    <p className="mt-1 text-sm font-semibold text-[#5A6362]">SKU: {item.productSku}</p>
                    <p className="mt-2 text-sm font-black text-[#0A3A38]">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-black text-[#1D2D2E] sm:text-right">
                    <p>{formatPrice(item.lineTotal)}</p>
                    <p className="mt-1 text-xs font-semibold text-[#7D7B75]">{formatPrice(item.unitPrice)} each</p>
                  </div>
                </Link>
              ))}
            </section>
          </div>

          <aside className="h-fit space-y-4">
            <section className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
              <h2 className="font-black text-[#1D2D2E]">Status</h2>
              <div className="mt-4 grid gap-3 text-sm">
                <Info label="Payment" value={order.paymentStatus} />
                <Info label="Order" value={order.orderStatus} />
              </div>
            </section>
            <section className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
              <h2 className="flex items-center gap-2 font-black text-[#1D2D2E]"><Truck className="h-4 w-4 text-[#B68A45]" /> Delivery Address</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#5A6362]">
                {order.shippingAddress?.fullName || "-"}<br />
                {order.shippingAddress?.mobile || "-"}<br />
                {order.shippingAddress?.addressLine1 || ""}
                {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </section>
            <section className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
              <h2 className="font-black text-[#1D2D2E]">Price Details</h2>
              <div className="mt-4 space-y-3 text-sm font-semibold">
                <Row label="Subtotal" value={formatPrice(order.subtotalAmount)} />
                <Row label="Discount" value={`-${formatPrice(order.discountAmount)}`} />
                <Row label="Shipping" value={formatPrice(order.shippingAmount)} />
                <div className="border-t border-[#E5D8C7] pt-3">
                  <Row label="Total" value={formatPrice(order.totalAmount)} strong />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </SitePage>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E5D8C7] bg-white px-3 py-2">
      <span className="text-[#5A6362]">{label}</span>
      <span className="font-black text-[#1D2D2E]">{value}</span>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "text-base font-black text-[#1D2D2E]" : "text-[#5A6362]"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
