import { BadgeCheck } from "lucide-react";
import { RatingStars } from "@/components/common/rating-stars";
import type { Testimonial } from "@/types/product";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
          {testimonial.avatar}
        </div>
        <div>
          <h3 className="font-semibold text-slate-950">{testimonial.name}</h3>
          <p className="flex items-center gap-1 text-xs font-semibold text-teal-700">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified buyer
          </p>
        </div>
      </div>
      <div className="mt-4"><RatingStars rating={testimonial.rating} /></div>
      <p className="mt-4 text-sm leading-6 text-slate-600">&quot;{testimonial.review}&quot;</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {testimonial.product}
      </p>
    </article>
  );
}
