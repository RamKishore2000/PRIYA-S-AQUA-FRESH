"use client";

import { useState } from "react";
import { AdminModalShell } from "@/components/admin/admin-modal-shell";
import { Icon } from "@/components/admin/icon";

export function ConfirmDeleteDialog({ itemName, compact = false, label = "Delete", onConfirm }: { itemName: string; compact?: boolean; label?: string; onConfirm?: () => void }) {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return <span className="text-xs font-semibold text-slate-400">Deleted</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          compact
            ? "flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            : "text-sm font-semibold text-red-600 hover:text-red-700"
        }
      >
        {compact ? <Icon name="delete" className="h-4 w-4" /> : null}
        {label}
      </button>
      {open ? (
        <AdminModalShell labelledBy={`delete-${itemName.toLowerCase()}-title`} maxWidth="sm">
          <div className="p-6">
            <h3 id={`delete-${itemName.toLowerCase()}-title`} className="text-lg font-bold text-slate-950">Delete {itemName}?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Are you sure you want to delete this {itemName.toLowerCase()}? This is a mock action for now.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm?.();
                  setDeleted(true);
                  setOpen(false);
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </AdminModalShell>
      ) : null}
    </>
  );
}
