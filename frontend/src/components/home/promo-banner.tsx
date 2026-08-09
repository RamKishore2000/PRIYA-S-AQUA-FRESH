import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="bg-slate-50 py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:px-8 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">Advanced Alkaline Water Purification</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">More Than Purified Water</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Advanced filtration combined with balanced alkaline water for everyday freshness.
          </p>
          <div className="mt-7">
            <LinkButton href="/products?category=alkaline-water-purifiers">
              Explore Alkaline Range <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
        <div className="relative order-1 min-h-[300px] rounded-lg bg-white shadow-sm lg:order-2">
          <Image src="/images/products/stell-guard.svg" alt="Alkaline water purifier" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-8" />
        </div>
      </div>
    </section>
  );
}
