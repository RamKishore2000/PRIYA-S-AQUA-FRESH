const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
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
  advanceAmount?: number;
  balanceAmount?: number;
  orderStatus: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  customer?: {
    id: number;
    fullName: string;
    mobile: string;
    email: string;
    role: "CUSTOMER" | "DEALER" | "ADMIN";
  } | null;
  shippingAddress?: ShippingAddress;
  items: {
    id: number;
    productId: number;
    productName: string;
    productSku: string;
    productSlug?: string;
    imageUrl?: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

export type ShippingAddress = {
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

export type CouponValidation = {
  coupon: {
    id: number;
    code: string;
    discountType: "PERCENTAGE" | "FLAT_AMOUNT";
    discountValue: number;
  };
  discountAmount: number;
  subtotalAmount: number;
  totalAmount: number;
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

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("priyas-access-token");
}

async function apiRequest<T>(path: string, init?: RequestInit) {
  const token = getAccessToken();
  if (!token) throw new Error("Please login to continue.");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success || !result.data) {
    const error = new Error(result.message || "Request failed.") as Error & { fieldErrors?: Record<string, string> };
    error.fieldErrors = result.errors;
    throw error;
  }
  return result.data;
}

type CreateOrderPayload = (ShippingAddress | { addressId: number }) & {
  paymentMethod?: "ONLINE" | "COD";
  buyNow?: {
    productId: string | number;
    quantity: number;
  };
};

export async function createOrder(payload: CreateOrderPayload, couponCode?: string) {
  const data = await apiRequest<{ order: Order }>("/api/orders", {
    method: "POST",
    body: JSON.stringify("addressId" in payload ? { ...payload, addressId: payload.addressId, couponCode } : { ...payload, shippingAddress: payload, couponCode }),
  });
  return data.order;
}

export async function validateCoupon(code: string, subtotalAmount: number) {
  const data = await apiRequest<{ validation: CouponValidation }>("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotalAmount }),
  });
  return data.validation;
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

export async function fetchMyOrders() {
  const data = await apiRequest<{ orders: Order[] }>("/api/orders/my");
  return data.orders;
}

export async function fetchMyOrder(id: string | number) {
  const data = await apiRequest<{ order: Order }>(`/api/orders/${id}`);
  return data.order;
}

export function orderImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "/file.svg";
  if (imageUrl.startsWith("http") || imageUrl.startsWith("/images")) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
}
