import { CalendarCheck, Headphones, ShieldCheck, UserCheck, Wrench } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { services } from "@/components/services/service-data";
import { ServiceRequestForm } from "@/components/services/service-request-form";

const serviceHighlights = [
  {
    title: "Quick Service",
    description: "Fast and reliable support for RO installation, repairs, maintenance, and service requests.",
    icon: Headphones,
  },
  {
    title: "Genuine Service",
    description: "Quality filter replacement and professional RO servicing for long-lasting purifier performance.",
    icon: ShieldCheck,
  },
  {
    title: "Expert Technicians",
    description: "Skilled technicians to diagnose RO problems and provide the right repair and maintenance solutions.",
    icon: UserCheck,
  },
];

const serviceSteps = [
  "Select the service you need",
  "Share contact and location details",
  "Our team follows up for scheduling",
];

export default function ServicesPage() {
  return (
    <SitePage eyebrow="Services" title="Reliable RO Service for Pure Water" description="From RO installation and regular maintenance to filter replacement, repairs, and troubleshooting, Priya's Aqua Fresh provides professional service to keep your water purifier working efficiently.">
      <section data-native-screen="services" className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C59A55]/35 bg-[#FFF9F1] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#B68A45] shadow-[0_8px_24px_rgba(84,61,35,0.06)]">
                <Wrench className="h-4 w-4" />
                Service Support
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {serviceHighlights.map((item) => (
                  <div key={item.title} className="group rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)] transition duration-500 hover:-translate-y-1 hover:border-[#D6B47A] hover:bg-[#FFFDF8]">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0A3A38]/10 text-[#0A3A38] transition group-hover:bg-[#0A3A38] group-hover:text-white">
                        <item.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-base font-black text-[#1D2D2E]">{item.title}</span>
                        <span className="mt-1 block text-sm font-semibold leading-6 text-[#5A6362]">{item.description}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[#E8DCCB] bg-[#FFF9F1] p-4 shadow-[0_18px_45px_rgba(84,61,35,0.1)] md:p-6">
              <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">Book a service</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1D2D2E]">Tell us what you need</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E5D8C7] bg-white px-4 py-2 text-sm font-black text-[#526161]">
                  <CalendarCheck className="h-4 w-4 text-[#0A3A38]" />
                  Service Request
                </div>
              </div>
              <ServiceRequestForm compact />
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.72fr]">
            <div className="rounded-[1.35rem] border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">What we support</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {services.map((service) => (
                  <span key={service} className="rounded-full border border-[#C59A55]/35 bg-[#F5E9D8] px-4 py-2 text-sm font-black text-[#526161]">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">How it works</p>
              <div className="mt-5 grid gap-3">
                {serviceSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm font-black text-[#526161]">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0A3A38] text-xs font-black text-white">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

