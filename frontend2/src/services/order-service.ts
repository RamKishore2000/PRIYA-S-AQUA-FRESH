import { apiRequest } from "@/services/auth-service";

export type Address = {
  id: number;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
};

export type Order = {
  id: number;
  orderNumber: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod?: "ONLINE" | "COD";
  paymentType?: "FULL_PAYMENT" | "ADVANCE_PAYMENT";
  advanceAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
  orderStatus: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  shippingAddress?: Omit<Address, "id" | "isDefault">;
  items: {
    id: number;
    productId: number;
    productName: string;
    productSku: string;
    productSlug?: string;
    imageUrl?: string | null;
    selectedColorName?: string | null;
    selectedColorCode?: string | null;
    selectedImageUrl?: string | null;
    selectedVariantKey?: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

export type RazorpayOrderResponse = {
  keyId: string;
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
  };
  order: Order;
};

export async function fetchAddresses() {
  const data = await apiRequest<{ addresses: Address[] }>("/api/addresses");
  return data.addresses;
}

export async function createAddress(payload: Omit<Address, "id">) {
  const data = await apiRequest<{ address: Address }>("/api/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.address;
}

export async function validateCoupon(code: string, subtotalAmount: number, lineItems: { productId: string | number; lineTotal: number }[] = []) {
  const data = await apiRequest<{ validation: { discountAmount: number; totalAmount: number } }>("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotalAmount, lineItems }),
  });
  return data.validation;
}

type CreateOrderPayload = ({ addressId: number } | { shippingAddress: Omit<Address, "id"> }) & {
  paymentMethod?: "ONLINE" | "COD";
  buyNow?: {
    productId: string | number;
    quantity: number;
    selectedColorName?: string;
    selectedColorCode?: string;
    selectedImageUrl?: string;
    selectedVariantKey?: string;
  };
};

export async function createOrder(payload: CreateOrderPayload, couponCode?: string) {
  const data = await apiRequest<{ order: Order }>("/api/orders", {
    method: "POST",
    body: JSON.stringify("addressId" in payload ? { ...payload, addressId: payload.addressId, couponCode } : { ...payload, shippingAddress: payload.shippingAddress, couponCode }),
  });
  return data.order;
}

export async function createRazorpayOrder(orderId: number) {
  return apiRequest<RazorpayOrderResponse>("/api/orders/razorpay/order", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

export async function verifyRazorpayPayment(payload: {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  checkoutMode?: "CART" | "BUY_NOW";
}) {
  const data = await apiRequest<{ order: Order }>("/api/orders/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.order;
}


export async function markOrderPaymentFailed(orderId: string | number, reason = "checkout_dismissed") {
  const data = await apiRequest<{ order: Order }>(`/api/orders/${orderId}/payment-failed`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
  return data.order;
}
export async function fetchMyOrders() {
  const data = await apiRequest<{ orders: Order[] }>("/api/orders/my");
  return data.orders;
}

export async function fetchMyOrder(id: string | number) {
  const data = await apiRequest<{ order: Order }>(`/api/orders/${id}`);
  return data.order;
}

export function orderImageUrl(imageUrl?: string | null) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  if (!imageUrl) return "/file.svg";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/uploads")) return `${base}${imageUrl}`;
  if (imageUrl.startsWith("/")) return imageUrl;
  return `${base}${imageUrl}`;
}




