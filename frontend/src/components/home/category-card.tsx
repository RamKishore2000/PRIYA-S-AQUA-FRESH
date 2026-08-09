import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/types/product";
import { cn } from "@/lib/utils";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group grid min-h-[116px] grid-cols-[72px_1fr_auto] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-lg md:min-h-[124px] md:px-6"
    >
      <div className={cn("relative h-16 w-16 overflow-hidden rounded-full", category.accent)}>
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="64px"
          className="object-contain p-3 transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold leading-5 text-slate-950 md:text-lg">{category.name}</h3>
        <p className="mt-1.5 text-xs font-medium text-slate-400 md:text-sm">{category.productCount}+ Models</p>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600" />
    </Link>
  );
}
