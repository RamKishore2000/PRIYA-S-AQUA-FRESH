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
      <SectionHeader title="Why Choose Priya's Aqua Fresh?" variant="dark" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="group text-center">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#12a8e6]/10 text-[#12a8e6] transition duration-500 group-hover:-translate-y-1 group-hover:bg-[#12a8e6]/16">
              <span className="absolute inset-0 rounded-full border border-[#12a8e6]/25" />
              <span className="absolute inset-2 rounded-full bg-[#12a8e6]/10 blur-lg transition duration-500 group-hover:bg-[#12a8e6]/25" />
              <feature.icon className="relative h-9 w-9" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white transition group-hover:text-[#12a8e6]">{feature.title}</h3>
            <p className="mx-auto mt-2 max-w-[230px] text-sm leading-6 text-slate-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
