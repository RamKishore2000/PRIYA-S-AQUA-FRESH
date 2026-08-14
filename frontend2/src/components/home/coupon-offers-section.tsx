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
    <section className="relative overflow-hidden bg-[#FFF9F1] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">Current Offers</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#1D2D2E] md:text-4xl">
              Save more on premium purification
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden h-11 items-center gap-2 rounded-full border border-[#C59A55] bg-[#FFF9F1] px-5 text-sm font-black text-[#9B7137] shadow-[0_10px_28px_rgba(84,61,35,0.08)] transition hover:bg-[#0A3A38] hover:text-white sm:inline-flex"
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
    <article className={`group overflow-hidden rounded-[1rem] border border-[#E4D3B8] bg-white shadow-[0_18px_52px_rgba(84,61,35,0.10)] ${featured ? "grid md:grid-cols-[0.43fr_0.57fr]" : "grid sm:grid-cols-[9rem_1fr]"}`}>
      <div className={`relative overflow-hidden bg-[#F5E9D8] ${featured ? "min-h-[270px] md:min-h-[360px]" : "min-h-[150px]"}`}>
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
          <div className="grid h-full place-items-center text-[#B68A45]">
            <TicketPercent className="h-12 w-12" />
          </div>
        )}
      </div>

      <div className={`relative flex min-w-0 flex-col justify-between p-5 ${featured ? "md:p-8" : ""}`}>
        <span className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#E4D3B8] bg-[#FFF9F1] md:block" />
        <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#E4D3B8] bg-[#FFF9F1] md:block" />
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F5E9D8] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#9B7137]">
            <TicketPercent className="h-3.5 w-3.5" />
            Limited Offer
          </span>
          <h3 className={`mt-4 font-serif font-semibold leading-tight text-[#1D2D2E] ${featured ? "text-4xl md:text-5xl" : "text-2xl"}`}>
            {offer.title}
          </h3>
          <p className={`mt-3 font-semibold text-[#5A6362] ${featured ? "text-base leading-7" : "text-sm leading-6"}`}>
            {offer.subtitle}
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-dashed border-[#C59A55] bg-[#FFF9F1] px-4 py-3">
              <p className="flex items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#9B7137]">
                <Copy className="h-3.5 w-3.5" />
                Coupon Code
              </p>
              <p className="mt-1 font-mono text-xl font-black tracking-[0.12em] text-[#0A3A38]">{offer.code}</p>
            </div>
            <div className="rounded-xl bg-[#0A3A38] px-4 py-3 text-white">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] opacity-70">You Save</p>
              <p className="mt-1 text-xl font-black">{formatDiscount(offer)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8D9C7] pt-4">
            <div className="text-sm font-bold text-[#5A6362]">
              <p>{formatMinimumOrder(offer.minimumOrderAmount)}</p>
              <p className="mt-1 flex items-center gap-2 text-[#7D7B75]">
                <CalendarDays className="h-4 w-4 text-[#B68A45]" />
                Valid till {formatEndDate(offer.endAt)}
              </p>
            </div>
            <Link href="/products" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0A3A38] px-5 text-sm font-black text-white transition hover:bg-[#B68A45]">
              Shop Offer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
