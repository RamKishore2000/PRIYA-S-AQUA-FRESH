const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

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

export type AddressPayload = Omit<Address, "id">;

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

export async function fetchAddresses() {
  const data = await apiRequest<{ addresses: Address[] }>("/api/addresses");
  return data.addresses;
}

export async function createAddress(payload: AddressPayload) {
  const data = await apiRequest<{ address: Address }>("/api/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.address;
}
