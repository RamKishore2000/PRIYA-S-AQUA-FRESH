import type { Testimonial } from "@/types/product";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section data-home-reveal className="bg-[#FFF9F1] px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div data-reveal-item>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">Customer words</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#1D2D2E] md:text-5xl">What Our Customers Say</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((item) => (
            <article key={item.id} data-reveal-item className="rounded-[1rem] border border-[#E8D9C7] bg-[#FFFDFC] p-6 shadow-[0_10px_28px_rgba(70,50,25,0.06)]">
              <div className="flex items-center gap-2 text-[#C69236]" aria-label={`${item.rating.toFixed(1)} star rating`}>
                <span className="text-lg tracking-[0.08em]" aria-hidden="true">{renderStars(item.rating)}</span>
                <span className="text-sm font-black text-[#9B7137]">{item.rating.toFixed(1)}</span>
              </div>
              <p className="mt-5 min-h-28 text-base leading-7 text-[#5A6362]">&quot;{item.review}&quot;</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F4EADF] text-sm font-black text-[#B68A45]">{item.avatar}</span>
                <span>
                  <span className="block font-bold text-[#3B4343]">{item.name}</span>
                  <span className="block text-sm text-[#7D7B75]">{item.role}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderStars(rating: number) {
  const filled = Math.max(0, Math.min(5, Math.round(rating || 5)));
  return `${"\u2605".repeat(filled)}${"\u2606".repeat(5 - filled)}`;
}
