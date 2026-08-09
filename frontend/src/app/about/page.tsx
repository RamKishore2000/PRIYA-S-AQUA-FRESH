import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";

export default function AboutPage() {
  return (
    <SitePage>
      <PageHeader
        eyebrow="About"
        title="About Priya's Aqua Fresh"
        description="Priya's Aqua Fresh focuses on dependable water purification products and service support for homes and businesses."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 md:grid-cols-2 md:px-8">
        {[
          ["Our Mission", "To make safer, fresher and better-tasting water accessible through reliable purification solutions."],
          ["Purification Focus", "We serve alkaline, RO, commercial RO, water softening and maintenance needs."],
          ["Customer Trust", "Our product experience is built around guidance, installation support and long-term care."],
          ["Service Commitment", "We support customers beyond purchase with service, parts and consultation."],
        ].map(([title, text]) => (
          <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{text}</p>
          </article>
        ))}
      </section>
    </SitePage>
  );
}
