"use client";

import type { ReactNode } from "react";

type AdminModalShellProps = {
  children: ReactNode;
  labelledBy?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
};

const widths = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function AdminModalShell({ children, labelledBy, maxWidth = "md" }: AdminModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 px-4 py-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className="flex min-h-full items-center justify-center">
        <div className={`max-h-[calc(100vh-3rem)] w-full overflow-y-auto ${widths[maxWidth]} rounded-lg bg-white shadow-xl sm:max-h-[calc(100vh-4rem)]`}>
          {children}
        </div>
      </div>
    </div>
  );
}
