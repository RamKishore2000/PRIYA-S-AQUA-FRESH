const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type TrainingEnquiry = {
  id: number;
  enquiryNumber: string;
  fullName: string;
  mobile: string;
  city: string;
  message: string;
  actionType: "INTERESTED" | "PAYMENT";
  amount: number;
  paymentStatus: "NOT_REQUIRED" | "PENDING" | "PAID" | "FAILED";
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt: string;
};

export type TrainingPayload = {
  fullName: string;
  mobile: string;
  city: string;
  message: string;
  actionType: "INTERESTED" | "PAYMENT";
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

type RazorpayTrainingOrderResponse = {
  keyId: string;
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
  };
  enquiry: TrainingEnquiry;
};

async function publicApiRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success) {
    const error = new Error(result.message || "Request failed.") as Error & { fieldErrors?: Record<string, string> };
    error.fieldErrors = result.errors;
    throw error;
  }
  return result.data as T;
}

export async function createTrainingEnquiry(payload: TrainingPayload) {
  const data = await publicApiRequest<{ enquiry: TrainingEnquiry }>("/api/training-enquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.enquiry;
}

export async function createTrainingRazorpayOrder(enquiryId: number) {
  return publicApiRequest<RazorpayTrainingOrderResponse>("/api/training-enquiries/razorpay/order", {
    method: "POST",
    body: JSON.stringify({ enquiryId }),
  });
}

export async function verifyTrainingRazorpayPayment(payload: {
  enquiryId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const data = await publicApiRequest<{ enquiry: TrainingEnquiry }>("/api/training-enquiries/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.enquiry;
}

export async function markTrainingPaymentFailed(enquiryId: number) {
  const data = await publicApiRequest<{ enquiry: TrainingEnquiry }>(`/api/training-enquiries/${enquiryId}/payment-failed`, {
    method: "POST",
    body: JSON.stringify({ reason: "checkout_dismissed" }),
  });
  return data.enquiry;
}