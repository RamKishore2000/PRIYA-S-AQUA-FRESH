"use client";

import { useEffect, useState } from "react";
import { useShop } from "@/context/shop-context";
import { submitReview } from "@/services/review-service";

export function ReviewWidget() {
  const { user, openLogin } = useShop();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function openReview() {
    if (!user) {
      openLogin();
      return;
    }
    if (user.role === "ADMIN") {
      setNotice("Only signed-in customers can add reviews.");
      return;
    }
    setNotice("");
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
      setNotice("Review submitted. It will show after admin approval.");
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
        className="fixed bottom-[5.6rem] right-4 z-[55] grid h-12 w-12 place-items-center rounded-full border border-[#28B463] bg-[#0057C8] text-white shadow-[0_10px_24px_rgba(0,87,200,0.16)] transition hover:-translate-y-0.5 hover:bg-[#063B7A] md:bottom-[6rem] md:right-5 md:h-14 md:w-14 lg:bottom-5 lg:z-[90]"
      >
        <ReviewIcon className="h-6 w-6" />
      </button>

      {notice && !open ? (
        <div className="fixed bottom-[9rem] right-4 z-[91] max-w-xs rounded-xl border border-[#D8EAF8] border-l-4 border-l-emerald-500 bg-white px-4 py-3 text-sm font-bold text-[#102033] shadow-[0_18px_48px_rgba(16,32,51,0.18)] md:bottom-[9.5rem] md:right-5 lg:bottom-20">
          {notice}
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-[#071624]/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-[1.25rem] border border-[#D8EAF8] bg-[#FFFFFF] text-[#102033] shadow-[0_40px_120px_rgba(16,32,51,0.22)]">
            <div className="h-2 bg-[linear-gradient(90deg,#0057C8,#28B463)]" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0057C8]">Customer Review</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold">Share Your Experience</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[#D8EAF8] bg-white font-black text-[#0057C8]">x</button>
              </div>

              <div className="mt-6">
                <p className="text-sm font-black text-[#3B4343]">Rating</p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`grid h-10 w-10 place-items-center rounded-full border text-lg ${value <= rating ? "border-[#0057C8] bg-[#28B463] text-white" : "border-[#D8EAF8] bg-white text-[#0057C8]"}`}
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
                  className="rounded-xl border border-[#D8EAF8] bg-white px-4 py-3 text-sm font-semibold text-[#102033] outline-none focus:border-[#0057C8]"
                  placeholder="Write about product quality, service, installation or support."
                />
              </label>

              {notice ? <p className="mt-4 rounded-lg bg-[#EAF6FF] px-3 py-2 text-sm font-semibold text-[#075985]">{notice}</p> : null}

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-[#0057C8] px-5 py-3 text-sm font-black text-[#0057C8]">
                  Cancel
                </button>
                <button type="button" disabled={saving} onClick={saveReview} className="rounded-full bg-[#0057C8] px-5 py-3 text-sm font-black text-white disabled:opacity-60">
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
