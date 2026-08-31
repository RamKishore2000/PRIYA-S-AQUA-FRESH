import { ProductGridSkeleton, SkeletonBlock } from "@/components/ui/skeletons";

function HeroSkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/22 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ${className}`} />;
}

export function HomeHeroSkeleton() {
  return (
    <section className="relative isolate -mt-px overflow-hidden bg-[linear-gradient(135deg,#043C5C_0%,#057FC0_46%,#12A8E6_100%)] px-4 pb-0 pt-0 text-white md:px-6 lg:px-8 lg:pb-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_50%_72%,rgba(18,168,230,0.24),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#12A8E6]/45 to-transparent" />

      <div className="relative z-10 mx-auto block max-w-md pt-4 md:max-w-2xl lg:hidden">
        <div className="grid min-h-[178px] grid-cols-[1fr_44%] items-center gap-2 overflow-hidden rounded-[1.35rem] border border-white/35 bg-white/14 px-4 py-4 shadow-[0_18px_42px_rgba(3,35,36,0.18)] backdrop-blur md:min-h-[210px] md:grid-cols-[1fr_40%] md:px-6 md:py-5">
          <div>
            <HeroSkeletonBlock className="h-3 w-24" />
            <HeroSkeletonBlock className="mt-3 h-7 w-full" />
            <HeroSkeletonBlock className="mt-2 h-7 w-4/5" />
            <HeroSkeletonBlock className="mt-4 h-10 w-28 rounded-lg bg-white/28" />
          </div>
          <HeroSkeletonBlock className="h-[142px] rounded-xl bg-white/18 md:h-[180px]" />
        </div>
        <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 justify-center gap-2 border-t border-[#D8EAF8] bg-[#FFFFFF] px-3 py-3">
          <SkeletonBlock className="h-2 w-7 rounded-full bg-[#0057C8]/80" />
          <SkeletonBlock className="h-2 w-2 rounded-full bg-[#D8C7AE]" />
          <SkeletonBlock className="h-2 w-2 rounded-full bg-[#D8C7AE]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden min-h-[560px] max-w-7xl items-center gap-8 lg:grid lg:grid-cols-[0.86fr_1.14fr]">
        <div className="relative order-2 min-h-[430px]">
          <div className="pointer-events-none absolute left-[16%] top-[10%] h-[26rem] w-[26rem] rounded-full bg-[#12A8E6]/24 blur-3xl" />
          <div className="absolute left-[32%] top-[48%] w-[52%] max-w-[360px] -translate-y-1/2 overflow-hidden rounded-[1.65rem] border border-white/28 bg-white/18 p-6 shadow-[0_18px_48px_rgba(3,35,36,0.18)] backdrop-blur-xl">
            <HeroSkeletonBlock className="mx-auto aspect-square w-[66%] rounded-2xl bg-white/24" />
            <HeroSkeletonBlock className="mt-5 h-3 w-32" />
            <HeroSkeletonBlock className="mt-3 h-8 w-4/5" />
            <HeroSkeletonBlock className="mt-4 h-9 w-28 rounded-lg" />
          </div>
          <div className="absolute left-[72%] top-[25%] w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.86] overflow-hidden rounded-[1.65rem] border border-white/20 bg-white/12 p-5 opacity-60">
            <HeroSkeletonBlock className="aspect-square w-full rounded-2xl bg-white/18" />
          </div>
        </div>
        <div className="order-1 max-w-xl py-10">
          <HeroSkeletonBlock className="h-8 w-40" />
          <HeroSkeletonBlock className="mt-5 h-16 w-full" />
          <HeroSkeletonBlock className="mt-3 h-16 w-4/5" />
          <HeroSkeletonBlock className="mt-6 h-5 w-full" />
          <HeroSkeletonBlock className="mt-3 h-5 w-3/4" />
          <div className="mt-7 flex gap-3">
            <HeroSkeletonBlock className="h-14 w-40 rounded-lg bg-white/28" />
            <HeroSkeletonBlock className="h-14 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
export function HomeCategorySkeleton() {
  return (
    <section className="relative bg-[#F3FAFF] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl px-0 lg:rounded-[1rem] lg:border lg:border-[#EFE4D5] lg:bg-[#FFFFFF] lg:px-5 lg:pb-7 lg:pt-5 lg:shadow-[0_10px_30px_rgba(80,58,30,0.06)]">
        <div className="mb-5 flex justify-center lg:mb-7">
          <SkeletonBlock className="h-8 w-56" />
        </div>
        <div className="-mx-4 flex gap-3 overflow-hidden px-4 pb-2 md:gap-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0 lg:pb-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid w-24 shrink-0 gap-2 px-1 py-1 text-center md:w-28 lg:w-auto lg:min-h-[134px] lg:grid-cols-[1fr_6.25rem] lg:items-center lg:rounded-[0.8rem] lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF] lg:px-4 lg:py-4">
              <SkeletonBlock className="order-1 mx-auto h-20 w-20 rounded-full lg:order-2 lg:h-24 lg:w-24" />
              <div className="order-2 lg:order-1">
                <SkeletonBlock className="mx-auto h-4 w-20 lg:mx-0" />
                <SkeletonBlock className="mx-auto mt-2 h-4 w-16 lg:mx-0 lg:mt-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeProductSkeleton() {
  return (
    <section className="bg-[#FFFFFF] px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-10 lg:gap-6">
          <div>
            <SkeletonBlock className="h-3 w-36" />
            <SkeletonBlock className="mt-3 h-10 w-56" />
          </div>
          <SkeletonBlock className="h-10 w-24 rounded-lg" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </section>
  );
}