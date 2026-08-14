const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("priyas-access-token");
}

export async function submitReview(payload: { rating: number; message: string }) {
  const token = getAccessToken();
  if (!token) throw new Error("Please login to continue.");

  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as ApiResponse<{ review: { id: number } }>;
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Unable to add review.");
  }
  return result.data.review;
}
