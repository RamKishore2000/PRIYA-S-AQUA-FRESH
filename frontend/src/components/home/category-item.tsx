import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryItem({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block w-[164px] shrink-0 text-center sm:w-[184px] md:w-[204px]"
    >
      <span className="pointer-events-none absolute left-1/2 top-8 h-28 w-32 -translate-x-1/2 rounded-full bg-[#12a8e6] opacity-0 blur-3xl transition duration-700 group-hover:opacity-30" />
      <span className="relative mx-auto block h-[150px] w-[164px] overflow-visible transition duration-700 group-hover:-translate-y-1.5 sm:h-[168px] sm:w-[184px] md:h-[184px] md:w-[204px]">
        <span className="absolute inset-x-4 bottom-1 h-10 rounded-[999px] bg-black/50 blur-2xl transition duration-700 group-hover:scale-105 group-hover:bg-[#12a8e6]/25" />
        <span className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.16),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.018)_55%,rgba(255,255,255,0.06))] shadow-[0_28px_70px_rgba(0,0,0,0.28)] transition duration-700 group-hover:shadow-[0_34px_90px_rgba(0,0,0,0.38)]" />
        <span className="absolute inset-[10px] overflow-hidden rounded-[1.55rem] bg-[#0e1114]">
          <span className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/30 opacity-80" />
        </span>
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(min-width: 768px) 204px, 184px"
          className="absolute inset-[10px] z-10 rounded-[1.55rem] object-cover transition duration-700 group-hover:scale-[1.035]"
          unoptimized
        />
        <span className="absolute inset-[10px] z-20 rounded-[1.55rem] bg-gradient-to-t from-black/22 via-transparent to-white/8 opacity-80 transition duration-700 group-hover:opacity-45" />
      </span>
      <span className="mx-auto mt-4 block max-w-[190px] text-sm font-bold leading-5 text-[#12a8e6] transition duration-300 md:text-[15px]">
        {category.name}
      </span>
      <span className="mx-auto mt-2 block h-px w-8 bg-white/10 transition duration-500 group-hover:w-16 group-hover:bg-[#12a8e6]" />
    </Link>
  );
}
