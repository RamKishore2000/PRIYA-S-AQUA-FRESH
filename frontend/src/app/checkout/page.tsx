"use client";

import Script from "next/script";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { Button, LinkButton } from "@/components/ui/button";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { getProductById } from "@/services/catalog-service";
import { createAddress, fetchAddresses, type Address, type AddressPayload } from "@/services/address-service";
import { getStoredUser } from "@/services/auth-service";
import { createOrder, createRazorpayOrder, validateCoupon, verifyRazorpayPayment, type CouponValidation } from "@/services/order-service";
import type { Product } from "@/types/product";

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
  const searchParams = useSearchParams();
  const buyNowId = searchParams.get("buyNow");
  const requestedBuyNowQuantity = Number(searchParams.get("qty") || 1);
  const buyNowQuantity = Number.isFinite(requestedBuyNowQuantity) ? Math.max(1, Math.min(Math.floor(requestedBuyNowQuantity), 99)) : 1;
  const isBuyNow = Boolean(buyNowId);
  const { cartItems, subtotal, clearCartState } = useShop();
  const role = getStoredUser()?.role || null;
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);
  const [buyNowLoading, setBuyNowLoading] = useState(Boolean(buyNowId));
  const [saving, setSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressSelectorOpen, setAddressSelectorOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [form, setForm] = useState<AddressPayload>(emptyAddressForm);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!addressSelectorOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [addressSelectorOpen]);

  useEffect(() => {
    let mounted = true;
    fetchAddresses()
      .then((items) => {
        if (!mounted) return;
        setAddresses(items);
        setSelectedAddressId(items.find((address) => address.isDefault)?.id ?? items[0]?.id ?? null);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to load addresses.");
      })
      .finally(() => {
        if (mounted) setAddressLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!buyNowId) {
      return;
    }

    let mounted = true;
    void (async () => {
      setBuyNowLoading(true);
      try {
        const product = await getProductById(buyNowId);
        if (mounted) setBuyNowProduct(product);
      } catch (error) {
        if (mounted) {
          setBuyNowProduct(null);
          toast.error(error instanceof Error ? error.message : "Unable to load Buy Now product.");
        }
      } finally {
        if (mounted) setBuyNowLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [buyNowId]);

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
    if (checkoutItems.length === 0) {
      toast.error(isBuyNow ? "Buy Now product is not available." : "Your cart is empty.");
      return;
    }
    if (!window.Razorpay) {
      toast.error("Payment script is still loading. Try again.");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Select delivery address");
      return;
    }

    setSaving(true);
    try {
      const selectedAddress = addresses.find((address) => address.id === selectedAddressId);
      const order = await createOrder(
        isBuyNow && buyNowId
          ? { addressId: selectedAddressId, paymentMethod, buyNow: { productId: buyNowId, quantity: buyNowQuantity } }
          : { addressId: selectedAddressId, paymentMethod },
        appliedCoupon?.coupon.code,
      );
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
            checkoutMode: isBuyNow ? "BUY_NOW" : "CART",
          });
          if (!isBuyNow) {
            clearCartState();
          }
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
      const validation = await validateCoupon(couponCode, checkoutSubtotal);
      setAppliedCoupon(validation);
      toast.success("Coupon applied.");
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error instanceof Error ? error.message : "Unable to apply coupon.");
    }
  }

  const checkoutItems = isBuyNow && buyNowProduct
    ? [{ product: buyNowProduct, quantity: buyNowQuantity }]
    : cartItems;
  const checkoutSubtotal = isBuyNow
    ? checkoutItems.reduce((sum, item) => sum + getProductDisplayPrice(item.product, role).price * item.quantity, 0)
    : subtotal;
  const payableTotal = Math.max(0, checkoutSubtotal - (appliedCoupon?.discountAmount ?? 0));
  const advanceAmount = paymentMethod === "COD" ? Math.min(500, payableTotal) : payableTotal;
  const balanceAmount = Math.max(payableTotal - advanceAmount, 0);
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;

  return (
    <SitePage>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <PageHeader title="Checkout" description="Enter delivery details and complete your payment securely." />
      <form onSubmit={submitOrder} className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Delivery Address</h2>
              <p className="mt-1 text-sm text-slate-300">Current selected address for this order.</p>
            </div>
          </div>

          <div className="mt-5">
            {addressLoading ? (
              <p className="rounded-md border border-dashed border-white/15 p-4 text-sm text-slate-300">Loading saved addresses...</p>
            ) : !selectedAddress ? (
              <p className="rounded-md border border-dashed border-white/15 p-4 text-sm text-slate-300">No saved address found. Add one address to continue checkout.</p>
            ) : (
              <button
                type="button"
                onClick={() => setAddressSelectorOpen(true)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-[#12a8e6] bg-[#12a8e6]/10 p-4 text-left transition hover:bg-[#12a8e6]/15"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white">{selectedAddress.fullName}</span>
                    <span className="text-sm font-semibold text-slate-300">{selectedAddress.mobile}</span>
                    {selectedAddress.isDefault ? <span className="rounded bg-teal-600 px-2 py-0.5 text-xs font-bold text-white">Default</span> : null}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-slate-300">
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    {selectedAddress.landmark ? `, Landmark: ${selectedAddress.landmark}` : ""}
                  </span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/10 bg-[#0d1114] text-white">
                  <ChevronDown className="h-5 w-5" />
                </span>
              </button>
            )}
          </div>

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
              <Button type="button" variant="secondary" onClick={() => setForm(emptyAddressForm)}>
                Clear
              </Button>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-white">{isBuyNow ? "Buy Now Summary" : "Order Summary"}</h2>
          <div className="mt-4 space-y-3">
            {buyNowLoading ? (
              <p className="text-sm text-slate-300">Loading product...</p>
            ) : checkoutItems.length === 0 ? (
              <p className="text-sm text-slate-300">{isBuyNow ? "Product is not available." : "Your cart is empty."}</p>
            ) : (
              checkoutItems.map((item) => (
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
              <span>{formatPrice(checkoutSubtotal)}</span>
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
            <div className="mt-5 grid gap-3 border-t border-white/10 pt-4">
              <p className="text-sm font-bold text-white">Payment Option</p>
              <button
                type="button"
                onClick={() => setPaymentMethod("ONLINE")}
                className={`rounded-md border p-3 text-left transition ${paymentMethod === "ONLINE" ? "border-[#12a8e6] bg-[#12a8e6]/10" : "border-white/10 bg-[#0d1114] hover:border-[#12a8e6]/40"}`}
              >
                <span className="flex items-start gap-3">
                  <span className={`mt-1 h-4 w-4 rounded-full border ${paymentMethod === "ONLINE" ? "border-[#12a8e6] bg-[#12a8e6]" : "border-slate-500"}`} />
                  <span>
                    <span className="block font-bold text-white">Pay Online</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-300">Pay full amount now through Razorpay.</span>
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`rounded-md border p-3 text-left transition ${paymentMethod === "COD" ? "border-[#12a8e6] bg-[#12a8e6]/10" : "border-white/10 bg-[#0d1114] hover:border-[#12a8e6]/40"}`}
              >
                <span className="flex items-start gap-3">
                  <span className={`mt-1 h-4 w-4 rounded-full border ${paymentMethod === "COD" ? "border-[#12a8e6] bg-[#12a8e6]" : "border-slate-500"}`} />
                  <span>
                    <span className="block font-bold text-white">Cash on Delivery</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-300">Pay Rs. 500 advance now. Pay remaining amount on delivery.</span>
                  </span>
                </span>
              </button>
            </div>
            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(payableTotal)}</span>
            </div>
            {paymentMethod === "COD" ? (
              <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-300">
                <div className="flex justify-between text-[#12a8e6]"><span>Advance Payable Now</span><span>{formatPrice(advanceAmount)}</span></div>
                <div className="flex justify-between"><span>Balance on Delivery</span><span>{formatPrice(balanceAmount)}</span></div>
              </div>
            ) : null}
          </div>
          <Button type="submit" disabled={saving || buyNowLoading || checkoutItems.length === 0} className="mt-5 w-full">
            {saving ? "Processing..." : paymentMethod === "COD" ? `Pay ${formatPrice(advanceAmount)} Advance` : "Pay with Razorpay"}
          </Button>
          <LinkButton href={isBuyNow ? "/products" : "/cart"} variant="secondary" className="mt-3 w-full">
            {isBuyNow ? "Continue Shopping" : "Back to Cart"}
          </LinkButton>
        </aside>
      </form>
      {portalReady && addressSelectorOpen
        ? createPortal(
          <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-[#020617]/90 px-4 py-6 backdrop-blur-md">
            <button
              type="button"
              aria-label="Close address selector"
              className="absolute inset-0 cursor-default"
              onClick={() => setAddressSelectorOpen(false)}
            />
            <div className="relative flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#12a8e6]/25 bg-[#111418] text-white shadow-[0_30px_100px_rgba(0,0,0,0.60)]">
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#12a8e6]">Delivery Address</p>
                  <h3 className="mt-2 text-2xl font-bold">Select Address</h3>
                </div>
                <button type="button" onClick={() => setAddressSelectorOpen(false)} className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-[#0d1114] text-lg font-bold hover:bg-white/10">
                  x
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <div className="grid gap-3">
                  {addresses.length === 0 ? (
                    <p className="rounded-md border border-dashed border-white/15 p-4 text-sm text-slate-300">No saved address found. Add a new address from the checkout page.</p>
                  ) : null}
                  {addresses.map((address) => {
                    const active = selectedAddressId === address.id;
                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => {
                          setSelectedAddressId(address.id);
                          setAddressSelectorOpen(false);
                        }}
                        className={`block w-full rounded-lg border p-4 text-left transition ${active ? "border-[#12a8e6] bg-[#12a8e6]/10" : "border-white/10 bg-[#0d1114] hover:border-[#12a8e6]/40"}`}
                      >
                        <span className="flex items-start gap-3">
                          <span className={`mt-1 grid h-4 w-4 place-items-center rounded-full border ${active ? "border-[#12a8e6]" : "border-slate-500"}`}>
                            {active ? <span className="h-2 w-2 rounded-full bg-[#12a8e6]" /> : null}
                          </span>
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-white">{address.fullName}</span>
                              <span className="text-sm font-semibold text-slate-300">{address.mobile}</span>
                              {address.isDefault ? <span className="rounded bg-teal-600 px-2 py-0.5 text-xs font-bold text-white">Default</span> : null}
                            </span>
                            <span className="mt-2 block text-sm leading-6 text-slate-300">
                              {address.addressLine1}
                              {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city}, {address.state} - {address.pincode}
                              {address.landmark ? `, Landmark: ${address.landmark}` : ""}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex shrink-0 justify-end border-t border-white/10 p-5">
                <button type="button" onClick={() => setAddressSelectorOpen(false)} className="rounded-md bg-[#12a8e6] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0871cf]">
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
        : null}
    </SitePage>
  );
}
