"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminModalShell } from "@/components/admin/admin-modal-shell";
import type { Category, Status } from "@/types/admin";
import { generateSlug } from "@/utils/slug";

type CategoryFormState = {
  name: string;
  image: string;
  description: string;
  status: Extract<Status, "Active" | "Inactive">;
};

type CategoryFormDialogProps = {
  mode: "add" | "edit";
  open: boolean;
  initialCategory?: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
};

const inputClass = "h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
const textareaClass = "min-h-32 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

function getInitialForm(initialCategory?: Category | null): CategoryFormState {
  return {
    name: initialCategory?.name ?? "",
    image: initialCategory?.image ?? "",
    description: initialCategory?.description ?? "",
    status: initialCategory?.status ?? "Active",
  };
}

export function CategoryFormDialog({ mode, open, initialCategory, onClose, onSave }: CategoryFormDialogProps) {
  const [form, setForm] = useState<CategoryFormState>(() => getInitialForm(initialCategory));
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormState, string>>>({});

  if (!open) return null;

  function updateField<K extends keyof CategoryFormState>(field: K, value: CategoryFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function selectImage(file?: File) {
    if (!file) return;
    if (!acceptedTypes.includes(file.type)) {
      setErrors((current) => ({ ...current, image: "Use JPG, PNG, or WEBP image." }));
      return;
    }
    updateField("image", URL.createObjectURL(file));
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof CategoryFormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Category name is required.";
    if (!form.image) nextErrors.image = "Category image is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.status) nextErrors.status = "Status is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      id: initialCategory?.id ?? `cat-${Date.now()}`,
      name: form.name.trim(),
      slug: generateSlug(form.name),
      image: form.image,
      description: form.description.trim(),
      productsCount: initialCategory?.productsCount ?? 0,
      status: form.status,
      createdDate: initialCategory?.createdDate ?? "09 Aug 2026",
    });
  }

  return (
    <AdminModalShell labelledBy="category-form-title" maxWidth="lg">
      <form onSubmit={submitForm}>
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 id="category-form-title" className="text-lg font-bold text-slate-950">{mode === "edit" ? "Edit Category" : "Add Category"}</h2>
            <p className="text-sm text-slate-500">Slug is generated automatically from category name.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Close</button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Category Name</span>
            <input className={`${inputClass} mt-2`} value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="RO Water Purifiers" />
            {errors.name ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.name}</span> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select className={`${inputClass} mt-2`} value={form.status} onChange={(event) => updateField("status", event.target.value as CategoryFormState["status"])}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            {errors.status ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.status}</span> : null}
          </label>
          <div className="md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Category Image</span>
            <div className="mt-2 grid gap-3 md:grid-cols-[180px_1fr]">
              <div className="relative flex aspect-square items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                {form.image ? <Image src={form.image} alt={form.name || "Category image"} fill className="object-contain p-4" unoptimized /> : <span className="text-sm font-medium text-slate-400">No image</span>}
              </div>
              <div className="flex flex-col justify-center gap-2">
                <label className="inline-flex w-fit cursor-pointer rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                  {form.image ? "Replace Image" : "Select Image"}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selectImage(event.target.files?.[0])} />
                </label>
                {form.image ? <button type="button" onClick={() => updateField("image", "")} className="w-fit rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Remove</button> : null}
                {errors.image ? <span className="text-xs font-semibold text-red-600">{errors.image}</span> : null}
              </div>
            </div>
          </div>
          <label className="block md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea className={`${textareaClass} mt-2`} value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Enter category description..." />
            {errors.description ? <span className="mt-1 block text-xs font-semibold text-red-600">{errors.description}</span> : null}
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button type="submit" className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white">{mode === "edit" ? "Save Category" : "Add Category"}</button>
        </div>
      </form>
    </AdminModalShell>
  );
}
