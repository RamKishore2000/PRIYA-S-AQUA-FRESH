const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type AuthUser = {
  id: number;
  fullName: string;
  mobile: string;
  email: string;
  role: "CUSTOMER" | "DEALER" | "ADMIN";
  status: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("priyas-access-token");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const rawUser = localStorage.getItem("priyas-auth-user");
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export async function loginUser(payload: { email: string; password: string; rememberMe?: boolean }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as ApiResponse<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string } }>;
  if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Login failed.");
  localStorage.setItem("priyas-auth-user", JSON.stringify(result.data.user));
  localStorage.setItem("priyas-access-token", result.data.tokens.accessToken);
  localStorage.setItem("priyas-refresh-token", result.data.tokens.refreshToken);
  window.dispatchEvent(new Event("priyas-auth-changed"));
  return result.data.user;
}

export async function registerCustomer(payload: {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as ApiResponse<{ user: AuthUser }>;
  if (!response.ok || !result.success) throw new Error(result.message || "Registration failed.");
  return result.data?.user || null;
}

export function logoutUser() {
  localStorage.removeItem("priyas-auth-user");
  localStorage.removeItem("priyas-access-token");
  localStorage.removeItem("priyas-refresh-token");
  window.dispatchEvent(new Event("priyas-auth-changed"));
}

export async function apiRequest<T>(path: string, init?: RequestInit) {
  const token = getAccessToken();
  if (!token) throw new Error("Please login to continue.");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Request failed.");
  return result.data;
}
