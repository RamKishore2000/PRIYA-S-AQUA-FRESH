import type { Testimonial } from "@/types/product";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section data-home-reveal className="bg-[#FFFFFF] px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div data-reveal-item>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0057C8]">Customer words</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[#102033] md:text-4xl lg:mt-3 lg:text-5xl">What Our Customers Say</h2>
        </div>
        <div className="-mx-4 mt-7 overflow-hidden md:-mx-6 lg:mx-0 lg:mt-10">
          <div className="testimonial-auto-track lg:grid lg:grid-cols-3 lg:gap-5 lg:animate-none">
          {[...testimonials.slice(0, 3), ...testimonials.slice(0, 3)].map((item, index) => (
            <article key={`${item.id}-${index}`} data-reveal-item className={`w-[82vw] shrink-0 rounded-[1rem] border border-[#E8D9C7] bg-[#FFFDFC] p-5 shadow-[0_10px_28px_rgba(70,50,25,0.06)] md:w-[44vw] lg:w-auto lg:p-6 ${index > 2 ? "lg:hidden" : ""}`}>
              <div className="flex items-center gap-2 text-[#C69236]" aria-label={`${item.rating.toFixed(1)} star rating`}>
                <span className="text-lg tracking-[0.08em]" aria-hidden="true">{renderStars(item.rating)}</span>
                <span className="text-sm font-black text-[#0057C8]">{item.rating.toFixed(1)}</span>
              </div>
              <p className="mt-4 min-h-24 text-sm leading-7 text-[#40576C] lg:mt-5 lg:min-h-28 lg:text-base">&quot;{item.review}&quot;</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F4EADF] text-sm font-black text-[#0057C8]">{item.avatar}</span>
                <span>
                  <span className="block font-bold text-[#3B4343]">{item.name}</span>
                  <span className="block text-sm text-[#74879A]">{item.role}</span>
                </span>
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function renderStars(rating: number) {
  const filled = Math.max(0, Math.min(5, Math.round(rating || 5)));
  return `${"\u2605".repeat(filled)}${"\u2606".repeat(5 - filled)}`;
}
