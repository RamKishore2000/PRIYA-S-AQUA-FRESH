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
import type { Banner } from "@/types/admin";

const emptyBanner: Banner = {
  id: "",
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  buttonText: "Explore Range",
  buttonLink: "/products",
  themeColor: "#2dd4bf",
  glowColor: "rgba(45, 212, 191, 0.34)",
  sortOrder: 0,
  status: "Active",
  createdDate: "",
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  useEffect(() => {
    adminApi.listBanners()
      .then(setBanners)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load banners."))
      .finally(() => setLoading(false));
  }, []);

  function openAddForm() {
    setFormMode("add");
    setSelectedBanner(null);
    setFormOpen(true);
  }

  function openEditForm(banner: Banner) {
    setFormMode("edit");
    setSelectedBanner(banner);
    setFormOpen(true);
  }

  async function saveBanner(banner: Banner) {
    try {
      const savedBanner = formMode === "edit"
        ? await adminApi.updateBanner(banner)
        : await adminApi.createBanner(banner);
      setBanners((current) =>
        formMode === "edit"
          ? current.map((item) => (item.id === savedBanner.id ? savedBanner : item))
          : [savedBanner, ...current],
      );
      setMessage(formMode === "edit" ? "Banner updated successfully." : "Banner added successfully.");
      setFormOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save banner.");
    }
  }

  function toggleStatus(banner: Banner) {
    const nextStatus = banner.status === "Active" ? "INACTIVE" : "ACTIVE";
    adminApi.setBannerStatus(banner.id, nextStatus)
      .then((updatedBanner) => {
        setBanners((current) => current.map((item) => (item.id === banner.id ? updatedBanner : item)));
        setMessage(nextStatus === "ACTIVE" ? "Banner activated successfully." : "Banner deactivated successfully.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update banner."));
  }

  const activeCount = banners.filter((banner) => banner.status === "Active").length;

  return (
    <AdminShell>
      <AdminToast message={message} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Banners</h1>
          <p className="mt-1 text-sm text-slate-500">Manage homepage hero banner images, copy, colors, and display order.</p>
        </div>
        <button type="button" onClick={openAddForm} className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
          Add Banner
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Banners" value={String(banners.length)} trend="All hero banners" icon="grid" />
        <StatsCard title="Active" value={String(activeCount)} trend="Visible on frontend" icon="check" />
        <StatsCard title="Inactive" value={String(banners.length - activeCount)} trend="Hidden from frontend" icon="alert" />
        <StatsCard title="Lowest Sort" value={lowestSortOrder(banners)} trend="First visible banner" icon="stock" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Image", "Banner", "Button", "Theme", "Sort", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td className="px-5 py-4">
                    <div className="relative h-20 w-28 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                      {banner.imageUrl ? (
                        <Image src={banner.imageUrl} alt={banner.title} fill className="object-contain p-2" unoptimized />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">No image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{banner.title}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{banner.description || banner.subtitle}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-700">{banner.buttonText}</p>
                    <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">{banner.buttonLink}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full border border-slate-200" style={{ backgroundColor: banner.themeColor }} />
                      <span className="text-xs font-semibold text-slate-500">{banner.themeColor}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{banner.sortOrder}</td>
                  <td className="px-5 py-4"><StatusBadge value={banner.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{banner.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        { label: "Edit Banner", icon: "edit", onClick: () => openEditForm(banner) },
                        { label: banner.status === "Active" ? "Deactivate" : "Activate", icon: "settings", onClick: () => toggleStatus(banner) },
                        {
                          label: "Delete Banner",
                          confirmItemName: "Banner",
                          onConfirm: () => {
                            adminApi.deleteBanner(banner.id)
                              .then(() => {
                                setBanners((current) => current.filter((item) => item.id !== banner.id));
                                setMessage("Banner deleted successfully.");
                              })
                              .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to delete banner."));
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && banners.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No banners found. Add your first homepage banner.</p> : null}
        </div>
      </section>

      {formOpen ? (
        <BannerFormDialog
          mode={formMode}
          initialBanner={selectedBanner}
          onClose={() => setFormOpen(false)}
          onSave={saveBanner}
          onMessage={setMessage}
        />
      ) : null}
    </AdminShell>
  );
}

function BannerFormDialog({
  mode,
  initialBanner,
  onClose,
  onSave,
  onMessage,
}: {
  mode: "add" | "edit";
  initialBanner: Banner | null;
  onClose: () => void;
  onSave: (banner: Banner) => void;
  onMessage: (message: string) => void;
}) {
  const [form, setForm] = useState<Banner>(initialBanner || emptyBanner);
  const [uploading, setUploading] = useState(false);

  async function handleImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, "banners");
      setForm((current) => ({ ...current, imageUrl }));
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Unable to upload banner image.");
    } finally {
      setUploading(false);
    }
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <AdminModalShell labelledBy="banner-form-title" maxWidth="xl">
      <form onSubmit={submitForm}>
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 id="banner-form-title" className="text-lg font-bold text-slate-950">
            {mode === "edit" ? "Edit Banner" : "Add Banner"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Upload a WebP-converted banner image and configure homepage hero content.</p>
        </div>

        <div className="grid gap-5 px-6 py-5 lg:grid-cols-[380px_1fr]">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-800">Banner Image</p>
            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {form.imageUrl ? (
                <Image src={form.imageUrl} alt={form.title || "Banner image"} fill className="object-contain p-4" unoptimized />
              ) : (
                <span className="text-sm font-semibold text-slate-400">Upload banner image</span>
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
            <p className="mt-2 text-xs text-slate-500">Recommended: transparent product/category image. Upload converts to WebP without cropping.</p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-800">Title</span>
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required maxLength={160} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-800">Subtitle</span>
              <input value={form.subtitle} onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))} maxLength={255} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-800">Description</span>
              <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} maxLength={1200} className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Button Text</span>
                <input value={form.buttonText} onChange={(event) => setForm((current) => ({ ...current, buttonText: event.target.value }))} maxLength={80} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Button Link</span>
                <input value={form.buttonLink} onChange={(event) => setForm((current) => ({ ...current, buttonLink: event.target.value }))} maxLength={255} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Theme Color</span>
                <input value={form.themeColor} onChange={(event) => setForm((current) => ({ ...current, themeColor: event.target.value }))} maxLength={40} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Glow Color</span>
                <input value={form.glowColor} onChange={(event) => setForm((current) => ({ ...current, glowColor: event.target.value }))} maxLength={80} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Sort Order</span>
                <input type="number" min="0" value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as Banner["status"] }))} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500">
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
          <button type="submit" disabled={uploading || !form.imageUrl} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60">
            {mode === "edit" ? "Save Banner" : "Add Banner"}
          </button>
        </div>
      </form>
    </AdminModalShell>
  );
}

function lowestSortOrder(banners: Banner[]) {
  if (banners.length === 0) return "0";
  return String(Math.min(...banners.map((banner) => banner.sortOrder)));
}
