import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product";

const preferredCategoryOrder = [
  "ro-water-purifiers",
  "ro-water-purifier",
  "alkaline-water-purifiers",
  "alkaline-water-purifier",
  "commercial-water-purifiers",
  "commercial-water-purifier",
  "commercial-ro",
  "water-softeners",
  "water-softener",
  "spare-parts",
  "spear-parts",
  "geysers",
  "geyser",
  "geser",
  "smart-tv",
  "smart-tvs",
];

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const visibleCategories = getOrderedCategories(categories);

  if (!visibleCategories.length) return null;

  return (
    <section data-home-reveal className="relative bg-[#F8F3EC] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl px-0 pb-0 pt-0 lg:rounded-[1rem] lg:border lg:border-[#EFE4D5] lg:bg-[#FFF9F1] lg:px-5 lg:pb-7 lg:pt-5 lg:shadow-[0_10px_30px_rgba(80,58,30,0.06)]">
        <div data-reveal-item className="mb-5 flex items-center justify-between gap-4 lg:mb-7 lg:justify-center">
          <div className="grid w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-6">
            <DecorativeArrow direction="right" />
            <h2 className="whitespace-nowrap text-center font-serif text-2xl font-semibold leading-none text-[#1D2D2E] md:text-[2rem]">Top Categories</h2>
            <DecorativeArrow direction="left" />
          </div>
          <Link href="/categories" className="shrink-0 text-xs font-black text-[#9B7137] lg:hidden">More</Link>
        </div>

        <div data-home-category-row className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:gap-4 lg:mx-0 lg:overflow-x-auto lg:px-0 lg:pb-1">
          {visibleCategories.map((category) => (
            <Link key={category.id} data-reveal-item data-home-category-card href={`/products?category=${category.slug}`} className="group grid w-24 shrink-0 gap-2 overflow-visible rounded-none border-0 bg-transparent px-1 py-1 text-center shadow-none transition duration-300 hover:-translate-y-0.5 md:w-28 lg:min-h-[134px] lg:grid-cols-[1fr_6.25rem] lg:items-center lg:overflow-hidden lg:rounded-[0.8rem] lg:border lg:border-[#E9DDCF] lg:bg-[#FFF8EF] lg:px-4 lg:py-4 lg:text-left lg:shadow-[0_8px_22px_rgba(84,61,35,0.045)] lg:hover:border-[#D6B47A] lg:hover:bg-[#FFFDF8] lg:hover:shadow-[0_12px_28px_rgba(182,138,69,0.12)]">
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

        {visibleCategories.length > 2 ? (
          <div data-home-scroll-cue className="mt-1 flex justify-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-5 rounded-full bg-[#0A3A38]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#CDBB9C]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#CDBB9C]" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function getOrderedCategories(categories: Category[]) {
  const used = new Set<string>();
  const ordered: Category[] = [];

  for (const slug of preferredCategoryOrder) {
    const category = categories.find((item) => !used.has(item.id) && (normalizeSlug(item.slug) === slug || normalizeSlug(item.name) === slug));
    if (category) {
      ordered.push(category);
      used.add(category.id);
    }
  }

  return [...ordered, ...categories.filter((category) => !used.has(category.id))];
}

function normalizeSlug(value?: string | null) {
  return decodeURIComponent(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
