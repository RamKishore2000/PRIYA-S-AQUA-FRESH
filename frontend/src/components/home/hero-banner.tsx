import { ArrowRight, Droplets, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <section className="bg-white px-4 py-4 md:px-8 md:py-5">
      <div className="relative mx-auto min-h-[390px] max-w-7xl overflow-hidden rounded-lg bg-slate-950 md:min-h-[430px]">
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover hero-video-drift"
          src="/images/banners/mixkit-water-surface-when-ice-falls-in-slow-motion-51945-hd-ready.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/68 to-slate-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(20,184,166,0.34),transparent_28%),radial-gradient(circle_at_20%_88%,rgba(59,130,246,0.24),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/70 to-transparent" />

        <div className="relative z-10 flex min-h-[390px] items-center px-5 py-8 md:min-h-[430px] md:px-10 lg:px-12">
          <div className="max-w-3xl">
            <Badge className="hero-copy-enter mb-3 w-fit gap-2 bg-white/10 text-cyan-100 ring-1 ring-white/15 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Advanced Water Purification
            </Badge>
            <h1 className="hero-copy-enter max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Pure Water.
              <span className="block text-cyan-100">Healthier Living.</span>
            </h1>
            <p className="hero-copy-enter mt-4 max-w-xl text-base leading-7 text-slate-200 md:text-lg md:leading-7">
              RO, alkaline, commercial and spare-part solutions designed for clean, fresh and reliable drinking water.
            </p>
            <div className="hero-copy-enter mt-6 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/products" size="lg">
                Shop Now <ArrowRight className="h-5 w-5" />
              </LinkButton>
              <LinkButton
                href="/categories"
                size="lg"
                variant="secondary"
                className="border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-950"
              >
                Explore Categories
              </LinkButton>
            </div>
            <div className="hero-copy-enter mt-5 grid max-w-xl grid-cols-2 gap-3 text-sm text-slate-100 sm:grid-cols-3">
              <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur">
                <Droplets className="h-4 w-4 text-cyan-200" />
                Fresh Taste
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-cyan-200" />
                Safe Water
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur">
                <Sparkles className="h-4 w-4 text-cyan-200" />
                Expert Service
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
