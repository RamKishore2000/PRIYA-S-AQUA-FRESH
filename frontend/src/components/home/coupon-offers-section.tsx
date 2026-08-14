import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Copy, TicketPercent } from "lucide-react";
import type { CouponOffer } from "@/types/product";

function formatDiscount(offer: CouponOffer) {
  if (offer.discountType === "PERCENTAGE") {
    return `${offer.discountValue}% OFF`;
  }
  return `Rs. ${offer.discountValue.toLocaleString("en-IN")} OFF`;
}

function formatMinimumOrder(amount: number) {
  if (!amount) return "No minimum order";
  return `Min order Rs. ${amount.toLocaleString("en-IN")}`;
}

function formatEndDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function CouponOffersSection({ offers }: { offers: CouponOffer[] }) {
  if (offers.length === 0) return null;

  const [featuredOffer, ...secondaryOffers] = offers;

  return (
    <section className="relative overflow-hidden bg-transparent py-12 md:py-16">
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f4c766]">Current Offers</p>
            <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-white md:text-4xl">
              Save more on premium purification
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden h-10 items-center gap-2 rounded-md border border-[#f4c766]/35 bg-[#f4c766]/10 px-4 text-sm font-bold text-[#ffe7a3] transition hover:bg-[#f4c766] hover:text-[#07120f] sm:inline-flex"
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className={`grid gap-5 ${secondaryOffers.length ? "lg:grid-cols-[1.25fr_0.75fr]" : ""}`}>
          <OfferCard offer={featuredOffer} featured />
          {secondaryOffers.length ? (
            <div className="grid gap-4">
              {secondaryOffers.slice(0, 2).map((offer) => <OfferCard key={offer.id} offer={offer} />)}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, featured = false }: { offer: CouponOffer; featured?: boolean }) {
  return (
    <article className={`group overflow-hidden rounded-[1rem] border border-[#f4c766]/22 bg-[#081712] shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${featured ? "grid md:grid-cols-[0.43fr_0.57fr]" : "grid sm:grid-cols-[9rem_1fr]"}`}>
      <div className={`relative overflow-hidden bg-[#10231c] ${featured ? "min-h-[270px] md:min-h-[360px]" : "min-h-[150px]"}`}>
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            sizes={featured ? "(min-width: 1024px) 500px, 100vw" : "180px"}
            className="object-cover object-center transition duration-700 group-hover:scale-[1.035]"
            unoptimized={offer.image.startsWith("http")}
          />
        ) : (
          <div className="grid h-full place-items-center text-[#f4c766]">
            <TicketPercent className="h-12 w-12" />
          </div>
        )}
      </div>

      <div className={`relative flex min-w-0 flex-col justify-between p-5 ${featured ? "md:p-8" : ""}`}>
        <span className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#f4c766]/22 bg-[#0d1114] md:block" />
        <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#f4c766]/22 bg-[#0d1114] md:block" />
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f4c766]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#ffe7a3]">
            <TicketPercent className="h-3.5 w-3.5" />
            Limited Offer
          </span>
          <h3 className={`mt-4 font-serif font-medium leading-tight text-white ${featured ? "text-4xl md:text-5xl" : "text-2xl"}`}>
            {offer.title}
          </h3>
          <p className={`mt-3 text-slate-300 ${featured ? "text-base leading-7" : "text-sm leading-6"}`}>
            {offer.subtitle}
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-dashed border-[#f4c766]/65 bg-[#fff5cf]/[0.08] px-4 py-3">
              <p className="flex items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#ffe7a3]">
                <Copy className="h-3.5 w-3.5" />
                Coupon Code
              </p>
              <p className="mt-1 font-mono text-xl font-black tracking-[0.12em] text-white">{offer.code}</p>
            </div>
            <div className="rounded-md bg-[#f4c766] px-4 py-3 text-[#07120f]">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] opacity-70">You Save</p>
              <p className="mt-1 text-xl font-black">{formatDiscount(offer)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="text-sm font-semibold text-slate-300">
              <p>{formatMinimumOrder(offer.minimumOrderAmount)}</p>
              <p className="mt-1 flex items-center gap-2 text-slate-400">
                <CalendarDays className="h-4 w-4 text-[#f4c766]" />
                Valid till {formatEndDate(offer.endAt)}
              </p>
            </div>
            <Link href="/products" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#12a8e6] px-5 text-sm font-black text-white transition hover:bg-[#f4c766] hover:text-[#07120f]">
              Shop Offer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
