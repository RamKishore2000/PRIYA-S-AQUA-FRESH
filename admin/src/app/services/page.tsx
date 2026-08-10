"use client";

import { useEffect, useState } from "react";
import { AdminModalShell } from "@/components/admin/admin-modal-shell";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi, mapServiceStatusToApi } from "@/services/api";
import type { ServiceRequest, ServiceStatus } from "@/types/admin";

const statuses: ServiceStatus[] = ["New", "Assigned", "In Progress", "Completed", "Cancelled"];

function ServiceDetails({ request, onClose, onSave }: { request: ServiceRequest; onClose: () => void; onSave: (status: ServiceStatus, technicianName: string) => void }) {
  const [status, setStatus] = useState<ServiceStatus>(request.status);
  const [technicianName, setTechnicianName] = useState("");

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
            <input value={technicianName} onChange={(event) => setTechnicianName(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" placeholder="Technician name" />
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button type="button" onClick={() => onSave(status, technicianName)} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Update Request</button>
        </div>
    </AdminModalShell>
  );
}

export default function ServicesPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminApi.listServiceRequests()
      .then(setRequests)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load service requests."));
  }, []);

  const serviceStats = [
    { title: "Total Requests", value: String(requests.length), trend: "All service requests", icon: "service" },
    { title: "New", value: String(requests.filter((item) => item.status === "New").length), trend: "Needs assignment", icon: "alert" },
    { title: "In Progress", value: String(requests.filter((item) => item.status === "In Progress").length), trend: "Technicians active", icon: "clock" },
    { title: "Completed", value: String(requests.filter((item) => item.status === "Completed").length), trend: "Finished requests", icon: "grid" },
    { title: "Cancelled", value: String(requests.filter((item) => item.status === "Cancelled").length), trend: "Review reasons", icon: "orders" },
  ];

  return (
    <AdminShell>
      <PageHeader title="Services" description="Manage frontend service requests." />
      {message ? <div className="mb-4 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700">{message}</div> : null}

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
              {requests.map((request) => (
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

      {selectedRequest ? (
        <ServiceDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSave={(status, technicianName) => {
            adminApi.updateServiceRequestStatus(selectedRequest.id, mapServiceStatusToApi(status), technicianName)
              .then((updatedRequest) => {
                setRequests((current) => current.map((item) => item.id === updatedRequest.id ? updatedRequest : item));
                setSelectedRequest(null);
                setMessage("Service request updated successfully.");
              })
              .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update service request."));
          }}
        />
      ) : null}
    </AdminShell>
  );
}
