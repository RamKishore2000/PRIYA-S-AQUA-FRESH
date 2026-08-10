"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { LinkButton } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { getStoredUser } from "@/services/auth-service";
import { fetchMyOrder, orderImageUrl, type Order } from "@/services/order-service";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [user] = useState(() => getStoredUser());
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) return;
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
    return <SitePage><section className="mx-auto max-w-5xl px-4 py-16 md:px-8">Order not found.</section></SitePage>;
  }

  return (
    <SitePage>
      <PageHeader eyebrow="Order Details" title={order.orderNumber} description={`Placed on ${new Date(order.createdAt).toLocaleDateString("en-IN")}`} />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:px-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
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
