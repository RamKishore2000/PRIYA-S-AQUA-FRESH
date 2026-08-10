"use client";

import Script from "next/script";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { Button, LinkButton } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { createAddress, fetchAddresses, type Address, type AddressPayload } from "@/services/address-service";
import { getStoredUser } from "@/services/auth-service";
import { createOrder, createRazorpayOrder, validateCoupon, verifyRazorpayPayment, type CouponValidation } from "@/services/order-service";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const inputClass = "h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
const emptyAddressForm: AddressPayload = {
  fullName: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  isDefault: false,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCartState } = useShop();
  const role = getStoredUser()?.role || null;
  const [saving, setSaving] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [form, setForm] = useState<AddressPayload>(emptyAddressForm);

  useEffect(() => {
    let mounted = true;
    fetchAddresses()
      .then((items) => {
        if (!mounted) return;
        setAddresses(items);
        setSelectedAddressId(items.find((address) => address.isDefault)?.id ?? items[0]?.id ?? null);
        setAddressFormOpen(items.length === 0);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to load addresses.");
        setAddressFormOpen(true);
      })
      .finally(() => {
        if (mounted) setAddressLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function updateField<K extends keyof AddressPayload>(field: K, value: AddressPayload[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveAddress() {
    setAddressSaving(true);
    try {
      const address = await createAddress(form);
      const existingAddresses = addresses
        .filter((item) => item.id !== address.id)
        .map((item) => (address.isDefault ? { ...item, isDefault: false } : item));
      const nextAddresses = [address, ...existingAddresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
      setAddresses(nextAddresses);
      setSelectedAddressId(address.id);
      setAddressFormOpen(false);
      setForm(emptyAddressForm);
      toast.success("Address saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save address.");
    } finally {
      setAddressSaving(false);
    }
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!window.Razorpay) {
      toast.error("Payment script is still loading. Try again.");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Select delivery address");
      setAddressFormOpen(true);
      return;
    }

    setSaving(true);
    try {
      const selectedAddress = addresses.find((address) => address.id === selectedAddressId);
      const order = await createOrder({ addressId: selectedAddressId }, appliedCoupon?.coupon.code);
      const payment = await createRazorpayOrder(order.id);
      const razorpay = new window.Razorpay({
        key: payment.keyId,
        amount: payment.razorpayOrder.amount,
        currency: payment.razorpayOrder.currency,
        name: "Priya's Aqua Fresh",
        description: order.orderNumber,
        order_id: payment.razorpayOrder.id,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await verifyRazorpayPayment({
            orderId: order.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          clearCartState();
          toast.success("Payment successful. Order confirmed.");
          router.push("/profile/orders");
        },
        prefill: {
          name: selectedAddress?.fullName || "",
          contact: selectedAddress?.mobile || "",
        },
        theme: { color: "#0d9488" },
      });
      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setSaving(false);
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code.");
      return;
    }
    try {
      const validation = await validateCoupon(couponCode, subtotal);
      setAppliedCoupon(validation);
      toast.success("Coupon applied.");
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error instanceof Error ? error.message : "Unable to apply coupon.");
    }
  }

  const payableTotal = Math.max(0, subtotal - (appliedCoupon?.discountAmount ?? 0));

  return (
    <SitePage>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <PageHeader title="Checkout" description="Enter delivery details and complete your payment securely." />
      <form onSubmit={submitOrder} className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Delivery Address</h2>
              <p className="mt-1 text-sm text-slate-300">Select a saved address or add a new delivery address.</p>
            </div>
            <Button type="button" variant="secondary" onClick={() => setAddressFormOpen((open) => !open)}>
              {addressFormOpen ? "Close Form" : "Add Address"}
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {addressLoading ? (
              <p className="rounded-md border border-dashed border-white/15 p-4 text-sm text-slate-300">Loading saved addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="rounded-md border border-dashed border-white/15 p-4 text-sm text-slate-300">No saved address found. Add one address to continue checkout.</p>
            ) : (
              addresses.map((address) => {
                const active = selectedAddressId === address.id;
                return (
                  <label
                    key={address.id}
                    className={`block cursor-pointer rounded-lg border p-4 transition ${
                      active ? "border-[#12a8e6] bg-[#12a8e6]/10 shadow-sm" : "border-white/10 bg-[#0d1114] hover:border-[#12a8e6]/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryAddress"
                        className="mt-1 h-4 w-4 accent-teal-600"
                        checked={active}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white">{address.fullName}</span>
                          <span className="text-sm font-semibold text-slate-300">{address.mobile}</span>
                          {address.isDefault ? <span className="rounded bg-teal-600 px-2 py-0.5 text-xs font-bold text-white">Default</span> : null}
                          {active ? <span className="rounded bg-slate-950 px-2 py-0.5 text-xs font-bold text-white">Selected</span> : null}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {address.addressLine1}
                          {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city}, {address.state} - {address.pincode}
                          {address.landmark ? `, Landmark: ${address.landmark}` : ""}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          {addressFormOpen ? (
            <div className="mt-6 rounded-lg border border-white/10 bg-[#0d1114] p-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-200">Add New Address</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input className={inputClass} placeholder="Full name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
                <input className={inputClass} placeholder="Mobile number" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} />
                <input className={`${inputClass} md:col-span-2`} placeholder="Address line 1" value={form.addressLine1} onChange={(event) => updateField("addressLine1", event.target.value)} />
                <input className={`${inputClass} md:col-span-2`} placeholder="Address line 2 optional" value={form.addressLine2} onChange={(event) => updateField("addressLine2", event.target.value)} />
                <input className={inputClass} placeholder="City" value={form.city} onChange={(event) => updateField("city", event.target.value)} />
                <input className={inputClass} placeholder="State" value={form.state} onChange={(event) => updateField("state", event.target.value)} />
                <input className={inputClass} placeholder="Pincode" value={form.pincode} onChange={(event) => updateField("pincode", event.target.value)} />
                <input className={inputClass} placeholder="Landmark optional" value={form.landmark} onChange={(event) => updateField("landmark", event.target.value)} />
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
                <input type="checkbox" className="h-4 w-4 accent-teal-600" checked={form.isDefault} onChange={(event) => updateField("isDefault", event.target.checked)} />
                Set as default address
              </label>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button type="button" disabled={addressSaving} onClick={saveAddress}>
                  {addressSaving ? "Saving..." : "Save Address"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setAddressFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="h-fit rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-white">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {cartItems.length === 0 ? (
              <p className="text-sm text-slate-300">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.id} className="grid grid-cols-[56px_1fr_auto] gap-3 rounded-md border border-white/10 p-2 text-sm">
                  <div className="relative h-14 w-14 overflow-hidden rounded bg-white">
                    <Image src={item.product.image} alt={item.product.name} fill sizes="56px" className="object-contain p-1.5" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-semibold leading-5 text-white">{item.product.name}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-300">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-white">{formatPrice(getProductDisplayPrice(item.product, role).price * item.quantity)}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                className="h-10 min-w-0 flex-1 rounded-md border border-slate-200 px-3 text-sm uppercase outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              />
              <Button type="button" variant="secondary" onClick={applyCoupon}>Apply</Button>
            </div>
            {appliedCoupon ? (
              <div className="mt-3 flex justify-between text-sm font-semibold text-teal-700">
                <span>Discount ({appliedCoupon.coupon.code})</span>
                <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
              </div>
            ) : null}
            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(payableTotal)}</span>
            </div>
          </div>
          <Button type="submit" disabled={saving || cartItems.length === 0} className="mt-5 w-full">
            {saving ? "Processing..." : "Pay with Razorpay"}
          </Button>
          <LinkButton href="/cart" variant="secondary" className="mt-3 w-full">Back to Cart</LinkButton>
        </aside>
      </form>
    </SitePage>
  );
}
