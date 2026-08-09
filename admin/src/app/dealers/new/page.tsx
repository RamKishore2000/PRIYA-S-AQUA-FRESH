import { AdminShell } from "@/components/admin/admin-shell";
import { DealerForm } from "@/components/admin/dealer-form";
import { PageHeader } from "@/components/admin/page-header";

export default function AddDealerPage() {
  return (
    <AdminShell>
      <PageHeader title="Add Dealer" description="Create a dealer account from the admin panel." />
      <DealerForm />
    </AdminShell>
  );
}
