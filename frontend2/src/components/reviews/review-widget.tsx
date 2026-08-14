"use client";

import { useState } from "react";
import { useShop } from "@/context/shop-context";
import { submitReview } from "@/services/review-service";

export function ReviewWidget() {
  const { user, openLogin } = useShop();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  function openReview() {
    if (!user) {
      openLogin();
      return;
    }
    if (!["CUSTOMER", "DEALER"].includes(user.role)) {
      setNotice("Only customers and dealers can add reviews.");
      return;
    }
    setOpen(true);
  }

  async function saveReview() {
    if (!message.trim()) {
      setNotice("Please write your review.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      await submitReview({ rating, message: message.trim() });
      setMessage("");
      setRating(5);
      setOpen(false);
      setNotice("Review added. Thank you for sharing your experience.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to add review.");
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
        className="fixed bottom-5 right-5 z-[90] grid h-14 w-14 place-items-center rounded-full border border-[#D8B879] bg-[#0A3A38] text-white shadow-[0_18px_42px_rgba(10,58,56,0.28)] transition hover:-translate-y-0.5 hover:bg-[#12383A]"
      >
        <ReviewIcon className="h-6 w-6" />
      </button>

      {notice && !open ? (
        <div className="fixed bottom-20 right-5 z-[91] max-w-xs rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 text-sm font-bold text-[#1D2D2E] shadow-[0_18px_48px_rgba(43,35,22,0.2)]">
          {notice}
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-[#071624]/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-[1.25rem] border border-[#E5D8C7] bg-[#FFF9F1] text-[#1D2D2E] shadow-[0_40px_120px_rgba(43,35,22,0.24)]">
            <div className="h-2 bg-[linear-gradient(90deg,#0A3A38,#D8B879)]" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">Customer Review</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold">Share Your Experience</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[#E5D8C7] bg-white font-black text-[#0A3A38]">x</button>
              </div>

              <div className="mt-6">
                <p className="text-sm font-black text-[#3B4343]">Rating</p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`grid h-10 w-10 place-items-center rounded-full border text-lg ${value <= rating ? "border-[#C59A55] bg-[#D8B879] text-white" : "border-[#E5D8C7] bg-white text-[#B68A45]"}`}
                      aria-label={`${value} star rating`}
                    >
                      {"\u2605"}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mt-5 grid gap-2">
                <span className="text-sm font-black text-[#3B4343]">Review</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  maxLength={1000}
                  className="rounded-xl border border-[#E5D8C7] bg-white px-4 py-3 text-sm font-semibold text-[#1D2D2E] outline-none focus:border-[#0A3A38]"
                  placeholder="Write about product quality, service, installation or support."
                />
              </label>

              {notice ? <p className="mt-4 rounded-lg bg-[#F5E9D8] px-3 py-2 text-sm font-semibold text-[#8A5F23]">{notice}</p> : null}

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-[#C59A55] px-5 py-3 text-sm font-black text-[#9B7137]">
                  Cancel
                </button>
                <button type="button" disabled={saving} onClick={saveReview} className="rounded-full bg-[#0A3A38] px-5 py-3 text-sm font-black text-white disabled:opacity-60">
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
