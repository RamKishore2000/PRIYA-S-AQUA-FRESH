"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatusBadge } from "@/components/admin/status-badge";
import { categories as initialCategories } from "@/data/admin";
import type { Category } from "@/types/admin";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState("");

  function openAddDialog() {
    setDialogMode("add");
    setSelectedCategory(null);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setSelectedCategory(null);
  }

  function saveCategory(category: Category) {
    setCategories((current) =>
      dialogMode === "edit"
        ? current.map((item) => (item.id === category.id ? category : item))
        : [category, ...current],
    );
    setMessage(dialogMode === "edit" ? "Category updated successfully." : "Category added successfully.");
    closeDialog();
  }

  function editCategory(category: Category) {
    setDialogMode("edit");
    setSelectedCategory(category);
    setDialogOpen(true);
  }

  return (
    <AdminShell>
      <AdminToast message={message} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Manage catalog categories shown across the ecommerce store.</p>
        </div>
        <button type="button" onClick={openAddDialog} className="inline-flex h-10 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
          Add Category
        </button>
      </div>

      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Category List</h2>
        <p className="text-sm text-slate-500">Use Add Category or row actions for mock admin interactions.</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Image", "Category Name", "Products Count", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-5 py-4">
                    <div className="relative h-12 w-12 rounded-md border border-slate-200 bg-slate-50">
                      <Image src={category.image} alt={category.name} fill className="object-contain p-2" unoptimized={category.image.startsWith("blob:")} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{category.name}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{category.description}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{category.productsCount}</td>
                  <td className="px-5 py-4"><StatusBadge value={category.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{category.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        { label: "View Products", icon: "view", onClick: () => router.push(`/products?category=${category.slug}`) },
                        { label: "Edit Category", icon: "edit", onClick: () => editCategory(category) },
                        {
                          label: "Delete Category",
                          confirmItemName: "Category",
                          onConfirm: () => {
                            setCategories((current) => current.filter((item) => item.id !== category.id));
                            setMessage("Category deleted successfully.");
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CategoryFormDialog
        key={`${dialogOpen ? "open" : "closed"}-${dialogMode}-${selectedCategory?.id ?? "new"}`}
        mode={dialogMode}
        open={dialogOpen}
        initialCategory={selectedCategory}
        onClose={closeDialog}
        onSave={saveCategory}
      />
    </AdminShell>
  );
}
