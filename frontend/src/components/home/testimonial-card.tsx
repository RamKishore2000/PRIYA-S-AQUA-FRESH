import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { RatingStars } from "@/components/common/rating-stars";
import type { Testimonial } from "@/types/product";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="h-full rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-sm backdrop-blur transition hover:border-[#12a8e6]/55">
      <span className="mb-4 block h-1 w-12 rounded-full bg-[#12a8e6]" aria-hidden="true" />
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#12a8e6] text-sm font-bold text-white">
          {testimonial.imageUrl ? (
            <Image src={testimonial.imageUrl} alt={testimonial.name} fill sizes="44px" className="object-cover" />
          ) : (
            testimonial.avatar
          )}
        </div>
        <div>
          <h3 className="font-semibold text-white">{testimonial.name}</h3>
          <p className="flex items-center gap-1 text-xs font-semibold text-slate-300">
            <BadgeCheck className="h-3.5 w-3.5 text-[#12a8e6]" /> {testimonial.role || "Verified buyer"}
          </p>
        </div>
      </div>
      <div className="mt-4"><RatingStars rating={testimonial.rating} /></div>
      <p className="mt-4 text-sm leading-6 text-slate-300">&quot;{testimonial.review}&quot;</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#12a8e6]">
        {testimonial.product}
      </p>
    </article>
  );
}
