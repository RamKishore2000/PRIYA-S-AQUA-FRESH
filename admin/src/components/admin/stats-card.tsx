import { Icon } from "@/components/admin/icon";

export function StatsCard({ title, value, trend, icon }: { title: string; value: string; trend: string; icon: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        <Icon name={icon} />
      </div>
      <p className="mt-4 text-xs font-medium text-teal-700">{trend}</p>
    </article>
  );
}
