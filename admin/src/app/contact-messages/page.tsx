"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { adminApi } from "@/services/api";
import type { ContactMessage } from "@/types/admin";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    adminApi.listContactMessages()
      .then(setMessages)
      .catch((error) => setNotice(error instanceof Error ? error.message : "Unable to load contact messages."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: messages.length,
    newItems: messages.filter((message) => message.status === "New").length,
  }), [messages]);

  return (
    <AdminShell>
      <AdminToast message={notice} />
      <PageHeader title="Contact Messages" description="View customer enquiries submitted from the storefront contact form." />

      <div className="grid gap-4 md:grid-cols-2">
        <Stat label="Total Messages" value={stats.total} />
        <Stat label="New Messages" value={stats.newItems} />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-950">Messages</h2>
        </div>
        {loading ? <p className="p-5 text-sm font-semibold text-slate-500">Loading messages...</p> : null}
        {!loading && messages.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No contact messages found.</p> : null}
        <div className="divide-y divide-slate-100">
          {messages.map((message) => (
            <article key={message.id} className="grid gap-3 p-5 lg:grid-cols-[16rem_1fr_auto]">
              <div>
                <p className="font-bold text-slate-950">{message.fullName}</p>
                <p className="mt-1 text-sm text-slate-500">{message.mobile || "No mobile"}</p>
                <p className="mt-1 break-words text-sm text-slate-500">{message.email || "No email"}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{message.subject}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{message.message}</p>
              </div>
              <div className="flex flex-row items-start gap-2 lg:flex-col lg:items-end">
                <span className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">{message.status}</span>
                <span className="text-xs font-semibold text-slate-500">{message.createdDate}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
