"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/api";
import type { Review } from "@/types/admin";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listReviews()
      .then(setReviews)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load reviews."))
      .finally(() => setLoading(false));
  }, []);

  function toggleReview(review: Review) {
    const nextStatus = review.status === "Visible" ? "HIDDEN" : "VISIBLE";
    adminApi.setReviewStatus(review.id, nextStatus)
      .then((updatedReview) => {
        setReviews((current) => current.map((item) => (item.id === review.id ? updatedReview : item)));
        setMessage(nextStatus === "VISIBLE" ? "Review is visible now." : "Review hidden from homepage.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update review."));
  }

  const visibleCount = reviews.filter((review) => review.status === "Visible").length;

  return (
    <AdminShell>
      <AdminToast message={message} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Reviews</h1>
        <p className="mt-1 text-sm text-slate-500">User reviews are visible by default. Hide bad reviews or delete spam.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Reviews" value={String(reviews.length)} trend="Submitted by customers and dealers" icon="star" />
        <StatsCard title="Visible" value={String(visibleCount)} trend="Shown on frontend home page" icon="check" />
        <StatsCard title="Hidden" value={String(reviews.length - visibleCount)} trend="Hidden by admin" icon="alert" />
        <StatsCard title="Average Rating" value={averageRating(reviews)} trend="Across all reviews" icon="star" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Customer", "Role", "Rating", "Review", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{review.customerName}</p>
                    <p className="text-xs text-slate-500">User ID: {review.userId}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge value={review.role} /></td>
                  <td className="px-5 py-4 font-bold text-amber-500">{review.rating.toFixed(1)} / 5</td>
                  <td className="px-5 py-4">
                    <p className="line-clamp-2 max-w-lg text-slate-600">{review.message}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge value={review.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{review.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        { label: review.status === "Visible" ? "Hide Review" : "Show Review", icon: "settings", onClick: () => toggleReview(review) },
                        {
                          label: "Delete Review",
                          confirmItemName: "Review",
                          onConfirm: () => {
                            adminApi.deleteReview(review.id)
                              .then(() => {
                                setReviews((current) => current.filter((item) => item.id !== review.id));
                                setMessage("Review deleted successfully.");
                              })
                              .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to delete review."));
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && reviews.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No reviews found yet.</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}

function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return "0.0";
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
}
