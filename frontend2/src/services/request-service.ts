const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ApiResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

async function post(path: string, payload: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as ApiResponse;

  if (!response.ok || !result.success) {
    const error = new Error(result.message || "Request failed.") as Error & { fieldErrors?: Record<string, string> };
    error.fieldErrors = result.errors;
    throw error;
  }

  return result;
}

export function submitServiceRequest(payload: {
  customerName: string;
  mobile: string;
  email?: string;
  serviceType: string;
  address: string;
  city?: string;
  preferredDate?: string;
  problem?: string;
}) {
  return post("/api/service-requests", payload);
}

export function submitContactMessage(payload: {
  fullName: string;
  mobile?: string;
  email?: string;
  subject?: string;
  message: string;
}) {
  return post("/api/contact-messages", payload);
}
