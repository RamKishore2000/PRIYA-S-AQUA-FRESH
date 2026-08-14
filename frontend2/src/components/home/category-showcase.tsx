import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const visibleCategories = categories.slice(0, 5);

  return (
    <section data-home-reveal className="relative bg-[#F8F3EC] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl rounded-[1rem] border border-[#EFE4D5] bg-[#FFF9F1] px-5 pb-7 pt-5 shadow-[0_10px_30px_rgba(80,58,30,0.06)]">
        <div data-reveal-item className="mb-7 flex items-center justify-center">
          <div className="grid w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-6">
            <DecorativeArrow direction="right" />
            <h2 className="whitespace-nowrap text-center font-serif text-2xl font-semibold leading-none text-[#1D2D2E] md:text-[2rem]">Top Categories</h2>
            <DecorativeArrow direction="left" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {visibleCategories.map((category) => (
            <Link key={category.id} data-reveal-item href={`/products?category=${category.slug}`} className="group grid min-h-[134px] grid-cols-[1fr_6.25rem] items-center overflow-hidden rounded-[0.8rem] border border-[#E9DDCF] bg-[#FFF8EF] px-4 py-4 shadow-[0_8px_22px_rgba(84,61,35,0.045)] transition duration-300 hover:-translate-y-0.5 hover:border-[#D6B47A] hover:bg-[#FFFDF8] hover:shadow-[0_12px_28px_rgba(182,138,69,0.12)]">
              <div className="relative z-10 min-w-0 self-center">
                <h3 className="max-w-[8.5rem] text-[0.95rem] font-black leading-6 text-[#274244]">{category.name}</h3>
                <p className="mt-5 text-xs font-black text-[#B17932]">Shop Now -&gt;</p>
              </div>
              <div className="relative h-24 w-24 justify-self-end">
                <Image src={category.image} alt={category.name} fill sizes="112px" className="object-contain object-center transition duration-500 group-hover:scale-105" unoptimized />
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
