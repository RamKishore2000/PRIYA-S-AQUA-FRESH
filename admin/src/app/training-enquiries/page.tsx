"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { StatsCard } from "@/components/admin/stats-card";
import { adminApi } from "@/services/api";
import type { TrainingEnquiry } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

type Tab = "All" | "Interested" | "Paid";

const tabs: Tab[] = ["All", "Interested", "Paid"];

export default function TrainingEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<TrainingEnquiry[]>([]);
  const [tab, setTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listTrainingEnquiries()
      .then(setEnquiries)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load training enquiries."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const matchesTab = tab === "All" || enquiry.actionType === tab || enquiry.paymentStatus === tab;
      const matchesSearch = !term || [enquiry.enquiryNumber, enquiry.fullName, enquiry.mobile, enquiry.city, enquiry.message].some((value) => value.toLowerCase().includes(term));
      return matchesTab && matchesSearch;
    });
  }, [enquiries, search, tab]);

  const interestedCount = enquiries.filter((enquiry) => enquiry.actionType === "Interested").length;
  const paidCount = enquiries.filter((enquiry) => enquiry.paymentStatus === "Paid").length;
  const paidAmount = enquiries.filter((enquiry) => enquiry.paymentStatus === "Paid").reduce((total, enquiry) => total + enquiry.amount, 0);

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title="Training Enquiries" description="View RO training interest requests and paid training registrations." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Enquiries" value={String(enquiries.length)} trend="All training requests" icon="service" />
        <StatsCard title="Interested" value={String(interestedCount)} trend="Follow-up required" icon="customer" />
        <StatsCard title="Paid" value={String(paidCount)} trend="Payment completed" icon="revenue" />
        <StatsCard title="Paid Amount" value={formatCurrency(paidAmount)} trend="Training revenue" icon="revenue" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-md px-4 py-2 text-sm font-bold transition ${tab === item ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, mobile, city"
            className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 lg:w-80"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Enquiry", "Name", "Mobile", "City", "Type", "Amount", "Payment", "Message", "Date"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td className="px-5 py-4 font-bold text-slate-950">{enquiry.enquiryNumber}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{enquiry.fullName}</td>
                  <td className="px-5 py-4 text-slate-600">{enquiry.mobile}</td>
                  <td className="px-5 py-4 text-slate-600">{enquiry.city}</td>
                  <td className="px-5 py-4"><Pill value={enquiry.actionType} /></td>
                  <td className="px-5 py-4 font-bold text-slate-950">{enquiry.amount ? formatCurrency(enquiry.amount) : "-"}</td>
                  <td className="px-5 py-4"><Pill value={enquiry.paymentStatus} /></td>
                  <td className="px-5 py-4"><p className="line-clamp-2 max-w-[240px] text-slate-600">{enquiry.message || "-"}</p></td>
                  <td className="px-5 py-4 text-slate-500">{enquiry.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No training enquiries found.</p> : null}
          {loading ? <p className="p-5 text-sm font-semibold text-slate-500">Loading training enquiries...</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}
function Pill({ value }: { value: string }) {
  return <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">{value}</span>;
}