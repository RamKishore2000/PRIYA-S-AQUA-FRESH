"use client";

import { useEffect, useState } from "react";

export function AdminToast({ message }: { message: string }) {
  const [dismissedMessage, setDismissedMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => setDismissedMessage(message), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message || dismissedMessage === message) return null;

  const isError = /unable|failed|error|invalid|required|cannot/i.test(message);

  return (
    <div
      className={`fixed right-4 top-4 z-[60] max-w-sm rounded-md border bg-white px-4 py-3 text-sm font-semibold shadow-xl ${
        isError ? "border-red-200 text-red-700" : "border-teal-200 text-teal-700"
      }`}
      role="status"
    >
      {message}
    </div>
  );
}