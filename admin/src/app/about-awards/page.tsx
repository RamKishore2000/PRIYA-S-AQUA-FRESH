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
import type { AboutAward, SiteSettings } from "@/types/admin";

const defaultAboutImages = ["", "", "", ""];

const aboutImageSlots = [
  {
    title: "Trusted Purification Image",
    description: "Used in the first About page right-side purifier section.",
    width: 1200,
    height: 1200,
    aspect: "aspect-square",
  },
  {
    title: "Who We Are Image",
    description: "Used in the large left image beside the Who We Are content.",
    width: 1200,
    height: 1200,
    aspect: "aspect-square",
  },
  {
    title: "Leadership Image 1",
    description: "Used in the first leadership photo card.",
    width: 900,
    height: 1125,
    aspect: "aspect-[4/5]",
  },
  {
    title: "Leadership Image 2",
    description: "Used in the second leadership photo card.",
    width: 900,
    height: 1125,
    aspect: "aspect-[4/5]",
  },
];

const emptyAward: AboutAward = {
  id: "",
  title: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  status: "Active",
  createdDate: "",
};

function ensureAboutImages(images?: string[]) {
  return aboutImageSlots.map((_, index) => String(images?.[index] || defaultAboutImages[index] || "").trim());
}

function canPreviewImage(src: string) {
  return /^https?:\/\//i.test(src) || src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("/admin/");
}

function validateExactImageSize(file: File, width: number, height: number) {
  return new Promise<void>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (image.naturalWidth !== width || image.naturalHeight !== height) {
        reject(new Error(`Please upload ${width} x ${height} px image. Selected image is ${image.naturalWidth} x ${image.naturalHeight} px.`));
        return;
      }
      resolve();
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read image size."));
    };
    image.src = objectUrl;
  });
}

export default function AboutAwardsPage() {
  const [awards, setAwards] = useState<AboutAward[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [aboutImages, setAboutImages] = useState(defaultAboutImages);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingImages, setSavingImages] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, string>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedAward, setSelectedAward] = useState<AboutAward | null>(null);

  useEffect(() => {
    Promise.all([adminApi.listAboutAwards(), adminApi.getSiteSettings()])
      .then(([awardRows, siteSettings]) => {
        setAwards(awardRows);
        setSettings(siteSettings);
        setAboutImages(ensureAboutImages(siteSettings.aboutImages));
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load About page data."))
      .finally(() => setLoading(false));
  }, []);

  function openAddForm() {
    setFormMode("add");
    setSelectedAward(null);
    setFormOpen(true);
  }

  function openEditForm(award: AboutAward) {
    setFormMode("edit");
    setSelectedAward(award);
    setFormOpen(true);
  }

  async function handleAboutImageUpload(index: number, file?: File) {
    if (!file) return;
    const slot = aboutImageSlots[index];
    setUploadingImageIndex(index);
    setImageErrors((current) => ({ ...current, [index]: "" }));
    try {
      await validateExactImageSize(file, slot.width, slot.height);
      const imageUrl = await uploadImage(file, "about", slot.width, slot.height);
      setAboutImages((current) => current.map((item, itemIndex) => (itemIndex === index ? imageUrl : item)));
    } catch (error) {
      setImageErrors((current) => ({ ...current, [index]: error instanceof Error ? error.message : "Unable to upload image." }));
    } finally {
      setUploadingImageIndex(null);
    }
  }

  async function saveAboutImages() {
    if (!settings) {
      setMessage("Settings are still loading. Please try again.");
      return;
    }
    setSavingImages(true);
    try {
      const updatedSettings = await adminApi.updateSiteSettings({ ...settings, aboutImages: ensureAboutImages(aboutImages) });
      setSettings(updatedSettings);
      setAboutImages(ensureAboutImages(updatedSettings.aboutImages));
      setMessage("About page images updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update About page images.");
    } finally {
      setSavingImages(false);
    }
  }

  async function saveAward(award: AboutAward) {
    try {
      const savedAward = formMode === "edit" ? await adminApi.updateAboutAward(award) : await adminApi.createAboutAward(award);
      setAwards((current) => (formMode === "edit" ? current.map((item) => (item.id === savedAward.id ? savedAward : item)) : [savedAward, ...current]));
      setMessage(formMode === "edit" ? "Award updated successfully." : "Award added successfully.");
      setFormOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save award.");
    }
  }

  function toggleStatus(award: AboutAward) {
    const nextStatus = award.status === "Active" ? "INACTIVE" : "ACTIVE";
    adminApi.setAboutAwardStatus(award.id, nextStatus)
      .then((updatedAward) => {
        setAwards((current) => current.map((item) => (item.id === award.id ? updatedAward : item)));
        setMessage(nextStatus === "ACTIVE" ? "Award activated successfully." : "Award deactivated successfully.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to update award."));
  }

  const activeCount = awards.filter((award) => award.status === "Active").length;

  return (
    <AdminShell>
      <AdminToast message={message} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">About Page</h1>
          <p className="mt-1 text-sm text-slate-500">Manage About page images and the awards slider.</p>
        </div>
        <button type="button" onClick={openAddForm} className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
          Add Award
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">About Page Images</h2>
            <p className="mt-1 text-sm text-slate-500">These four images control the main About page sections.</p>
          </div>
          <button type="button" onClick={saveAboutImages} disabled={savingImages || loading} className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60">
            {savingImages ? "Saving..." : "Save Images"}
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {aboutImageSlots.map((slot, index) => (
            <article key={slot.title} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-4 sm:grid-cols-[170px_1fr]">
                <div className={`relative ${slot.aspect} overflow-hidden rounded-md border border-slate-200 bg-slate-50`}>
                  {aboutImages[index] && canPreviewImage(aboutImages[index]) ? (
                    <Image src={aboutImages[index]} alt={slot.title} fill className="object-cover" unoptimized />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">No image</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">{slot.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{slot.description}</p>
                  <p className="mt-2 text-xs font-bold text-slate-700">Required size: {slot.width} x {slot.height} px.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer rounded-md bg-teal-600 px-3 py-2 text-xs font-semibold text-white">
                      {uploadingImageIndex === index ? "Uploading..." : "Upload Image"}
                      <input disabled={uploadingImageIndex !== null} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => handleAboutImageUpload(index, event.target.files?.[0])} />
                    </label>
                    <button type="button" onClick={() => setAboutImages((current) => current.map((item, itemIndex) => (itemIndex === index ? defaultAboutImages[index] : item)))} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                      Clear
                    </button>
                  </div>
                  {imageErrors[index] ? <p className="mt-2 text-xs font-semibold text-red-600">{imageErrors[index]}</p> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Awards" value={String(awards.length)} trend="All award entries" icon="star" />
        <StatsCard title="Active" value={String(activeCount)} trend="Visible on About page" icon="check" />
        <StatsCard title="Inactive" value={String(awards.length - activeCount)} trend="Hidden from frontend" icon="alert" />
        <StatsCard title="Lowest Sort" value={lowestSortOrder(awards)} trend="First award shown" icon="stock" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Image", "Award", "Sort", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {awards.map((award) => (
                <tr key={award.id}>
                  <td className="px-5 py-4">
                    <div className="relative h-20 w-28 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                      {award.imageUrl && canPreviewImage(award.imageUrl) ? <Image src={award.imageUrl} alt={award.title} fill className="object-cover" unoptimized /> : <span className="flex h-full items-center justify-center px-2 text-center text-xs font-semibold text-slate-400">No image</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{award.title}</p>
                    <p className="mt-1 line-clamp-2 max-w-xl text-xs text-slate-500">{award.description}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{award.sortOrder}</td>
                  <td className="px-5 py-4"><StatusBadge value={award.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{award.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        { label: "Edit Award", icon: "edit", onClick: () => openEditForm(award) },
                        { label: award.status === "Active" ? "Deactivate" : "Activate", icon: "settings", onClick: () => toggleStatus(award) },
                        {
                          label: "Delete Award",
                          confirmItemName: "Award",
                          onConfirm: () => {
                            adminApi.deleteAboutAward(award.id)
                              .then(() => {
                                setAwards((current) => current.filter((item) => item.id !== award.id));
                                setMessage("Award deleted successfully.");
                              })
                              .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to delete award."));
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && awards.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No awards found. Add your first About page award.</p> : null}
        </div>
      </section>

      {formOpen ? (
        <AwardFormDialog
          mode={formMode}
          initialAward={selectedAward}
          onClose={() => setFormOpen(false)}
          onSave={saveAward}
        />
      ) : null}
    </AdminShell>
  );
}

function AwardFormDialog({ mode, initialAward, onClose, onSave }: { mode: "add" | "edit"; initialAward: AboutAward | null; onClose: () => void; onSave: (award: AboutAward) => void }) {
  const [form, setForm] = useState<AboutAward>(initialAward || emptyAward);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  async function handleImage(file?: File) {
    if (!file) return;
    setUploading(true);
    setImageError("");
    try {
      await validateExactImageSize(file, 1200, 900);
      const imageUrl = await uploadImage(file, "about-awards", 1200, 900);
      setForm((current) => ({ ...current, imageUrl }));
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Unable to upload award image.");
    } finally {
      setUploading(false);
    }
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <AdminModalShell labelledBy="award-form-title" maxWidth="xl" onClose={onClose}>
      <form onSubmit={submitForm}>
        <div className="border-b border-slate-100 px-6 py-5 pr-16">
          <h2 id="award-form-title" className="text-lg font-bold text-slate-950">{mode === "edit" ? "Edit Award" : "Add Award"}</h2>
          <p className="mt-1 text-sm text-slate-500">Upload one award image and short award text for the About page slider.</p>
        </div>

        <div className="grid gap-5 px-6 py-5 lg:grid-cols-[380px_1fr]">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-800">Award Image</p>
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {form.imageUrl && canPreviewImage(form.imageUrl) ? <Image src={form.imageUrl} alt={form.title || "Award image"} fill className="object-cover" unoptimized /> : <span className="px-4 text-center text-sm font-semibold text-slate-400">Upload award image</span>}
            </div>
            <div className="mt-3 flex gap-2">
              <label className="inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                {uploading ? "Uploading..." : form.imageUrl ? "Replace" : "Upload"}
                <input disabled={uploading} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => handleImage(event.target.files?.[0])} />
              </label>
              {form.imageUrl ? <button type="button" onClick={() => setForm((current) => ({ ...current, imageUrl: "" }))} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">Remove</button> : null}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Required size: 1200 x 900 px. Use landscape JPG, PNG, or WebP award photo.</p>
            {imageError ? <p className="mt-2 text-xs font-semibold text-red-600">{imageError}</p> : null}
          </div>

          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-800">Award Title</span>
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required maxLength={160} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-slate-800">Award Text</span>
              <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required rows={5} maxLength={500} className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Sort Order</span>
                <input type="number" min="0" value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500" />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-800">Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as AboutAward["status"] }))} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button type="submit" disabled={uploading || !form.imageUrl} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60">
            {mode === "edit" ? "Save Award" : "Add Award"}
          </button>
        </div>
      </form>
    </AdminModalShell>
  );
}

function lowestSortOrder(awards: AboutAward[]) {
  if (awards.length === 0) return "0";
  return String(Math.min(...awards.map((award) => award.sortOrder)));
}
