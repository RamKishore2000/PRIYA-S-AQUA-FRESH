import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/product";
import { cn } from "@/lib/utils";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="category-reveal group block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-600 hover:bg-emerald-600 hover:shadow-xl"
      style={{ "--category-delay": `${index * 70}ms` } as CSSProperties}
    >
      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-md transition duration-300 group-hover:bg-white", category.accent)}>
        <div className="absolute inset-x-4 bottom-3 h-10 rounded-full bg-cyan-200/30 blur-xl transition duration-500 group-hover:scale-110" />
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 80vw"
          className="object-contain p-4 transition duration-500 group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold leading-5 text-slate-950 transition group-hover:text-white md:text-base">{category.name}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-400 transition group-hover:text-emerald-50">{category.productCount} products</p>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-emerald-700">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
