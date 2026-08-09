"use client";

import { useState } from "react";
import { AdminModalShell } from "@/components/admin/admin-modal-shell";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { recentServiceRequests } from "@/data/admin";
import type { ServiceRequest, ServiceStatus } from "@/types/admin";

const serviceStats = [
  { title: "Total Requests", value: "196", trend: "+9 this week", icon: "service" },
  { title: "New", value: "28", trend: "Needs assignment", icon: "alert" },
  { title: "In Progress", value: "42", trend: "Technicians active", icon: "clock" },
  { title: "Completed", value: "108", trend: "55% completion", icon: "grid" },
  { title: "Cancelled", value: "18", trend: "Review reasons", icon: "orders" },
];

const statuses: ServiceStatus[] = ["New", "Assigned", "In Progress", "Completed", "Cancelled"];

function ServiceDetails({ request, onClose }: { request: ServiceRequest; onClose: () => void }) {
  const [status, setStatus] = useState<ServiceStatus>(request.status);

  return (
    <AdminModalShell labelledBy="service-details-title" maxWidth="lg">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 id="service-details-title" className="text-lg font-bold text-slate-950">{request.id}</h2>
            <p className="text-sm text-slate-500">{request.serviceType}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
            Close
          </button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {[
            ["Customer Name", request.customerName],
            ["Phone", request.phone],
            ["Email", request.email],
            ["Service Type", request.serviceType],
            ["Address", request.address],
            ["City", request.city],
            ["Preferred Date", request.preferredDate],
            ["Created Date", request.createdDate],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
            </div>
          ))}
          <div className="md:col-span-2 rounded-md bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Problem / Requirement</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{request.problem}</p>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as ServiceStatus)} className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500">
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Assigned Technician</span>
            <select className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500">
              <option>Rajesh Technician</option>
              <option>Vikram Service Lead</option>
              <option>Not Assigned</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button type="button" onClick={onClose} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Update Request</button>
        </div>
    </AdminModalShell>
  );
}

export default function ServicesPage() {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  return (
    <AdminShell>
      <PageHeader title="Services" description="Manage frontend service requests with mock status updates." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {serviceStats.map((stat) => <StatsCard key={stat.title} {...stat} />)}
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input placeholder="Search request, customer, phone" className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 md:col-span-2" />
          <select className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none">
            <option>All Service Types</option>
            <option>RO Repair & Maintenance</option>
            <option>Filter Replacement</option>
            <option>New Installation</option>
          </select>
          <select className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none">
            <option>All Status</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-base font-bold text-slate-950">Service Request List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Request ID", "Customer", "Phone", "Service Type", "Address / City", "Preferred Date", "Status", "Created Date", "Action"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentServiceRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-5 py-4 font-bold text-slate-950">{request.id}</td>
                  <td className="px-5 py-4 text-slate-600">{request.customerName}</td>
                  <td className="px-5 py-4 text-slate-600">{request.phone}</td>
                  <td className="px-5 py-4 text-slate-600">{request.serviceType}</td>
                  <td className="px-5 py-4 text-slate-500">{request.address}, {request.city}</td>
                  <td className="px-5 py-4 text-slate-500">{request.preferredDate}</td>
                  <td className="px-5 py-4"><StatusBadge value={request.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{request.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown actions={[{ label: "View Details", icon: "view", onClick: () => setSelectedRequest(request) }]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRequest ? <ServiceDetails request={selectedRequest} onClose={() => setSelectedRequest(null)} /> : null}
    </AdminShell>
  );
}
