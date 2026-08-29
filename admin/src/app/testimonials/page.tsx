"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { AdminModalShell } from "@/components/admin/admin-modal-shell";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi, uploadImage } from "@/services/api";
import type { Testimonial } from "@/types/admin";

const emptyTestimonial: Testimonial = {
  id: "",
  customerName: "",
  role: "Customer",
  rating: 5,
  message: "",
  imageUrl: "",
  sortOrder: 0,
  status: "Active",
  createdDate: "",
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    adminApi.listTestimonials()
      .then(setTestimonials)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load testimonials."))
      .finally(() => setLoading(false));
  }, []);

  function openAddForm() {
    setFormMode("add");
    setSelectedTestimonial(null);
    setFormOpen(true);
  }

  function openEditForm(testimonial: Testimonial) {
    setFormMode("edit");
    setSelectedTestimonial(testimonial);
    setFormOpen(true);
  }

  async function saveTestimonial(testimonial: Testimonial) {
    try {
      const savedTestimonial = formMode === "edit"
        ? await adminApi.updateTestimonial(testimonial)
        : await adminApi.createTestimonial(testimonial);
      setTestimonials((current) =>
        formMode === "edit"
          ? current.map((item) => (item.id === savedTestimonial.id ? savedTestimonial : item))
          : [savedTestimonial, ...current],
      );
      setMessage(formMode === "edit" ? "Testimonial updated successfully." : "Testimonial added successfully.");
      setFormOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save testimonial.");
    }
  }

  function toggleStatus(testimonial: Testimonial) {
    const nextStatus = testimonial.status === "Active" ? "INACTIVE" : "ACTIVE";
    adminApi.setTestimonialStatus(testimonial.id, nextStatus)
      .then((updatedTestimonial) => {
        setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? updatedTestimonial : item)));
        setMessage(nextStatus === "ACTIVE" ? "Testimonial activated successfully." : "Testimonial deactivated successfully.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update testimonial."));
  }

  const activeCount = testimonials.filter((testimonial) => testimonial.status === "Active").length;

  return (
    <AdminShell>
      <AdminToast message={message} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">Manage brand testimonials shown on the ecommerce homepage.</p>
        </div>
        <button type="button" onClick={openAddForm} className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
          Add Testimonial
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Testimonials" value={String(testimonials.length)} trend="All customer feedback" icon="customer" />
        <StatsCard title="Active" value={String(activeCount)} trend="Visible on frontend" icon="check" />
        <StatsCard title="Inactive" value={String(testimonials.length - activeCount)} trend="Hidden from frontend" icon="alert" />
        <StatsCard title="Average Rating" value={averageRating(testimonials)} trend="Across testimonials" icon="star" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Customer", "Role", "Rating", "Message", "Sort", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-50 text-sm font-black text-teal-700 ring-1 ring-teal-100">
                        {testimonial.imageUrl ? (
                          <Image src={testimonial.imageUrl} alt={testimonial.customerName} fill className="object-cover" unoptimized />
                        ) : (
                          testimonial.customerName.slice(0, 1).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-950">{testimonial.customerName}</p>
                        <p className="text-xs text-slate-500">ID: {testimonial.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{testimonial.role || "Customer"}</td>
                  <td className="px-5 py-4 font-bold text-amber-500">{testimonial.rating.toFixed(1)} / 5</td>
                  <td className="px-5 py-4">
                    <p className="line-clamp-2 max-w-md text-slate-600">{testimonial.message}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{testimonial.sortOrder}</td>
                  <td className="px-5 py-4"><StatusBadge value={testimonial.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{testimonial.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        { label: "Edit Testimonial", icon: "edit", onClick: () => openEditForm(testimonial) },
                        { label: testimonial.status === "Active" ? "Deactivate" : "Activate", icon: "settings", onClick: () => toggleStatus(testimonial) },
                        {
                          label: "Delete Testimonial",
                          confirmItemName: "Testimonial",
                          onConfirm: () => {
                            adminApi.deleteTestimonial(testimonial.id)
                              .then(() => {
                                setTestimonials((current) => current.filter((item) => item.id !== testimonial.id));
                                setMessage("Testimonial deleted successfully.");
                              })
                              .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to delete testimonial."));
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && testimonials.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No testimonials found. Add your first testimonial.</p> : null}
        </div>
      </section>

      {formOpen ? (
        <TestimonialFormDialog
          mode={formMode}
          initialTestimonial={selectedTestimonial}
          onClose={() => setFormOpen(false)}
          onSave={saveTestimonial}
          onMessage={setMessage}
        />
      ) : null}
    </AdminShell>
  );
}

function TestimonialFormDialog({
  mode,
  initialTestimonial,
  onClose,
  onSave,
  onMessage,
}: {
  mode: "add" | "edit";
  initialTestimonial: Testimonial | null;
  onClose: () => void;
  onSave: (testimonial: Testimonial) => void;
  onMessage: (message: string) => void;
}) {
  const [form, setForm] = useState<Testimonial>(initialTestimonial || emptyTestimonial);
  const [uploading, setUploading] = useState(false);

  async function handleImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, "testimonials", 400, 400);
      setForm((current) => ({ ...current, imageUrl }));
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Unable to upload testimonial image.");
    } finally {
      setUploading(false);
    }
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <AdminModalShell labelledBy="testimonial-form-title" maxWidth="lg" onClose={onClose}>
      <form onSubmit={submitForm}>
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 id="testimonial-form-title" className="text-lg font-bold text-slate-950">
            {mode === "edit" ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Add brand feedback that appears in the frontend testimonial carousel.</p>
        </div>

        <div className="grid gap-5 px-6 py-5 md:grid-cols-[220px_1fr]">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-800">Customer Image</p>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {form.imageUrl ? (
                <Image src={form.imageUrl} alt={form.customerName || "Testimonial customer"} fill className="object-cover" unoptimized />
              ) : (
                <span className="text-sm font-semibold text-slate-400">Optional image</span>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <label className="inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                {uploading ? "Uploading..." : form.imageUrl ? "Replace" : "Upload"}
                <input disabled={uploading} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => handleImage(event.target.files?.[0])} />
              </label>
              {form.imageUrl ? (
                <button type="button" onClick={() => setForm((current) => ({ ...current, imageUrl: "" }))} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                  Remove
                </button>
              ) : null}
            </div>
            <p className="mt-2 text-xs text-slate-500">Uploads convert to WebP automatically.</p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-800">Customer Name</span>
              <input value={form.customerName} onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))} required maxLength={120} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Role</span>
                <input value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} maxLength={80} placeholder="Customer, Dealer, Business Client" className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Rating</span>
                <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))} required className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
            </div>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-800">Message</span>
              <textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} required maxLength={1000} rows={5} className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Sort Order</span>
                <input type="number" min="0" value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as Testimonial["status"] }))} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Cancel
          </button>
          <button type="submit" disabled={uploading} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60">
            {mode === "edit" ? "Save Testimonial" : "Add Testimonial"}
          </button>
        </div>
      </form>
    </AdminModalShell>
  );
}

function averageRating(testimonials: Testimonial[]) {
  if (testimonials.length === 0) return "0.0";
  const total = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
  return (total / testimonials.length).toFixed(1);
}
