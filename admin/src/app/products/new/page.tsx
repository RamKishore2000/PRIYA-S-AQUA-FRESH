import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";

export default function AddProductPage() {
  return (
    <AdminShell>
      <PageHeader title="Add Product" description="Create a new product for customer and dealer catalogues." />
      <ProductForm />
    </AdminShell>
  );
}
