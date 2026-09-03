"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Check, Package, Truck, UserIcon } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { getStoredUser } from "@/services/auth-service";
import { fetchMyOrder, orderImageUrl, type Order } from "@/services/order-service";
import { getProductDetailHref } from "@/lib/product-links";

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
  return "bg-[#EAF6FF] text-[#075985] border-[#28B463]";
}

function getProgressIndex(status: Order["orderStatus"]) {
  if (status === "CANCELLED" || status === "PENDING") return -1;
  return progressSteps.findIndex((step) => step.key === status);
}

export default function OrderDetailPage({ orderId }: { orderId?: string }) {
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const activeOrderId = orderId || searchParams.get("id") || params.id || "";
  const [user] = useState(() => getStoredUser());
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) return;
    if (!activeOrderId) {
      setLoading(false);
      setOrder(null);
      return;
    }
    setLoading(true);
    fetchMyOrder(activeOrderId).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [activeOrderId, user]);

  if (!user) {
    return (
      <SitePage eyebrow="Order" title="Login Required" description="Please login to view this order.">
        <section data-native-screen="order-detail" className="px-4 pb-28 md:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-6 text-center shadow-[0_10px_30px_rgba(0,87,200,0.07)] md:p-10">
            <UserIcon className="mx-auto h-10 w-10 text-[#0057C8]" />
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#0057C8] px-6 py-3 text-sm font-black text-white">Back to Home</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  if (loading) {
    return (
      <SitePage eyebrow="Order" title="Order details" description="Loading your order details.">
        <section data-native-screen="order-detail" className="px-4 pb-28 md:px-8">
          <p className="mx-auto max-w-5xl rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 font-black text-[#40576C] md:p-5">Loading order...</p>
        </section>
      </SitePage>
    );
  }

  if (!order) {
    return (
      <SitePage eyebrow="Order" title="Order not found" description="We could not find this order.">
        <section data-native-screen="order-detail" className="px-4 pb-28 md:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-6 text-center md:p-8">
            <Package className="mx-auto h-10 w-10 text-[#0057C8]" />
            <Link href="/profile/orders" className="mt-5 inline-flex rounded-full bg-[#0057C8] px-6 py-3 text-sm font-black text-white">Back to Orders</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  const progressIndex = getProgressIndex(order.orderStatus);
  const progressPercent = progressIndex < 0 ? 0 : (progressIndex / (progressSteps.length - 1)) * 75;

  return (
    <SitePage eyebrow="Order Details" title={order.orderNumber} description={`Placed on ${new Date(order.createdAt).toLocaleDateString("en-IN")}`}>
      <section data-native-screen="order-detail" className="px-4 pb-28 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_340px] lg:gap-6">
          <div className="space-y-4 lg:space-y-5">
            <section className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0057C8]">Order Progress</p>
                  <h2 className="mt-1 text-lg font-black text-[#102033] md:text-xl">{order.orderStatus === "CANCELLED" ? "Order Cancelled" : "Track your order"}</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>
              </div>

              <div className="mt-6 md:mt-8">
                <div className="relative">
                  <div className="absolute left-[12.5%] right-[12.5%] top-4 h-1 rounded-full bg-[#D8EAF8] md:top-5" />
                  <div className="order-progress-fill-once absolute left-[12.5%] top-4 h-1 rounded-full md:top-5" style={{ "--order-progress-width": `${progressPercent}%` } as CSSProperties} />
                  <div className="relative z-10 grid grid-cols-4 gap-1 md:gap-2">
                    {progressSteps.map((step, index) => {
                      const done = progressIndex >= index;
                      return (
                        <div key={step.key} className="grid justify-items-center gap-1.5 text-center md:gap-2">
                          <span
                            className={`grid h-9 w-9 place-items-center rounded-full border-2 text-xs font-black transition md:h-11 md:w-11 md:text-sm ${done ? "order-progress-step-done border-[#0057C8] text-white" : "border-[#D8EAF8] bg-[#FFFFFF] text-[#0057C8]"}`}
                            style={done ? { "--order-step-delay": `${320 + index * 260}ms` } as CSSProperties : undefined}
                          >
                            {done ? <Check className="h-4 w-4 md:h-5 md:w-5" /> : index + 1}
                          </span>
                          <span className={`text-[0.65rem] font-black leading-tight md:text-xs ${done ? "text-[#0057C8]" : "text-[#74879A]"}`}>{step.label}</span>
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
                <Link key={item.id} href={item.productSlug ? getProductDetailHref(item.productSlug) : "/products"} className="grid grid-cols-[5rem_1fr] gap-3 rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-3 shadow-[0_10px_30px_rgba(0,87,200,0.07)] sm:grid-cols-[112px_1fr_auto] sm:gap-4 sm:p-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-white sm:h-28 sm:w-28">
                    <Image src={orderImageUrl(item.imageUrl)} alt={item.productName} fill className="object-contain p-2" unoptimized />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#102033] sm:text-base">{item.productName}</p>
                    <p className="mt-1 text-xs font-semibold text-[#40576C] sm:text-sm">SKU: {item.productSku}</p>
                    {item.selectedColorName ? <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#EAF6FF] px-2.5 py-1 text-xs font-black text-[#0057C8]">{item.selectedColorCode ? <span className="h-3 w-3 rounded-full border border-[#D8EAF8]" style={{ backgroundColor: item.selectedColorCode }} /> : null}Colour: {item.selectedColorName}</p> : null}
                    <p className="mt-2 text-xs font-black text-[#0057C8] sm:text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="col-span-2 text-right text-sm font-black text-[#102033] sm:col-span-1 sm:text-base sm:text-right">
                    <p>{formatPrice(item.lineTotal)}</p>
                    <p className="mt-1 text-xs font-semibold text-[#74879A]">{formatPrice(item.unitPrice)} each</p>
                  </div>
                </Link>
              ))}
            </section>
          </div>

          <aside className="h-fit space-y-4">
            <section className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:p-5">
              <h2 className="text-sm font-black text-[#102033] sm:text-base">Status</h2>
              <div className="mt-4 grid gap-3 text-sm">
                <Info label="Payment" value={order.paymentStatus} />
                <Info label="Order" value={order.orderStatus} />
              </div>
            </section>
            <section className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:p-5">
              <h2 className="flex items-center gap-2 font-black text-[#102033]"><Truck className="h-4 w-4 text-[#0057C8]" /> Delivery Address</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#40576C]">
                {order.shippingAddress?.fullName || "-"}<br />
                {order.shippingAddress?.mobile || "-"}<br />
                {order.shippingAddress?.addressLine1 || ""}
                {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </section>
            <section className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-4 shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:p-5">
              <h2 className="text-sm font-black text-[#102033] sm:text-base">Price Details</h2>
              <div className="mt-4 space-y-3 text-sm font-semibold">
                <Row label="Subtotal" value={formatPrice(order.subtotalAmount)} />
                <Row label="Discount" value={`-${formatPrice(order.discountAmount)}`} />
                <Row label="Shipping" value={formatPrice(order.shippingAmount)} />
                <div className="border-t border-[#D8EAF8] pt-3">
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
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#D8EAF8] bg-white px-3 py-2">
      <span className="text-[#40576C]">{label}</span>
      <span className="text-sm font-black text-[#102033] sm:text-base">{value}</span>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${strong ? "text-base font-black text-[#102033]" : "text-[#40576C]"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}


