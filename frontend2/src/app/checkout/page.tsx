"use client";

import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ShareDetailsModal } from "@/components/common/share-details-modal";
import { SitePage } from "@/components/layout/site-page";
import { ChevronDownIcon } from "@/components/ui/icons";
import { useShop } from "@/context/shop-context";
import { getProductDisplayPrice } from "@/lib/pricing";
import { getProductById } from "@/services/catalog-service";
import { createAddress, createOrder, createRazorpayOrder, fetchAddresses, markOrderPaymentFailed, validateCoupon, verifyRazorpayPayment, type Address } from "@/services/order-service";
import { defaultSiteSettings, fetchSiteSettings } from "@/services/settings-service";
import type { Product } from "@/types/product";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type AddressForm = Omit<Address, "id">;

type CheckoutShareState = {
  orderNumber: string;
  customerName: string;
  mobile: string;
  products: string;
  totalAmount: number;
  paymentType: string;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: string;
  address: string;
};

const emptyAddress: AddressForm = {
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

const inputClass = "h-11 rounded-xl border border-[#E5D8C7] bg-white px-4 font-semibold text-[#1D2D2E] outline-none placeholder:text-[#7D7B75] focus:border-[#0A3A38]";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowId = searchParams.get("buyNow");
  const requestedBuyNowQuantity = Number(searchParams.get("qty") || 1);
  const buyNowQuantity = Number.isFinite(requestedBuyNowQuantity) ? Math.max(1, Math.min(Math.floor(requestedBuyNowQuantity), 99)) : 1;
  const isBuyNow = Boolean(buyNowId);
  const { user, cartItems, subtotal, refreshCart, clearCartState, openLogin } = useShop();
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null);
  const [buyNowLoading, setBuyNowLoading] = useState(Boolean(buyNowId));
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressSelectorOpen, setAddressSelectorOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressSaving, setAddressSaving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [orderShare, setOrderShare] = useState<CheckoutShareState | null>(null);
  const [orderAdvanceAmount, setOrderAdvanceAmount] = useState(defaultSiteSettings.orderAdvanceAmount);

  useEffect(() => {
    let mounted = true;
    fetchSiteSettings()
      .then((settings) => {
        if (mounted) setOrderAdvanceAmount(Math.max(1, Number(settings.orderAdvanceAmount || defaultSiteSettings.orderAdvanceAmount)));
      })
      .catch(() => {
        if (mounted) setOrderAdvanceAmount(defaultSiteSettings.orderAdvanceAmount);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!buyNowId) {
      void refreshCart();
    }

    let mounted = true;
    fetchAddresses()
      .then((items) => {
        if (!mounted) return;
        setAddresses(items);
        setSelectedAddressId(items.find((address) => address.isDefault)?.id ?? items[0]?.id ?? null);
      })
      .catch((error) => {
        if (!mounted) return;
        setMessage(error instanceof Error ? error.message : "Unable to load addresses.");
      })
      .finally(() => {
        if (mounted) setAddressLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [buyNowId, refreshCart, user]);

  useEffect(() => {
    if (!user || !buyNowId) {
      return;
    }

    let mounted = true;
    void (async () => {
      setBuyNowLoading(true);
      try {
        const product = await getProductById(buyNowId);
        if (mounted) {
          setBuyNowProduct(product);
          setMessage("");
        }
      } catch (error) {
        if (mounted) {
          setBuyNowProduct(null);
          setMessage(error instanceof Error ? error.message : "Unable to load Buy Now product.");
        }
      } finally {
        if (mounted) setBuyNowLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [buyNowId, user]);

  function updateAddress<K extends keyof AddressForm>(field: K, value: AddressForm[K]) {
    setAddressForm((current) => ({ ...current, [field]: value }));
  }

  async function saveAddress() {
    setAddressSaving(true);
    setMessage("");
    try {
      const address = await createAddress(addressForm);
      const nextAddresses = [
        address,
        ...addresses.filter((item) => item.id !== address.id).map((item) => (address.isDefault ? { ...item, isDefault: false } : item)),
      ].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
      setAddresses(nextAddresses);
      setSelectedAddressId(address.id);
      setAddressForm(emptyAddress);
      setAddressSelectorOpen(false);
      setMessage("Address saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save address.");
    } finally {
      setAddressSaving(false);
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) {
      setCouponMessage("Enter coupon code.");
      return;
    }
    try {
      const validation = await validateCoupon(couponCode, checkoutSubtotal, checkoutItems.map((item) => ({ productId: item.product.id, lineTotal: getProductDisplayPrice(item.product, user?.role).price * item.quantity })));
      setDiscount(validation.discountAmount);
      setCouponMessage("Coupon applied.");
      setMessage("");
    } catch (error) {
      setDiscount(0);
      setCouponMessage(error instanceof Error ? error.message : "Unable to apply coupon.");
    }
  }

  async function placeOrder() {
    if (!user) {
      openLogin();
      return;
    }
    if (!checkoutItems.length) {
      setMessage(isBuyNow ? "Buy Now product is not available." : "Your cart is empty.");
      return;
    }
    if (!selectedAddressId) {
      setMessage("Please add/select an address first.");
      return;
    }
    if (!window.Razorpay) {
      setMessage("Payment script is still loading. Try again.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const selectedAddress = addresses.find((address) => address.id === selectedAddressId);
      const order = await createOrder(
        isBuyNow && buyNowId
          ? { addressId: selectedAddressId, paymentMethod, buyNow: { productId: buyNowId, quantity: buyNowQuantity } }
          : { addressId: selectedAddressId, paymentMethod },
        couponCode || undefined,
      );
      const payment = await createRazorpayOrder(order.id);
      const razorpay = new window.Razorpay({
        key: payment.keyId,
        amount: payment.razorpayOrder.amount,
        currency: payment.razorpayOrder.currency,
        order_id: payment.razorpayOrder.id,
        name: "Priya's Aqua Fresh",
        description: order.orderNumber,
        prefill: {
          name: selectedAddress?.fullName || "",
          contact: selectedAddress?.mobile || "",
        },
        theme: { color: "#0A3A38" },
        modal: {
          ondismiss: async () => {
            try {
              await markOrderPaymentFailed(order.id, "checkout_dismissed");
            } catch {
              // The order remains pending if the failure update cannot reach the API.
            } finally {
              setMessage("Payment was not completed. Please try again.");
              setSaving(false);
            }
          },
        },
        handler: async (response: RazorpayResponse) => {
          const verifiedOrder = await verifyRazorpayPayment({
            orderId: order.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            checkoutMode: isBuyNow ? "BUY_NOW" : "CART",
          });
          setOrderShare(buildOrderShareDetails(verifiedOrder));
          setMessage("Payment completed successfully.");
          if (!isBuyNow) {
            clearCartState();
          }
        },
      });
      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setSaving(false);
    }
  }

  const checkoutItems = isBuyNow && buyNowProduct
    ? [{ product: buyNowProduct, quantity: buyNowQuantity }]
    : cartItems;
  const checkoutSubtotal = isBuyNow
    ? checkoutItems.reduce((sum, item) => sum + getProductDisplayPrice(item.product, user?.role).price * item.quantity, 0)
    : subtotal;
  const total = Math.max(checkoutSubtotal - discount, 0);
  const codAdvanceAmount = Math.min(orderAdvanceAmount, total);
  const advanceAmount = paymentMethod === "COD" ? codAdvanceAmount : total;
  const balanceAmount = Math.max(total - codAdvanceAmount, 0);
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;

  function buildOrderShareDetails(order: Awaited<ReturnType<typeof verifyRazorpayPayment>>): CheckoutShareState {
    const address = order.shippingAddress ?? selectedAddress;
    const products = order.items.length > 0
      ? order.items.map((item) => `${item.productName} x ${item.quantity}`).join(", ")
      : checkoutItems.map((item) => `${item.product.name} x ${item.quantity}`).join(", ");
    const addressText = address
      ? [
          address.addressLine1,
          address.addressLine2,
          address.city,
          address.state,
          address.pincode,
          address.landmark ? `Landmark: ${address.landmark}` : "",
        ].filter(Boolean).join(", ")
      : "";

    return {
      orderNumber: order.orderNumber,
      customerName: address?.fullName || selectedAddress?.fullName || user?.fullName || "Customer",
      mobile: address?.mobile || selectedAddress?.mobile || user?.mobile || "",
      products,
      totalAmount: Number(order.totalAmount || total),
      paymentType: order.paymentType === "ADVANCE_PAYMENT" ? "Advance Payment" : "Full Payment",
      paidAmount: Number(order.paidAmount ?? (order.paymentStatus === "PARTIAL" ? order.advanceAmount : order.totalAmount) ?? 0),
      balanceAmount: Number(order.balanceAmount || 0),
      paymentStatus: order.paymentStatus,
      address: addressText,
    };
  }

  if (!user) {
    return (
      <SitePage eyebrow="Checkout" title="Login to checkout" description="Please login before placing your order.">
        <section data-native-screen="checkout" className="px-4 pb-28 md:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-6 text-center shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-10">
            <button onClick={openLogin} className="rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white">Login to Continue</button>
          </div>
        </section>
      </SitePage>
    );
  }

  return (
    <SitePage eyebrow="Checkout" title="Confirm your order" description="Select address, apply coupon and place your order.">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <section data-native-screen="checkout" className="px-4 pb-28 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_24rem] lg:gap-8">
          <div className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-4 shadow-[0_10px_30px_rgba(84,61,35,0.06)] lg:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black lg:text-2xl">Delivery Address</h2>
                <p className="mt-1 text-sm font-semibold text-[#5A6362]">Current delivery address for this order.</p>
              </div>
            </div>

            <div className="mt-5">
              {addressLoading ? <p className="rounded-xl border border-dashed border-[#D8B879] p-4 text-sm font-semibold text-[#5A6362]">Loading saved addresses...</p> : null}
              {!addressLoading && !selectedAddress ? (
                <p className="rounded-xl border border-dashed border-[#D8B879] p-4 text-sm font-semibold text-[#5A6362]">No saved address found. Add one address below to continue checkout.</p>
              ) : null}
              {selectedAddress ? (
                <button
                  type="button"
                  onClick={() => {
                    setAddressSelectorOpen(true);
                  }}
                  className="flex w-full items-start justify-between gap-3 rounded-xl border border-[#0A3A38] bg-white p-3 text-left transition hover:bg-[#F5E9D8] md:p-4"
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 font-black text-[#1D2D2E]">
                      {selectedAddress.fullName}
                      <span className="text-sm text-[#5A6362]">{selectedAddress.mobile}</span>
                      {selectedAddress.isDefault ? <span className="rounded-full bg-[#0A3A38] px-2 py-0.5 text-xs font-black text-white">Default</span> : null}
                    </span>
                    <span className="mt-2 block text-sm font-semibold leading-6 text-[#5A6362]">
                      {selectedAddress.addressLine1}
                      {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      {selectedAddress.landmark ? `, Landmark: ${selectedAddress.landmark}` : ""}
                    </span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#E5D8C7] bg-[#FFF9F1] text-[#0A3A38] md:h-11 md:w-11">
                    <ChevronDownIcon className="h-5 w-5" />
                  </span>
                </button>
              ) : null}
            </div>

            <div className="mt-5 rounded-2xl border border-[#E5D8C7] bg-white p-3 md:p-4">
              <h3 className="font-serif text-xl font-semibold text-[#1D2D2E] md:text-2xl">Add New Address</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
                <input className={inputClass} placeholder="Full name" value={addressForm.fullName} onChange={(event) => updateAddress("fullName", event.target.value)} />
                <input className={inputClass} placeholder="Mobile number" value={addressForm.mobile} onChange={(event) => updateAddress("mobile", event.target.value)} />
                <input className={`${inputClass} md:col-span-2`} placeholder="Address line 1" value={addressForm.addressLine1} onChange={(event) => updateAddress("addressLine1", event.target.value)} />
                <input className={`${inputClass} md:col-span-2`} placeholder="Address line 2 optional" value={addressForm.addressLine2} onChange={(event) => updateAddress("addressLine2", event.target.value)} />
                <input className={inputClass} placeholder="City" value={addressForm.city} onChange={(event) => updateAddress("city", event.target.value)} />
                <input className={inputClass} placeholder="State" value={addressForm.state} onChange={(event) => updateAddress("state", event.target.value)} />
                <input className={inputClass} placeholder="Pincode" value={addressForm.pincode} onChange={(event) => updateAddress("pincode", event.target.value)} />
                <input className={inputClass} placeholder="Landmark optional" value={addressForm.landmark} onChange={(event) => updateAddress("landmark", event.target.value)} />
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm font-black text-[#526161]">
                <input type="checkbox" className="h-4 w-4 accent-[#0A3A38]" checked={addressForm.isDefault} onChange={(event) => updateAddress("isDefault", event.target.checked)} />
                Set as default address
              </label>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button type="button" disabled={addressSaving} onClick={saveAddress} className="rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white disabled:opacity-60">
                  {addressSaving ? "Saving..." : "Save Address"}
                </button>
                <button type="button" onClick={() => setAddressForm(emptyAddress)} className="rounded-full border border-[#C59A55] px-6 py-3 text-sm font-black text-[#9B7137]">
                  Clear
                </button>
              </div>
            </div>
          </div>

          <aside className="h-max rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-4 shadow-[0_10px_30px_rgba(84,61,35,0.06)] lg:p-6">
            <h2 className="text-xl font-black lg:text-2xl">{isBuyNow ? "Buy Now Summary" : "Summary"}</h2>
            <div className="mt-5 grid gap-3">
              {buyNowLoading ? (
                <p className="text-sm font-semibold text-[#5A6362]">Loading product...</p>
              ) : checkoutItems.length === 0 ? (
                <p className="text-sm font-semibold text-[#5A6362]">{isBuyNow ? "Product is not available." : "Your cart is empty."}</p>
              ) : (
                checkoutItems.map((item) => {
                  const display = getProductDisplayPrice(item.product, user?.role);
                  return (
                  <div key={item.product.id} className="grid grid-cols-[52px_1fr] gap-3 rounded-xl border border-[#E5D8C7] bg-white p-2 text-sm sm:grid-cols-[56px_1fr_auto]">
                    <div className="relative h-[3.25rem] w-[3.25rem] overflow-hidden rounded-lg bg-[#F7F0E7] sm:h-14 sm:w-14">
                      <Image src={item.product.image} alt={item.product.name} fill sizes="(max-width: 639px) 52px, 56px" className="object-contain p-1.5" unoptimized />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-black leading-5 text-[#1D2D2E]">{item.product.name}</p>
                      <p className="mt-1 text-xs font-bold text-[#5A6362]">Qty: {item.quantity}</p>
                    </div>
                    <span data-current-price className="col-span-2 text-right font-black text-[#0A3A38] sm:col-span-1">Rs. {(display.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                  );
                })
              )}
            </div>

            <div className="mt-5">
              <div className="flex gap-2">
                <input value={couponCode} onChange={(event) => { setCouponCode(event.target.value.toUpperCase()); setCouponMessage(""); }} placeholder="Coupon" className="min-w-0 flex-1 rounded-full border border-[#E5D8C7] bg-white px-4 py-3 font-semibold text-[#1D2D2E] outline-none" />
                <button type="button" onClick={applyCoupon} className="rounded-full border border-[#C59A55] px-4 font-black text-[#9B7137]">Apply</button>
              </div>
              {couponMessage ? <p className="mt-2 rounded-lg bg-[#F5E9D8] px-3 py-2 text-sm font-semibold text-[#8A5F23]">{couponMessage}</p> : null}
            </div>
            <div className="mt-5 grid gap-3">
              <p className="text-sm font-black text-[#3B4343]">Payment Option</p>
              <button
                type="button"
                onClick={() => setPaymentMethod("ONLINE")}
                className={`rounded-xl border p-4 text-left transition ${paymentMethod === "ONLINE" ? "border-[#0A3A38] bg-white" : "border-[#E5D8C7] bg-white/70 hover:border-[#C59A55]"}`}
              >
                <span className="flex items-start gap-3">
                  <span className={`mt-1 h-4 w-4 rounded-full border ${paymentMethod === "ONLINE" ? "border-[#0A3A38] bg-[#0A3A38]" : "border-[#C59A55]"}`} />
                  <span>
                    <span className="block font-black text-[#1D2D2E]">Pay Online</span>
                    <span className="mt-1 block text-xs font-semibold text-[#5A6362]">Pay full amount now through Razorpay.</span>
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`rounded-xl border p-4 text-left transition ${paymentMethod === "COD" ? "border-[#0A3A38] bg-white" : "border-[#E5D8C7] bg-white/70 hover:border-[#C59A55]"}`}
              >
                <span className="flex items-start gap-3">
                  <span className={`mt-1 h-4 w-4 rounded-full border ${paymentMethod === "COD" ? "border-[#0A3A38] bg-[#0A3A38]" : "border-[#C59A55]"}`} />
                  <span>
                    <span className="block font-black text-[#1D2D2E]">Cash on Delivery</span>
                    <span className="mt-1 block text-xs font-semibold text-[#5A6362]">Pay Rs. {codAdvanceAmount.toLocaleString("en-IN")} advance now. Pay remaining amount on delivery.</span>
                  </span>
                </span>
              </button>
            </div>
            <div className="mt-5 grid gap-2 border-t border-[#E5D8C7] pt-5 text-sm font-bold text-[#5A6362]">
              <p className="flex justify-between"><span>Subtotal</span><span>Rs. {checkoutSubtotal.toLocaleString("en-IN")}</span></p>
              <p className="flex justify-between"><span>Discount</span><span>-Rs. {discount.toLocaleString("en-IN")}</span></p>
              {paymentMethod === "COD" ? (
                <>
                  <p className="flex justify-between text-[#0A3A38]"><span>Advance Payable Now</span><span>Rs. {advanceAmount.toLocaleString("en-IN")}</span></p>
                  <p className="flex justify-between"><span>Balance on Delivery</span><span>Rs. {balanceAmount.toLocaleString("en-IN")}</span></p>
                </>
              ) : null}
            </div>
            <p data-current-price className="mt-4 text-2xl font-black lg:text-3xl">Rs. {(paymentMethod === "COD" ? advanceAmount : total).toLocaleString("en-IN")}</p>
            <button type="button" disabled={saving || buyNowLoading || checkoutItems.length === 0} onClick={placeOrder} className="mt-6 h-[3.25rem] w-full rounded-full bg-[#0A3A38] font-black text-white disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Processing..." : paymentMethod === "COD" ? `Pay Rs. ${advanceAmount.toLocaleString("en-IN")} Advance` : "Pay with Razorpay"}
            </button>
            <Link href={isBuyNow ? "/products" : "/cart"} className="mt-3 flex h-12 items-center justify-center rounded-full border border-[#C59A55] font-black text-[#9B7137] hover:bg-[#F5E9D8]">
              {isBuyNow ? "Continue Shopping" : "Back to Cart"}
            </Link>
            {message ? <p className="mt-4 rounded-lg bg-[#F5E9D8] px-3 py-2 text-sm font-semibold text-[#8A5F23]">{message}</p> : null}
          </aside>
        </div>
      </section>
      <ShareDetailsModal
        open={Boolean(orderShare)}
        title="Order Payment Completed"
        description="Your payment was verified. Share the order details now so support can process it quickly."
        details={orderShare ? [
          { label: "Order Number", value: orderShare.orderNumber },
          { label: "Customer Name", value: orderShare.customerName },
          { label: "Mobile Number", value: orderShare.mobile },
          { label: "Order Type", value: isBuyNow ? "Buy Now" : "Cart Order" },
          { label: "Products", value: orderShare.products },
          { label: "Total Amount", value: `Rs. ${orderShare.totalAmount.toLocaleString("en-IN")}` },
          { label: "Payment Type", value: orderShare.paymentType },
          { label: orderShare.paymentType === "Advance Payment" ? "Advance Paid" : "Paid Amount", value: `Rs. ${orderShare.paidAmount.toLocaleString("en-IN")}` },
          { label: "Balance Amount", value: `Rs. ${orderShare.balanceAmount.toLocaleString("en-IN")}` },
          { label: "Payment Status", value: orderShare.paymentStatus },
          { label: "Address", value: orderShare.address },
        ] : []}
        onShared={() => undefined}
        onContinue={() => router.push("/profile/orders")}
        continueLabel="View Orders"
      />
      {addressSelectorOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end bg-[#071624]/70 backdrop-blur-sm lg:grid lg:place-items-center lg:px-5">
          <div className="max-h-[86vh] w-full overflow-y-auto rounded-t-3xl border border-b-0 border-[#E5D8C7] bg-[#FFF9F1] p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] text-[#1D2D2E] shadow-[0_40px_120px_rgba(43,35,22,0.24)] md:p-6 lg:max-h-[90vh] lg:max-w-3xl lg:rounded-2xl lg:border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B68A45]">Delivery Address</p>
                <h3 className="mt-2 font-serif text-2xl font-semibold md:text-3xl">Select Address</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddressSelectorOpen(false);
                }}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#E5D8C7] bg-white text-lg font-black text-[#0A3A38] hover:bg-[#F5E9D8]"
              >
                x
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {addresses.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#D8B879] bg-white p-4 text-sm font-semibold text-[#5A6362]">No saved address found. Add a new address from the checkout page.</p>
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
                    className={`block w-full rounded-xl border p-3 text-left transition md:p-4 ${active ? "border-[#0A3A38] bg-[#F5E9D8]" : "border-[#E5D8C7] bg-white hover:border-[#C59A55]"}`}
                  >
                    <span className="flex items-start gap-3">
                      <span className={`mt-1 grid h-4 w-4 place-items-center rounded-full border ${active ? "border-[#0A3A38]" : "border-[#C59A55]"}`}>
                        {active ? <span className="h-2 w-2 rounded-full bg-[#0A3A38]" /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2 font-black text-[#1D2D2E]">
                          {address.fullName}
                          <span className="text-sm text-[#5A6362]">{address.mobile}</span>
                          {address.isDefault ? <span className="rounded-full bg-[#0A3A38] px-2 py-0.5 text-xs font-black text-white">Default</span> : null}
                        </span>
                        <span className="mt-2 block text-sm font-semibold leading-6 text-[#5A6362]">
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
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAddressSelectorOpen(false);
                }}
                className="rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SitePage>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}

