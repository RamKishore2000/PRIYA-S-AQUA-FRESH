type RegisterPayload = {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

type RegisterResponse = {
  user: {
    id: number;
    fullName: string;
    mobile: string;
    email: string;
    role: "CUSTOMER";
    status: string;
  };
};

type LoginResponse = {
  user: {
    id: number;
    fullName: string;
    mobile: string;
    email: string;
    role: "CUSTOMER" | "DEALER" | "ADMIN";
    status: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresAt: string;
  };
};

export type AuthUser = LoginResponse["user"];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerCustomer(payload: RegisterPayload) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as ApiResponse<RegisterResponse>;

  if (!response.ok || !result.success) {
    const error = new Error(result.message || "Registration failed.") as Error & {
      fieldErrors?: Record<string, string>;
    };
    error.fieldErrors = result.errors;
    throw error;
  }

  return result;
}

export async function loginUser(payload: LoginPayload) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as ApiResponse<LoginResponse>;

  if (!response.ok || !result.success || !result.data) {
    const error = new Error(result.message || "Login failed.") as Error & {
      fieldErrors?: Record<string, string>;
    };
    error.fieldErrors = result.errors;
    throw error;
  }

  localStorage.setItem("priyas-auth-user", JSON.stringify(result.data.user));
  localStorage.setItem("priyas-access-token", result.data.tokens.accessToken);
  localStorage.setItem("priyas-refresh-token", result.data.tokens.refreshToken);
  window.dispatchEvent(new Event("priyas-auth-changed"));
  return result;
}


export async function sendLoginOtp(mobile: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile }),
  });
  const result = (await response.json()) as ApiResponse<{ otp: { mobile: string; expiresInSeconds: number; resendAfterSeconds: number; devOtp?: string } }>;
  if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Unable to send OTP.");
  return result.data.otp;
}

export async function resendLoginOtp(mobile: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/otp/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile }),
  });
  const result = (await response.json()) as ApiResponse<{ otp: { mobile: string; expiresInSeconds: number; resendAfterSeconds: number; devOtp?: string } }>;
  if (!response.ok || !result.success || !result.data) throw new Error(result.message || "Unable to resend OTP.");
  return result.data.otp;
}

export async function verifyLoginOtp(payload: { mobile: string; otp: string; rememberMe?: boolean }) {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as ApiResponse<LoginResponse>;
  if (!response.ok || !result.success || !result.data) throw new Error(result.message || "OTP verification failed.");
  localStorage.setItem("priyas-auth-user", JSON.stringify(result.data.user));
  localStorage.setItem("priyas-access-token", result.data.tokens.accessToken);
  localStorage.setItem("priyas-refresh-token", result.data.tokens.refreshToken);
  window.dispatchEvent(new Event("priyas-auth-changed"));
  return result.data.user;
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

export function logoutUser() {
  clearStoredSession();
}

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }
  return API_BASE_URL;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("priyas-access-token");
}

function clearStoredSession() {
  localStorage.removeItem("priyas-auth-user");
  localStorage.removeItem("priyas-access-token");
  localStorage.removeItem("priyas-refresh-token");
  window.dispatchEvent(new Event("priyas-auth-changed"));
}

async function refreshSession() {
  const refreshToken = localStorage.getItem("priyas-refresh-token");
  if (!refreshToken) return null;

  const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  const result = (await response.json()) as ApiResponse<LoginResponse>;
  if (!response.ok || !result.success || !result.data) {
    clearStoredSession();
    return null;
  }

  localStorage.setItem("priyas-auth-user", JSON.stringify(result.data.user));
  localStorage.setItem("priyas-access-token", result.data.tokens.accessToken);
  localStorage.setItem("priyas-refresh-token", result.data.tokens.refreshToken);
  window.dispatchEvent(new Event("priyas-auth-changed"));
  return result.data.tokens.accessToken;
}

async function fetchWithToken<T>(path: string, init: RequestInit | undefined, token: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const result = (await response.json()) as ApiResponse<T>;
  return { response, result };
}

export async function apiRequest<T>(path: string, init?: RequestInit) {
  const token = getAccessToken();
  if (!token) throw new Error("Please login to continue.");

  let { response, result } = await fetchWithToken<T>(path, init, token);
  if (response.status === 401) {
    const nextToken = await refreshSession();
    if (nextToken) {
      ({ response, result } = await fetchWithToken<T>(path, init, nextToken));
    }
  }

  if (!response.ok || !result.success || !result.data) {
    const error = new Error(result.message || "Request failed.") as Error & { fieldErrors?: Record<string, string> };
    error.fieldErrors = result.errors;
    throw error;
  }
  return result.data;
}

