import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { dealers } from "@/data/admin";
import { formatCurrency } from "@/utils/format-currency";

export default async function DealerDetailsPage({ params }: PageProps<"/dealers/[id]">) {
  const { id } = await params;
  const dealer = dealers.find((item) => item.id === id);
  if (!dealer) notFound();

  const rows = [
    ["Dealer Name", dealer.name],
    ["Business Name", dealer.businessName],
    ["Dealer Code", dealer.dealerCode],
    ["Mobile", dealer.mobile],
    ["Email", dealer.email],
    ["GST Number", dealer.gstNumber],
    ["Address", dealer.address],
    ["City", dealer.city],
    ["State", dealer.state],
    ["Pincode", dealer.pincode],
    ["Created Date", dealer.createdDate],
    ["Total Orders", String(dealer.totalOrders)],
    ["Total Purchase Value", formatCurrency(dealer.totalPurchaseValue)],
  ];

  return (
    <AdminShell>
      <PageHeader title={dealer.name} description="Dealer account details and access information." actionHref="/dealers" actionLabel="Back to Dealers" />
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-950">Dealer Details</h2>
          <StatusBadge value={dealer.status} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-md bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
