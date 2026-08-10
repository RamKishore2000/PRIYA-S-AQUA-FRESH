"use client";

import { useRouter } from "next/navigation";

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <button
          type="button"
          onClick={() => router.push(actionHref)}
          className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
