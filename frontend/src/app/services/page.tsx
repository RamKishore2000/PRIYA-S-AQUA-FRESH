"use client";

import { CalendarCheck, Droplets, Headphones, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { SitePage } from "@/components/common/site-page";
import { ServiceRequestForm } from "@/components/services/service-request-form";
import { services } from "@/components/services/service-data";

const serviceHighlights = [
  {
    title: "Quick Response",
    description: "Service support for purifier installation, repairs, and maintenance requests.",
    icon: Headphones,
  },
  {
    title: "Genuine Care",
    description: "Filter replacement and purifier servicing focused on long-term performance.",
    icon: ShieldCheck,
  },
  {
    title: "Water Expertise",
    description: "Water quality consultation for home, business, and commercial requirements.",
    icon: Droplets,
  },
];

const serviceSteps = [
  "Select the service you need",
  "Share contact and location details",
  "Our team follows up for scheduling",
];

export default function ServicesPage() {
  return (
    <SitePage>
      <section className="relative overflow-hidden px-4 py-12 md:px-8 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(18,168,230,0.15),transparent_28%),radial-gradient(circle_at_8%_38%,rgba(45,212,191,0.08),transparent_30%),linear-gradient(112deg,#10171b_0%,#14201f_50%,#07120f_100%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#12a8e6]/25 bg-[#12a8e6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#12a8e6]">
                <Wrench className="h-4 w-4" />
                Services
              </div>
              <h1 className="mt-5 max-w-2xl font-serif text-4xl font-medium leading-[0.98] tracking-normal text-white sm:text-5xl md:text-[3.45rem]">
                Expert Care for <span className="text-[#12a8e6]">Pure Water</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                From installation and maintenance to filter replacement and commercial RO support, Priya&apos;s Aqua Fresh helps keep your purification system performing at its best.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {serviceHighlights.map((item) => (
                  <div key={item.title} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm transition duration-500 hover:border-[#12a8e6]/45 hover:bg-white/[0.065]">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#12a8e6]/12 text-[#12a8e6] transition group-hover:bg-[#12a8e6] group-hover:text-white">
                        <item.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-base font-bold text-white">{item.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-slate-300">{item.description}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-[#081311]/80 p-4 shadow-[0_26px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-6">
              <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#12a8e6]">Book a service</p>
                  <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">Tell us what you need</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-bold text-slate-200">
                  <CalendarCheck className="h-4 w-4 text-[#12a8e6]" />
                  Service Request
                </div>
              </div>
              <ServiceRequestForm compact />
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.72fr]">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#12a8e6]">What we support</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {services.map((service) => (
                  <span key={service} className="rounded-full border border-[#12a8e6]/25 bg-[#12a8e6]/10 px-4 py-2 text-sm font-bold text-slate-100">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm md:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#12a8e6]">How it works</p>
              <div className="mt-5 grid gap-3">
                {serviceSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#12a8e6] text-xs font-black text-white">
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
