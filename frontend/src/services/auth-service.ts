type RegisterPayload = {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
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
