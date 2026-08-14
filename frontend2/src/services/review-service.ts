import { apiRequest } from "@/services/auth-service";

export async function submitReview(payload: { rating: number; message: string }) {
  const data = await apiRequest<{ review: { id: number } }>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.review;
}
