"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
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

const menuWidth = 208;

export function RowActionsDropdown({ actions }: { actions: RowAction[] }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const menuHeight = Math.min(actions.length * 42 + 12, 288);
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= menuHeight + 8 ? rect.bottom + 6 : Math.max(8, rect.top - menuHeight - 6);
      const left = Math.min(Math.max(8, rect.right - menuWidth), window.innerWidth - menuWidth - 8);

      setMenuStyle({ position: "fixed", top, left, width: menuWidth });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [actions.length, open]);

  const menu = open ? (
    <div ref={menuRef} style={menuStyle} className="z-[9999] max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white p-1.5 text-sm shadow-xl">
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
  ) : null;

  return (
    <div ref={wrapperRef} className="relative flex justify-end">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Open actions"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
      >
        <Icon name="more" />
      </button>

      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}