"use client";

import { useState } from "react";
import { AdminModalShell } from "@/components/admin/admin-modal-shell";

export function ResetPasswordDialog({ dealerName, onClose, onSuccess }: { dealerName: string; onClose: () => void; onSuccess: (password: string, confirmPassword: string) => void }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }
    onSuccess(password, confirmPassword);
  }

  return (
    <AdminModalShell labelledBy="reset-password-title" maxWidth="sm" onClose={onClose}>
      <form onSubmit={submitForm}>
        <div className="border-b border-slate-200 p-5">
          <h2 id="reset-password-title" className="text-lg font-bold text-slate-950">Reset Password</h2>
          <p className="text-sm text-slate-500">Set a new password for {dealerName}.</p>
        </div>
        <div className="grid gap-4 p-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">New Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Confirm Password</span>
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
          </label>
          {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Update Password</button>
        </div>
      </form>
    </AdminModalShell>
  );
}
