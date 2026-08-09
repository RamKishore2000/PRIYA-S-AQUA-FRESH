import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="bg-white px-4 py-5 md:px-8 md:py-8">
      <div className="relative mx-auto min-h-[560px] max-w-7xl overflow-hidden rounded-lg bg-slate-950 md:min-h-[620px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(103,232,249,0.45),transparent_28%),linear-gradient(110deg,#07111f_0%,#0f2e3d_44%,#e6fffb_100%)]" />
        <div className="absolute inset-y-0 right-0 w-full opacity-95 md:w-[62%]">
          <Image
            src="/images/products/hero-purifier.svg"
            alt="Premium Priya's Aqua Fresh water purifier"
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-contain object-bottom p-6 pt-40 md:p-10 lg:p-14"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/50 to-transparent" />

        <div className="relative z-10 flex min-h-[560px] max-w-3xl flex-col justify-center px-5 py-12 md:min-h-[620px] md:px-10 lg:px-14">
          <Badge className="mb-5 w-fit gap-2 bg-white/10 text-cyan-100 ring-1 ring-white/15 backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Advanced Water Purification
          </Badge>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Pure Water. Healthier Living.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 md:text-xl md:leading-8">
            Discover advanced water purification solutions designed for safer, fresher and better-tasting water.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/products" size="lg">
              Shop Now <ArrowRight className="h-5 w-5" />
            </LinkButton>
            <LinkButton
              href="/products?category=ro-water-purifiers"
              size="lg"
              variant="secondary"
              className="border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-950"
            >
              Explore Purifiers
            </LinkButton>
          </div>
        </div>

        <div className="absolute right-5 top-5 z-10 rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg md:right-8 md:top-8">
          Up to <span className="text-teal-600">20% Off</span> Selected Purifiers
        </div>
        <div className="absolute bottom-5 right-5 z-10 hidden rounded-md bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur md:block">
          Home & Commercial Range
        </div>
      </div>
    </section>
  );
}
