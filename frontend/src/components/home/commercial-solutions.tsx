import { ArrowRight, Headphones } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const capacities = ["25 LPH", "50 LPH", "100 LPH", "250 LPH", "500 LPH", "1000 LPH", "2000 LPH"];

export function CommercialSolutions() {
  return (
    <section className="bg-slate-950 py-14 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Commercial Solutions</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">Powerful Purification for Business</h2>
            <p className="mt-5 text-base leading-7 text-slate-300">
              High-capacity RO solutions for offices, hotels, schools, hospitals and commercial facilities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/commercial" variant="primary">Explore Commercial RO <ArrowRight className="h-4 w-4" /></LinkButton>
              <LinkButton href="/contact" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950">
                <Headphones className="h-4 w-4" /> Talk to an Expert
              </LinkButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {capacities.map((capacity) => (
              <div key={capacity} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <p className="text-2xl font-bold text-teal-200">{capacity}</p>
                <p className="mt-2 text-sm text-slate-300">Capacity option</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
