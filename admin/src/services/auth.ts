const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

type LoginResponse = {
  user: {
    id: number;
    fullName: string;
    email: string;
    role: "CUSTOMER" | "DEALER" | "ADMIN";
    status: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export async function loginAdmin(email: string, password: string, rememberMe: boolean) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe }),
  });
  const result = (await response.json()) as ApiResponse<LoginResponse>;
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Login failed.");
  }
  if (result.data.user.role !== "ADMIN") {
    throw new Error("Only admin accounts can access the admin panel.");
  }
  sessionStorage.setItem("priyas-admin-auth", "true");
  sessionStorage.setItem("priyas-admin-user", JSON.stringify(result.data.user));
  sessionStorage.setItem("priyas-admin-access-token", result.data.tokens.accessToken);
  sessionStorage.setItem("priyas-admin-refresh-token", result.data.tokens.refreshToken);
  return result.data.user;
}
