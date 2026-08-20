"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { PageHeader } from "@/components/admin/page-header";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminApi } from "@/services/api";
import type { Category, Product } from "@/types/admin";
import { formatCurrency } from "@/utils/format-currency";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const activeProducts = products.filter((product) => product.status === "Active").length;
  const inactiveProducts = products.filter((product) => product.status === "Inactive").length;
  const filteredProducts = products.filter((product) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch = !normalizedSearch
      || product.name.toLowerCase().includes(normalizedSearch)
      || product.sku.toLowerCase().includes(normalizedSearch)
      || product.category.toLowerCase().includes(normalizedSearch)
      || product.description.toLowerCase().includes(normalizedSearch);
    const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "All Status" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  useEffect(() => {
    Promise.all([adminApi.listProducts(), adminApi.listCategories()])
      .then(([productRows, categoryRows]) => {
        setProducts(productRows);
        setCategories(categoryRows);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load products."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title="Products" description="Manage products with separate customer and dealer pricing." actionHref="/products/new" actionLabel="Add Product" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Total Products" value={String(products.length)} trend="All catalog records" icon="products" />
        <StatsCard title="Active Products" value={String(activeProducts)} trend="Visible in storefront" icon="box" />
        <StatsCard title="Inactive Products" value={String(inactiveProducts)} trend="Hidden from storefront" icon="alert" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search product name, SKU, category"
            className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none">
            <option value="All Categories">All Categories</option>
            {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none">
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All Categories");
              setStatusFilter("All Status");
            }}
            className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700"
          >
            Reset Filters
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Main Image", "Product Name", "Product Code", "Category", "Customer Price", "Dealer Price", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <div className="relative h-14 w-14 rounded-md border border-slate-200 bg-slate-50">
                      {product.images[0] ? <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2" unoptimized /> : null}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{product.name}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">{product.sku}</td>
                  <td className="px-5 py-4 text-slate-600">{product.category}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-950">{formatCurrency(product.customerSellingPrice)}</p>
                    <p className="text-xs text-slate-400 line-through">{formatCurrency(product.customerOriginalPrice)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-indigo-700">{formatCurrency(product.dealerSellingPrice)}</p>
                    <p className="text-xs text-slate-400 line-through">{formatCurrency(product.dealerOriginalPrice)}</p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge value={product.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{product.createdDate}</td>
                  <td className="px-5 py-4">
                    <RowActionsDropdown
                      actions={[
                        { label: "View Product", icon: "view" },
                        { label: "Edit Product", icon: "edit", onClick: () => router.push(`/products/${product.id}/edit`) },
                        {
                          label: "Delete Product",
                          confirmItemName: "Product",
                          onConfirm: () => {
                            adminApi.deleteProduct(product.id)
                              .then(() => {
                                setProducts((current) => current.filter((item) => item.id !== product.id));
                                setMessage("Product deleted successfully.");
                              })
                              .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to delete product."));
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && products.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No products found. Add your first product.</p> : null}
          {!loading && products.length > 0 && filteredProducts.length === 0 ? <p className="p-5 text-sm font-semibold text-slate-500">No products match the selected filters.</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}
