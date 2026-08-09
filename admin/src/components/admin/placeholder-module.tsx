import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";

export function PlaceholderModule({ title }: { title: string }) {
  return (
    <AdminShell>
      <PageHeader title={title} description={`${title} management will be implemented in the next admin phase.`} />
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Coming Next</p>
        <h2 className="mt-3 text-xl font-bold text-slate-950">{title} module</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          This route is intentionally available now so the sidebar flow does not show a missing page while the module is completed later.
        </p>
      </section>
    </AdminShell>
  );
}
