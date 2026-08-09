"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/admin/icon";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";

type RowAction = {
  label: string;
  icon?: string;
  tone?: "default" | "destructive" | "accent";
  confirmItemName?: string;
  onConfirm?: () => void;
  onClick?: () => void;
};

export function RowActionsDropdown({ actions }: { actions: RowAction[] }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex justify-end">
      <button
        type="button"
        aria-label="Open actions"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
      >
        <Icon name="more" />
      </button>

      {open ? (
        <div className="absolute right-0 top-10 z-20 w-52 rounded-md border border-slate-200 bg-white p-1.5 text-sm shadow-xl">
          {actions.map((action) =>
            action.confirmItemName ? (
              <div key={action.label} className="border-t border-slate-100 pt-1 first:border-t-0 first:pt-0">
                <ConfirmDeleteDialog itemName={action.confirmItemName} compact label={action.label} onConfirm={action.onConfirm} />
              </div>
            ) : (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  action.onClick?.();
                }}
                className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left font-semibold transition ${
                  action.tone === "accent"
                    ? "text-indigo-700 hover:bg-indigo-50"
                    : action.tone === "destructive"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {action.icon ? <Icon name={action.icon} className="h-4 w-4" /> : null}
                {action.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
