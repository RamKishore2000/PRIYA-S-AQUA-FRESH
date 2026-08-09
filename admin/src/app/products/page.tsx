import Image from "next/image";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { categories, products } from "@/data/admin";
import { formatCurrency } from "@/utils/format-currency";

export default function ProductsPage() {
  const activeProducts = products.filter((product) => product.status === "Active").length;
  const inactiveProducts = products.filter((product) => product.status === "Inactive").length;

  return (
    <AdminShell>
      <PageHeader title="Products" description="Manage products with separate customer and dealer pricing." actionHref="/products/new" actionLabel="Add Product" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Total Products" value={String(products.length)} trend="All catalog records" icon="products" />
        <StatsCard title="Active Products" value={String(activeProducts)} trend="Visible in storefront" icon="box" />
        <StatsCard title="Inactive Products" value={String(inactiveProducts)} trend="Hidden from storefront" icon="alert" />
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input placeholder="Search products" className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          <select className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none">
            <option>All Categories</option>
            {categories.map((category) => <option key={category.id}>{category.name}</option>)}
          </select>
          <select className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none"><option>All Status</option><option>Active</option><option>Inactive</option></select>
          <button className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700">Reset Filters</button>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Main Image", "Product Name", "Product Code", "Category", "Customer Price", "Dealer Price", "Status", "Created Date", "Actions"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <div className="relative h-14 w-14 rounded-md border border-slate-200 bg-slate-50">
                      <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2" />
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
                        { label: "Edit Product", icon: "edit" },
                        { label: "Duplicate Product", icon: "duplicate", tone: "accent" },
                        { label: "Delete Product", confirmItemName: "Product" },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
