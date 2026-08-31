export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#D8EAF8] ${className}`} />;
}

function ProductCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[0.9rem] border border-[#D8EAF8] bg-[#FFFFFF] text-center shadow-[0_8px_24px_rgba(0,87,200,0.07)]">
      <div className="relative isolate h-48 overflow-hidden md:h-52 lg:h-56">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative block aspect-square w-full max-w-[12.25rem] overflow-hidden bg-[#F7F0E7] md:max-w-[13.25rem] lg:max-w-[14.5rem]">
            <SkeletonBlock className="absolute left-0 top-4 h-6 w-20 rounded-none" />
            <span className="absolute inset-x-8 bottom-4 h-12 rounded-[100%] bg-black/10 blur-xl" />
            <SkeletonBlock className="absolute inset-5 rounded-xl" />
            <SkeletonBlock className="absolute bottom-3 right-3 h-6 w-16 rounded-md" />
          </div>
        </div>
        <span className="absolute right-2 top-2 z-30 flex flex-col gap-1.5 lg:right-4 lg:top-4 lg:gap-2">
          <SkeletonBlock className="h-8 w-8 rounded-lg lg:h-9 lg:w-9" />
          <SkeletonBlock className="h-8 w-8 rounded-lg lg:h-9 lg:w-9" />
        </span>
      </div>

      <div className="mx-auto max-w-[18rem] px-2 pb-2 pt-1 lg:px-4 lg:pb-4 lg:pt-2">
        <SkeletonBlock className="mx-auto h-3 w-20" />
        <div className="mt-1 min-h-[1.9rem] lg:mt-2">
          <SkeletonBlock className="mx-auto h-3.5 w-11/12 md:h-4" />
          <SkeletonBlock className="mx-auto mt-1.5 h-3.5 w-8/12 md:h-4 lg:hidden" />
        </div>
        <div className="mt-1 flex items-end justify-center gap-2 lg:mt-2">
          <SkeletonBlock className="h-5 w-16 md:h-6 lg:h-8 lg:w-20" />
          <SkeletonBlock className="h-3 w-12 lg:h-4" />
        </div>
        <div className="mx-auto mt-1.5 grid max-w-[15rem] grid-cols-2 gap-1.5 lg:mt-3 lg:gap-2">
          <SkeletonBlock className="h-8 rounded-lg lg:h-10" />
          <SkeletonBlock className="h-8 rounded-lg lg:h-10" />
        </div>
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: { count?: number; columns?: 3 | 4 }) {
  return (
    <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 ${columns === 3 ? "lg:gap-8 xl:grid-cols-3" : "lg:grid-cols-4 lg:gap-8"}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductListingSkeleton() {
  return (
    <section className="px-5 pb-20 md:px-8">
      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[18rem_1fr]">
        <aside className="hidden h-max self-start rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:sticky lg:top-24 lg:block">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-7 w-24" />
            <SkeletonBlock className="h-4 w-12" />
          </div>
          <SkeletonFilterSection rows={5} />
          <section className="mt-6 border-t border-[#D8EAF8] pt-6">
            <SkeletonBlock className="mb-4 h-3 w-28" />
            <div className="mb-4 flex items-center justify-between">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
            <SkeletonBlock className="h-8 w-full rounded-full" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-14 rounded-lg" />
              <SkeletonBlock className="h-14 rounded-lg" />
            </div>
          </section>
          <SkeletonFilterSection rows={2} />
          <SkeletonFilterSection rows={3} />
        </aside>

        <div className="min-w-0">
          <div className="fixed left-0 top-1/2 z-40 inline-flex -translate-y-1/2 items-center gap-2 rounded-r-full border border-l-0 border-[#C7E4F8] bg-[#0057C8] px-3.5 py-2.5 shadow-[0_10px_24px_rgba(0,87,200,0.16)] lg:hidden">
            <SkeletonBlock className="h-4 w-4 rounded bg-white/35" />
            <SkeletonBlock className="h-3 w-12 bg-white/35" />
          </div>
          <div className="mb-4 flex items-center justify-between gap-3 bg-transparent p-0 lg:mb-8 lg:flex-wrap lg:rounded-2xl lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF]/95 lg:p-5 lg:shadow-[0_10px_30px_rgba(0,87,200,0.07)] lg:backdrop-blur">
            <SkeletonBlock className="h-5 w-24" />
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-4 w-14" />
              <SkeletonBlock className="h-9 w-36 rounded-lg lg:h-11 lg:rounded-xl" />
            </div>
          </div>
          <ProductGridSkeleton count={6} columns={3} />
        </div>
      </div>
    </section>
  );
}

function SkeletonFilterSection({ rows }: { rows: number }) {
  return (
    <section className="mt-6 border-t border-[#D8EAF8] pt-6">
      <SkeletonBlock className="mb-3 h-3 w-28" />
      <div className="grid gap-2">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonBlock key={index} className="h-11 rounded-xl" />
        ))}
      </div>
    </section>
  );
}

export function ProductDetailSkeleton() {
  return (
    <section className="px-4 pb-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-4 hidden flex-wrap items-center gap-2 md:flex lg:mb-6">
          <SkeletonBlock className="h-3 w-12" />
          <SkeletonBlock className="h-3 w-2 rounded-full" />
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-2 rounded-full" />
          <SkeletonBlock className="h-3 w-32" />
        </nav>

        <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-8">
          <div className="grid gap-4 lg:gap-5">
            <div className="grid gap-3 md:grid-cols-[5.5rem_1fr] lg:gap-4">
              <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:pb-0">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-20 w-20 shrink-0 rounded-2xl" />
                ))}
              </div>
              <div className="relative min-h-[20rem] overflow-hidden rounded-2xl border-0 bg-transparent shadow-none md:min-h-[24rem] lg:min-h-[28rem] lg:rounded-[2rem] lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF] lg:shadow-[0_24px_70px_rgba(0,87,200,0.12)]">
                <span className="absolute inset-x-16 bottom-10 h-16 rounded-full bg-[#0057C8]/10 blur-2xl" />
                <SkeletonBlock className="absolute inset-5 rounded-[1.25rem] md:inset-6 lg:inset-8" />
                <div className="absolute right-3 top-3 z-20 flex gap-2 lg:hidden">
                  <SkeletonBlock className="h-10 w-10 rounded-full" />
                  <SkeletonBlock className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
            <div className="rounded-none border-0 bg-transparent p-0 shadow-none lg:rounded-2xl lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF] lg:p-5 lg:shadow-[0_14px_42px_rgba(0,87,200,0.08)]">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="mt-5 h-4 w-full" />
              <SkeletonBlock className="mt-3 h-4 w-11/12" />
              <SkeletonBlock className="mt-3 h-4 w-10/12" />
              <SkeletonBlock className="mt-6 h-4 w-36" />
              <SkeletonBlock className="mt-3 h-4 w-full" />
              <SkeletonBlock className="mt-3 h-4 w-9/12" />
            </div>
          </div>

          <div className="rounded-none border-0 bg-transparent p-0 shadow-none md:p-0 lg:sticky lg:top-28 lg:rounded-2xl lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF] lg:p-6 lg:shadow-[0_18px_60px_rgba(0,87,200,0.08)]">
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="mt-3 h-8 w-11/12 lg:h-10" />
            <SkeletonBlock className="mt-2 h-8 w-8/12 lg:h-10" />
            <div className="mt-3 flex items-center gap-2">
              <SkeletonBlock className="h-7 w-16 rounded-full" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
            <div className="mt-4 flex items-end gap-3 lg:mt-5">
              <SkeletonBlock className="h-9 w-28 lg:h-11 lg:w-36" />
              <SkeletonBlock className="h-5 w-20" />
            </div>
            <div className="mt-5 border-y border-[#D8EAF8] py-4 lg:mt-7 lg:py-5">
              <SkeletonBlock className="h-5 w-56" />
              <SkeletonBlock className="mt-3 h-5 w-44" />
            </div>
            <div className="mt-5 grid gap-3">
              <SkeletonBlock className="h-12 rounded-xl" />
              <SkeletonBlock className="h-12 rounded-xl" />
            </div>
            <div className="mt-5 grid gap-2 pb-16 lg:mt-6 lg:gap-3 lg:pb-0">
              <SkeletonBlock className="h-12 rounded-xl" />
              <SkeletonBlock className="h-12 rounded-xl" />
              <SkeletonBlock className="h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="min-h-[180px] rounded-[1.35rem] border border-[#D8EAF8] bg-[#FFFFFF] p-5 shadow-[0_14px_42px_rgba(0,87,200,0.08)]">
          <div className="flex h-full items-center gap-5">
            <SkeletonBlock className="h-32 w-36 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="mt-4 h-6 w-4/5" />
              <SkeletonBlock className="mt-3 h-4 w-3/5" />
              <SkeletonBlock className="mt-5 h-4 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="grid grid-cols-[4.75rem_1fr] gap-3 rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-3 shadow-[0_10px_30px_rgba(0,87,200,0.07)] sm:grid-cols-[96px_1fr_auto] sm:gap-4 sm:p-4">
          <SkeletonBlock className="h-20 w-20 rounded-xl sm:h-24 sm:w-24" />
          <div className="min-w-0">
            <SkeletonBlock className="h-5 w-48 max-w-full" />
            <SkeletonBlock className="mt-3 h-4 w-64 max-w-full" />
            <SkeletonBlock className="mt-2 h-3 w-40 max-w-full" />
          </div>
          <div className="col-span-2 flex flex-row items-center justify-between gap-3 border-t border-[#D8EAF8] pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0">
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-10 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
