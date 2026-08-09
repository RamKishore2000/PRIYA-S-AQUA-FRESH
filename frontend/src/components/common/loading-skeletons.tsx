import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="mt-4 h-4 w-20" />
      <Skeleton className="mt-3 h-5 w-full" />
      <Skeleton className="mt-3 h-4 w-28" />
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="mt-4 h-5 w-3/4" />
    </div>
  );
}

export function PageSectionSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
