"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi, uploadImage } from "@/services/api";
import type { Category, Subcategory } from "@/types/admin";

type DialogMode = "add" | "edit";

type FormState = {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  description: string;
  status: "Active" | "Inactive";
};

const emptyForm: FormState = {
  id: "",
  categoryId: "",
  name: "",
  image: "",
  description: "",
  status: "Active",
};

export default function SubcategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("add");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([adminApi.listCategories(), adminApi.listSubcategories()])
      .then(([nextCategories, nextSubcategories]) => {
        setCategories(nextCategories);
        setSubcategories(nextSubcategories);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load subcategories."))
      .finally(() => setLoading(false));
  }, []);

  const filteredSubcategories = useMemo(() => {
    if (!categoryFilter) return subcategories;
    return subcategories.filter((item) => item.categoryId === categoryFilter);
  }, [categoryFilter, subcategories]);

  function openAddDialog() {
    setDialogMode("add");
    setForm({ ...emptyForm, categoryId: categoryFilter });
    setDialogOpen(true);
  }

  function openEditDialog(subcategory: Subcategory) {
    setDialogMode("edit");
    setForm({
      id: subcategory.id,
      categoryId: subcategory.categoryId,
      name: subcategory.name,
      image: subcategory.image,
      description: subcategory.description,
      status: subcategory.status,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setForm(emptyForm);
  }

  async function uploadSubcategoryImage(file?: File) {
    if (!file) return;
    setMessage("");
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, "categories", 800, 800);
      setForm((current) => ({ ...current, image: imageUrl }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload subcategory image.");
    } finally {
      setUploading(false);
    }
  }

  async function saveSubcategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!form.categoryId || !form.name.trim()) {
      setMessage("Category and subcategory name are required.");
      return;
    }

    const selectedCategory = categories.find((category) => category.id === form.categoryId);
    const payload: Subcategory = {
      id: form.id,
      categoryId: form.categoryId,
      categoryName: selectedCategory?.name || "",
      name: form.name.trim(),
      slug: "",
      image: form.image,
      description: form.description.trim(),
      productsCount: 0,
      status: form.status,
      createdDate: "",
    };

    setSaving(true);
    try {
      const saved = dialogMode === "edit" ? await adminApi.updateSubcategory(payload) : await adminApi.createSubcategory(payload);
      setSubcategories((current) => dialogMode === "edit" ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      setMessage(dialogMode === "edit" ? "Subcategory updated successfully." : "Subcategory added successfully.");
      closeDialog();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save subcategory.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <AdminToast message={message} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Subcategories</h1>
          <p className="mt-1 text-sm text-slate-500">Manage category subgroups used in product filters and product forms.</p>
        </div>
        <button type="button" onClick={openAddDialog} className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
          Add Subcategory
        </button>
      </div>

      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block max-w-sm">
          <span className="text-sm font-semibold text-slate-700">Filter by Category</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Image", "Subcategory", "Category", "Products", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubcategories.map((subcategory) => (
                <tr key={subcategory.id}>
                  <td className="px-5 py-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                      <Image src={subcategory.image || "/admin/file.svg"} alt={subcategory.name} fill className="object-contain p-1" unoptimized />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{subcategory.name}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{subcategory.description || subcategory.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{subcategory.categoryName}</td>
                  <td className="px-5 py-4 text-slate-600">{subcategory.productsCount}</td>
                  <td className="px-5 py-4"><StatusBadge value={subcategory.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{subcategory.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        { label: "Edit Subcategory", icon: "edit", onClick: () => openEditDialog(subcategory) },
                        {
                          label: "Delete Subcategory",
                          confirmItemName: "Subcategory",
                          onConfirm: () => {
                            adminApi.deleteSubcategory(subcategory.id)
                              .then(() => {
                                setSubcategories((current) => current.filter((item) => item.id !== subcategory.id));
                                setMessage("Subcategory deleted successfully.");
                              })
                              .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to delete subcategory."));
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filteredSubcategories.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No subcategories found.</p> : null}
        </div>
      </section>

      {dialogOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 px-4 py-6">
          <form onSubmit={saveSubcategory} className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-950">{dialogMode === "edit" ? "Edit Subcategory" : "Add Subcategory"}</h2>
              <p className="mt-1 text-sm text-slate-500">Choose the parent category and enter the subcategory details.</p>
            </div>
            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Category</span>
                <select value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
                  <option value="" disabled>Select category</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Subcategory Name</span>
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="Domestic RO" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Subcategory Image</span>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                    <Image src={form.image || "/admin/file.svg"} alt="Subcategory preview" fill className="object-contain p-2" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1">
                    <input type="file" accept="image/*" onChange={(event) => uploadSubcategoryImage(event.target.files?.[0])} className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100" />
                    <p className="mt-2 text-xs font-medium text-slate-500">Recommended image size: 800 x 800 px. Square PNG, JPG, or WebP works best.</p>
                  </div>
                </div>
                {uploading ? <span className="mt-2 block text-xs font-semibold text-teal-700">Uploading image...</span> : null}
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Description</span>
                <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="Optional description" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as FormState["status"] }))} className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeDialog} className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={saving || uploading} className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60">{saving ? "Saving..." : "Save Subcategory"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}