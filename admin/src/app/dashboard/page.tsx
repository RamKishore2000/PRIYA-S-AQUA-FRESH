import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { RowActionsDropdown } from "@/components/admin/row-actions-dropdown";
import { StatsCard } from "@/components/admin/stats-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { dashboardStats, recentOrders, recentServiceRequests, salesOverview } from "@/data/admin";

function money(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function ChartCard() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-950">Sales Overview</h2>
          <p className="text-sm text-slate-500">Revenue, customer sales, and dealer sales</p>
        </div>
      </div>
      <div className="flex h-56 items-end gap-4">
        {salesOverview.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end justify-center gap-1">
              <span className="w-3 rounded-t bg-teal-600" style={{ height: `${item.revenue}%` }} />
              <span className="w-3 rounded-t bg-slate-900" style={{ height: `${item.customer}%` }} />
              <span className="w-3 rounded-t bg-cyan-300" style={{ height: `${item.dealer}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-500">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
        <span><b className="mr-1 inline-block h-2 w-2 rounded-full bg-teal-600" />Revenue</span>
        <span><b className="mr-1 inline-block h-2 w-2 rounded-full bg-slate-900" />Customer</span>
        <span><b className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-300" />Dealer</span>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <AdminShell>
      <PageHeader title="Dashboard" description="Overview of sales, orders, customers, dealers, and services." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => <StatsCard key={stat.title} {...stat} />)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <ChartCard />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-950">Orders Overview</h2>
          <div className="mt-6 space-y-4">
            {[
              ["Completed", 68, "bg-emerald-500"],
              ["Pending", 18, "bg-amber-500"],
              ["Cancelled", 8, "bg-red-500"],
              ["Shipped", 32, "bg-blue-500"],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm font-semibold text-slate-600"><span>{label}</span><span>{value}%</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-500">User Distribution</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">1,334 users</p>
            <p className="mt-1 text-sm text-slate-500">1,248 customers and 86 dealers</p>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-base font-bold text-slate-950">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Order ID", "Customer / Dealer", "Role", "Amount", "Payment", "Order Status", "Date", "Action"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4 font-bold text-slate-950">{order.id}</td>
                  <td className="px-5 py-4 text-slate-600">{order.buyerName}</td>
                  <td className="px-5 py-4"><StatusBadge value={order.role} /></td>
                  <td className="px-5 py-4 font-semibold">{money(order.amount)}</td>
                  <td className="px-5 py-4"><StatusBadge value={order.payment} /></td>
                  <td className="px-5 py-4"><StatusBadge value={order.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{order.date}</td>
                  <td className="px-5 py-4"><RowActionsDropdown actions={[{ label: "View", icon: "view" }]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-base font-bold text-slate-950">Recent Service Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{["Request ID", "Customer Name", "Phone", "Service Type", "Status", "Requested Date", "Action"].map((header) => <th key={header} className="px-5 py-3 font-bold">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentServiceRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-5 py-4 font-bold text-slate-950">{request.id}</td>
                  <td className="px-5 py-4 text-slate-600">{request.customerName}</td>
                  <td className="px-5 py-4 text-slate-600">{request.phone}</td>
                  <td className="px-5 py-4 text-slate-600">{request.serviceType}</td>
                  <td className="px-5 py-4"><StatusBadge value={request.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{request.preferredDate}</td>
                  <td className="px-5 py-4"><RowActionsDropdown actions={[{ label: "View", icon: "view" }]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
