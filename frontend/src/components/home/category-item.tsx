import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryItem({ category }: { category: Category }) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.slug)}`}
      className="group relative block w-[280px] shrink-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#13201d] px-4 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1 hover:border-[#12a8e6]/45 hover:bg-[#182825] hover:shadow-[0_24px_70px_rgba(0,0,0,0.38)] sm:w-[300px] lg:w-[300px]"
    >
      <span className="pointer-events-none absolute -left-10 top-1/2 h-28 w-32 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <span className="pointer-events-none absolute left-7 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#12a8e6]/20 blur-2xl transition duration-500 group-hover:bg-[#12a8e6]/35" />
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_40%,rgba(255,255,255,0.025))]" />
      <span className="relative flex min-h-[112px] items-center gap-4">
        <span className="relative block h-[104px] w-[116px] shrink-0 transition duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:scale-[1.05]">
          <span className="absolute inset-x-3 bottom-1 h-8 rounded-full bg-black/55 blur-xl transition duration-500 group-hover:bg-[#12a8e6]/25" />
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="116px"
            className="object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.42)]"
            unoptimized
          />
        </span>

        <span className="relative min-w-0 flex-1 text-left">
          <span className="block text-sm font-bold leading-5 text-[#12a8e6] transition duration-300 group-hover:text-[#49cfff]">
            {category.name}
          </span>
          <span className="mt-2 block text-xs font-semibold text-slate-200">
            {category.productCount > 0 ? `${category.productCount} Products` : "Explore Range"}
          </span>
          <span className="mt-3 flex gap-1 text-[11px] text-white/85" aria-hidden="true">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span className="text-white/35">★</span>
          </span>
        </span>
      </span>
    </Link>
  );
}
