"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/admin/icon";

type AdminModalShellProps = {
  children: ReactNode;
  labelledBy?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  onClose?: () => void;
};

const widths = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function AdminModalShell({ children, labelledBy, maxWidth = "md", onClose }: AdminModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 px-4 py-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className="flex min-h-full items-center justify-center">
        <div className={`relative max-h-[calc(100vh-3rem)] w-full overflow-y-auto ${widths[maxWidth]} rounded-lg bg-white shadow-xl sm:max-h-[calc(100vh-4rem)]`}>
          {onClose ? (
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}