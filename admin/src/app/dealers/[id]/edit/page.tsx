import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { DealerForm } from "@/components/admin/dealer-form";
import { PageHeader } from "@/components/admin/page-header";
import { dealers } from "@/data/admin";

export default async function EditDealerPage({ params }: PageProps<"/dealers/[id]/edit">) {
  const { id } = await params;
  const dealer = dealers.find((item) => item.id === id);
  if (!dealer) notFound();

  return (
    <AdminShell>
      <PageHeader title="Edit Dealer" description={`Update ${dealer.name}'s dealer account.`} />
      <DealerForm mode="edit" initialDealer={dealer} />
    </AdminShell>
  );
}
