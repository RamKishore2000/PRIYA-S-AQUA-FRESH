import { Droplets, Headphones, PackageCheck, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";

const features = [
  { title: "Advanced Purification", description: "Multi-stage filtration options for safer drinking water.", icon: Droplets },
  { title: "Reliable Products", description: "Selected purifier models for everyday dependability.", icon: ShieldCheck },
  { title: "Professional Support", description: "Product guidance and installation-first customer care.", icon: Headphones },
  { title: "Wide Product Range", description: "Home, commercial, electronics, and spare parts in one place.", icon: PackageCheck },
];

export function TrustFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <SectionHeader title="Why Choose Priya's Aqua Fresh?" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-700">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-semibold text-slate-950">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
