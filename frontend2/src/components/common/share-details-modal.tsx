"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, MessageCircle } from "lucide-react";

type Detail = {
  label: string;
  value?: string | number | null;
};

type ShareDetailsModalProps = {
  open: boolean;
  title: string;
  description: string;
  details: Detail[];
  onShared: () => void;
  onContinue: () => void;
  continueLabel?: string;
  supportPhoneDisplay?: string;
  supportPhoneLink?: string;
  supportNote?: string;
};

const SUPPORT_PHONE_DISPLAY = "9666541255";
const SUPPORT_PHONE_LINK = "919666541255";

export function ShareDetailsModal({ open, title, description, details, onShared, onContinue, continueLabel = "Done", supportPhoneDisplay = SUPPORT_PHONE_DISPLAY, supportPhoneLink = SUPPORT_PHONE_LINK, supportNote }: ShareDetailsModalProps) {
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (open) setShared(false);
  }, [open]);

  if (!open) return null;

  const visibleDetails = details.filter((detail) => String(detail.value ?? "").trim().length > 0);
  const whatsappMessage = [
    title,
    "",
    ...visibleDetails.map((detail) => `${detail.label}: ${detail.value}`),
  ].join("\n");
  const whatsappUrl = `https://wa.me/${supportPhoneLink}?text=${encodeURIComponent(whatsappMessage)}`;

  function shareDetails() {
    setShared(true);
    onShared();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#071624]/75 px-3 py-4 backdrop-blur-sm sm:px-5">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] text-[#1D2D2E] shadow-[0_40px_120px_rgba(43,35,22,0.26)] sm:max-h-[min(88vh,46rem)]">
        <div className="h-2 shrink-0 bg-[linear-gradient(90deg,#0A3A38,#D8B879)]" />
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#D8B879] bg-white text-[#0A3A38] sm:h-12 sm:w-12">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B68A45]">Important Step</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight sm:text-3xl">{title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#5A6362]">{description}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#D8B879]/70 bg-white p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0A3A38]" aria-hidden="true" />
              <p className="text-sm font-black leading-6 text-[#1D2D2E]">
                {supportNote || `Please share these details on WhatsApp to ${supportPhoneDisplay} so support can process it quickly.`}
              </p>
            </div>
            <dl className="mt-4 grid gap-2 text-sm">
              {visibleDetails.map((detail) => (
                <div key={detail.label} className="grid gap-1 rounded-lg bg-[#FFF9F1] px-3 py-2 sm:grid-cols-[8.5rem_1fr]">
                  <dt className="font-black text-[#526161]">{detail.label}</dt>
                  <dd className="min-w-0 break-words font-semibold leading-6 text-[#1D2D2E]">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#E5D8C7] bg-[#FFF9F1] px-4 py-4 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={shareDetails}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0A3A38] px-5 text-sm font-black text-white transition hover:bg-[#12383A]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Share on WhatsApp
            </button>
            <button
              type="button"
              onClick={onContinue}
              disabled={!shared}
              className="h-12 rounded-full border border-[#C59A55] px-5 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {shared ? continueLabel : "Share First"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
