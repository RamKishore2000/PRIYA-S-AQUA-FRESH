import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryItem({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block w-[164px] shrink-0 text-center sm:w-[184px] md:w-[196px]"
    >
      <span className="mx-auto flex h-[154px] w-[154px] items-center justify-center overflow-hidden transition duration-300 group-hover:-translate-y-1 sm:h-[172px] sm:w-[172px] md:h-[184px] md:w-[184px]">
        <Image
          src={category.image}
          alt={category.name}
          width={184}
          height={184}
          sizes="(min-width: 768px) 184px, 172px"
          className="h-auto max-h-full w-auto max-w-full object-contain transition duration-300 group-hover:scale-[1.04]"
          unoptimized
        />
      </span>
      <span className="mt-3 block text-sm font-semibold leading-5 text-slate-800 transition duration-300 group-hover:text-teal-700 md:text-[15px]">
        {category.name}
      </span>
    </Link>
  );
}
