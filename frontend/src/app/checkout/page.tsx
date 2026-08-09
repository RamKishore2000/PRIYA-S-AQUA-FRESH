import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";
import { LinkButton } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <SitePage>
      <PageHeader title="Checkout" description="Checkout is a frontend placeholder until payment and backend integration are added." />
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Checkout coming next</h2>
          <p className="mt-3 leading-7 text-slate-600">Payment and order APIs are intentionally not implemented in this frontend phase.</p>
          <LinkButton href="/products" className="mt-5">Back to Shop</LinkButton>
        </div>
      </section>
    </SitePage>
  );
}
