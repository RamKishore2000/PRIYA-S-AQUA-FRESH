import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const visibleCategories = categories.slice(0, 5);

  if (!visibleCategories.length) return null;

  return (
    <section data-home-reveal className="relative bg-[#F8F3EC] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl rounded-[1rem] border border-[#EFE4D5] bg-[#FFF9F1] px-4 pb-5 pt-5 shadow-[0_10px_30px_rgba(80,58,30,0.06)] lg:px-5 lg:pb-7">
        <div data-reveal-item className="mb-5 flex items-center justify-between gap-4 lg:mb-7 lg:justify-center">
          <div className="grid w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-6">
            <DecorativeArrow direction="right" />
            <h2 className="whitespace-nowrap text-center font-serif text-2xl font-semibold leading-none text-[#1D2D2E] md:text-[2rem]">Top Categories</h2>
            <DecorativeArrow direction="left" />
          </div>
          <Link href="/categories" className="shrink-0 text-xs font-black text-[#9B7137] lg:hidden">More</Link>
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:gap-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {visibleCategories.map((category) => (
            <Link key={category.id} data-reveal-item href={`/products?category=${category.slug}`} className="group grid w-28 shrink-0 gap-2 overflow-hidden rounded-[0.8rem] border border-[#E9DDCF] bg-[#FFF8EF] px-3 py-3 text-center shadow-[0_8px_22px_rgba(84,61,35,0.045)] transition duration-300 hover:-translate-y-0.5 hover:border-[#D6B47A] hover:bg-[#FFFDF8] hover:shadow-[0_12px_28px_rgba(182,138,69,0.12)] md:w-32 lg:w-auto lg:min-h-[134px] lg:grid-cols-[1fr_6.25rem] lg:items-center lg:px-4 lg:py-4 lg:text-left">
              <div className="relative order-1 mx-auto h-20 w-20 lg:order-2 lg:h-24 lg:w-24 lg:justify-self-end">
                <Image src={category.image} alt={category.name} fill sizes="112px" className="object-contain object-center transition duration-500 group-hover:scale-105" unoptimized />
              </div>
              <div className="relative z-10 order-2 min-w-0 self-center lg:order-1">
                <h3 className="line-clamp-2 text-xs font-black leading-4 text-[#274244] lg:max-w-[8.5rem] lg:text-[0.95rem] lg:leading-6">{category.name}</h3>
                <p className="mt-5 hidden text-xs font-black text-[#B17932] lg:block">Shop Now -&gt;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DecorativeArrow({ direction }: { direction: "left" | "right" }) {
  const flip = direction === "left" ? "scale-x-[-1]" : "";

  return (
    <span className={`flex min-w-0 items-center ${direction === "right" ? "justify-end" : "justify-start"}`}>
      <svg className={`h-3 w-full max-w-28 text-[#C59A55] ${flip}`} viewBox="0 0 128 14" fill="none" aria-hidden="true">
        <path d="M1 7L15 1V5.6H113V1L127 7L113 13V8.4H15V13L1 7Z" fill="currentColor" />
      </svg>
    </span>
  );
}
