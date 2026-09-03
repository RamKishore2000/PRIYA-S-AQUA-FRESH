"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/api";
import type { Review } from "@/types/admin";

const statusFilters = ["All", "Pending", "Approved", "Rejected"] as const;
type StatusFilter = (typeof statusFilters)[number];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    adminApi.listReviews()
      .then(setReviews)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load reviews."))
      .finally(() => setLoading(false));
  }, []);

  function updateReviewStatus(review: Review, status: "PENDING" | "APPROVED" | "REJECTED") {
    adminApi.setReviewStatus(review.id, status)
      .then((updatedReview) => {
        setReviews((current) => current.map((item) => (item.id === review.id ? updatedReview : item)));
        setMessage(status === "APPROVED" ? "Review approved and visible on website." : status === "REJECTED" ? "Review rejected and hidden from website." : "Review moved to pending.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update review."));
  }

  const pendingCount = reviews.filter((review) => review.status === "Pending").length;
  const approvedCount = reviews.filter((review) => review.status === "Approved").length;
  const rejectedCount = reviews.filter((review) => review.status === "Rejected").length;
  const filteredReviews = filter === "All" ? reviews : reviews.filter((review) => review.status === filter);

  return (
    <AdminShell>
      <AdminToast message={message} />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Reviews</h1>
          <p className="mt-1 text-sm text-slate-500">New customer and dealer reviews wait here until admin approval.</p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {statusFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-md px-3 py-2 text-xs font-bold transition ${filter === item ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Pending" value={String(pendingCount)} trend="Needs admin checking" icon="alert" />
        <StatsCard title="Approved" value={String(approvedCount)} trend="Shown on frontend" icon="check" />
        <StatsCard title="Rejected" value={String(rejectedCount)} trend="Hidden from frontend" icon="orders" />
        <StatsCard title="Average Rating" value={averageRating(reviews)} trend="Across all reviews" icon="star" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Customer", "Role", "Rating", "Review", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{review.customerName}</p>
                    <p className="text-xs text-slate-500">User ID: {review.userId}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge value={review.role} /></td>
                  <td className="px-5 py-4 font-bold text-amber-500">{review.rating.toFixed(1)} / 5</td>
                  <td className="px-5 py-4">
                    <p className="line-clamp-3 max-w-xl text-slate-600">{review.message}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge value={review.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{review.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        ...(review.status !== "Approved" ? [{ label: "Approve Review", icon: "check", onClick: () => updateReviewStatus(review, "APPROVED") }] : []),
                        ...(review.status !== "Rejected" ? [{ label: "Reject Review", icon: "settings", onClick: () => updateReviewStatus(review, "REJECTED") }] : []),
                        ...(review.status !== "Pending" ? [{ label: "Move to Pending", icon: "alert", onClick: () => updateReviewStatus(review, "PENDING") }] : []),
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
          {!loading && filteredReviews.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No reviews found for this filter.</p> : null}
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
