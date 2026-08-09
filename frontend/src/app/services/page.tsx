"use client";

import { SitePage } from "@/components/common/site-page";
import { PageHeader } from "@/components/common/page-header";
import { ServiceRequestForm } from "@/components/services/service-request-form";
import { services } from "@/components/services/service-data";

export default function ServicesPage() {
  return (
    <SitePage>
      <PageHeader
        eyebrow="Services"
        title="Professional Water Purifier Services"
        description="From installation and maintenance to filter replacement and commercial RO support, our team is here to help keep your purification system performing at its best."
      />
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-600">What we support</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {services.map((service) => (
              <span key={service} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                {service}
              </span>
            ))}
          </div>
        </div>
        <ServiceRequestForm />
      </section>
    </SitePage>
  );
}
