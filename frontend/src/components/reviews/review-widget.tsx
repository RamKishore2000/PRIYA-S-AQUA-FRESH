"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useShop } from "@/context/shop-context";
import { getStoredUser, type AuthUser } from "@/services/auth-service";
import { submitReview } from "@/services/review-service";

export function ReviewWidget() {
  const { requestLogin } = useShop();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function syncUser() {
      setUser(getStoredUser());
    }
    syncUser();
    window.addEventListener("priyas-auth-changed", syncUser);
    return () => window.removeEventListener("priyas-auth-changed", syncUser);
  }, []);

  function openReview() {
    if (!user) {
      requestLogin();
      toast.error("Login required", { description: "Please login to add a review." });
      return;
    }
    if (!["CUSTOMER", "DEALER"].includes(user.role)) {
      toast.error("Only customers and dealers can add reviews.");
      return;
    }
    setOpen(true);
  }

  async function saveReview() {
    if (!message.trim()) {
      toast.error("Please write your review.");
      return;
    }
    setSaving(true);
    try {
      await submitReview({ rating, message: message.trim() });
      setMessage("");
      setRating(5);
      setOpen(false);
      toast.success("Review added", { description: "Thank you for sharing your experience." });
    } catch (error) {
      toast.error("Unable to add review", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openReview}
        aria-label="Add review"
        title="Add review"
        className="fixed bottom-5 right-5 z-[90] grid h-14 w-14 place-items-center rounded-full border border-[#12a8e6]/45 bg-[#12a8e6] text-white shadow-[0_18px_42px_rgba(18,168,230,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0871cf]"
      >
        <ReviewIcon className="h-6 w-6" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-lg border border-white/10 bg-[#111418] text-white shadow-2xl">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#12a8e6]">Customer Review</p>
                  <h2 className="mt-2 text-2xl font-bold">Share Your Experience</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white">x</button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm font-bold text-slate-200">Rating</p>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`grid h-10 w-10 place-items-center rounded-full border text-lg ${value <= rating ? "border-[#12a8e6] bg-[#12a8e6] text-white" : "border-white/10 bg-white/5 text-slate-300"}`}
                    aria-label={`${value} star rating`}
                  >
                    {"\u2605"}
                  </button>
                ))}
              </div>

              <label className="mt-5 grid gap-2">
                <span className="text-sm font-bold text-slate-200">Review</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  maxLength={1000}
                  className="rounded-md border border-white/10 bg-[#0d1114] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-[#12a8e6]"
                  placeholder="Write about product quality, service, installation or support."
                />
              </label>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
                  Cancel
                </button>
                <button type="button" disabled={saving} onClick={saveReview} className="rounded-md bg-[#12a8e6] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                  {saving ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ReviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.2 14.7 8.7l6.1.9-4.4 4.3 1 6.1-5.4-2.9L6.6 20l1-6.1-4.4-4.3 6.1-.9L12 3.2Z" fill="currentColor" />
      <path d="M7.5 21.2h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
