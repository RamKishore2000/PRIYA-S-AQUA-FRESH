"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Copy, TicketPercent } from "lucide-react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleOffers = useMemo(() => offers.slice(0, 8), [offers]);
  const hasMultipleOffers = visibleOffers.length > 1;

  useEffect(() => {
    if (!hasMultipleOffers) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleOffers.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [hasMultipleOffers, visibleOffers.length]);

  useEffect(() => {
    if (activeIndex >= visibleOffers.length) setActiveIndex(0);
  }, [activeIndex, visibleOffers.length]);

  if (visibleOffers.length === 0) return null;

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + visibleOffers.length) % visibleOffers.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % visibleOffers.length);
  }

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
          <div className="hidden items-center gap-3 sm:flex">
            {hasMultipleOffers ? (
              <div className="flex items-center gap-2">
                <button type="button" onClick={showPrevious} aria-label="Previous offer" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C59A55] bg-[#FFF9F1] text-[#9B7137] shadow-[0_10px_28px_rgba(84,61,35,0.08)] transition hover:bg-[#0A3A38] hover:text-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={showNext} aria-label="Next offer" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C59A55] bg-[#FFF9F1] text-[#9B7137] shadow-[0_10px_28px_rgba(84,61,35,0.08)] transition hover:bg-[#0A3A38] hover:text-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}
            <Link
              href="/products"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#C59A55] bg-[#FFF9F1] px-5 text-sm font-black text-[#9B7137] shadow-[0_10px_28px_rgba(84,61,35,0.08)] transition hover:bg-[#0A3A38] hover:text-white"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1rem]">
          <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {visibleOffers.map((offer) => (
              <div key={offer.id} className="w-full flex-none">
                <OfferCard offer={offer} />
              </div>
            ))}
          </div>
        </div>

        {hasMultipleOffers ? (
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {visibleOffers.map((offer, index) => (
                <button
                  key={offer.id}
                  type="button"
                  aria-label={`Show offer ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-8 bg-[#0A3A38]" : "w-2.5 bg-[#D9C5A8]"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 sm:hidden">
              <button type="button" onClick={showPrevious} aria-label="Previous offer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C59A55] bg-white text-[#9B7137]">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={showNext} aria-label="Next offer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C59A55] bg-white text-[#9B7137]">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: CouponOffer }) {
  return (
    <article className="group grid grid-cols-[8.25rem_minmax(0,1fr)] overflow-hidden rounded-[1rem] border border-[#E4D3B8] bg-[#FFFDF8] shadow-[0_18px_52px_rgba(84,61,35,0.10)] sm:grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[0.43fr_0.57fr]">
      <div className="relative h-[11rem] overflow-hidden border-r border-dashed border-[#D8B879] bg-[#F6E8D1] p-1.5 sm:h-[12.5rem] sm:p-2 md:h-auto md:min-h-[360px] md:p-5">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            sizes="(min-width: 1024px) 500px, (min-width: 640px) 176px, 132px"
            className="object-contain object-center transition duration-700 group-hover:scale-[1.025]"
            unoptimized={offer.image.startsWith("http")}
          />
        ) : (
          <div className="grid h-full place-items-center text-[#B68A45]">
            <TicketPercent className="h-12 w-12" />
          </div>
        )}
      </div>

      <div className="relative flex h-[11rem] min-w-0 flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_left,rgba(216,184,121,0.13),transparent_34%),linear-gradient(180deg,#FFFDF8,#FFF8EF)] p-2.5 sm:h-[12.5rem] sm:p-3 md:h-auto md:min-h-[360px] md:p-8">
        <span className="absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#E4D3B8] bg-[#FFF9F1] md:block" />
        <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-[#E4D3B8] bg-[#FFF9F1] md:block" />
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5E9D8] px-2 py-0.5 text-[0.52rem] font-black uppercase tracking-[0.08em] text-[#9B7137] sm:text-[0.6rem] md:px-3 md:py-1 md:text-xs md:tracking-[0.16em]">
            <TicketPercent className="h-2.5 w-2.5 shrink-0 md:h-3.5 md:w-3.5" />
            Limited Offer
          </span>
          <h3 className="mt-1.5 line-clamp-1 font-serif text-lg font-semibold leading-tight text-[#1D2D2E] sm:text-xl md:mt-4 md:line-clamp-none md:text-5xl">
            {offer.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-[0.68rem] font-semibold leading-4 text-[#5A6362] sm:text-xs md:mt-3 md:line-clamp-none md:text-base md:leading-7">
            {offer.subtitle}
          </p>
        </div>

        <div className="mt-2 grid gap-1.5 sm:gap-2 md:mt-6 md:gap-4">
          <div className="grid grid-cols-2 gap-1 md:gap-3">
            <div className="min-w-0 rounded-md border border-dashed border-[#C59A55] bg-[#FFF9F1] px-1 py-0.5 md:rounded-xl md:px-4 md:py-3">
              <p className="flex min-w-0 items-center gap-0.5 whitespace-nowrap text-[0.4rem] font-black uppercase tracking-0 text-[#9B7137] sm:text-[0.48rem] md:gap-1.5 md:text-[0.65rem] md:tracking-[0.16em]">
                <Copy className="h-2.5 w-2.5 shrink-0 md:h-3.5 md:w-3.5" />
                Coupon Code
              </p>
              <p className="mt-0 truncate font-mono text-[0.62rem] font-black tracking-0 text-[#0A3A38] sm:text-[0.7rem] md:mt-1 md:text-xl md:tracking-[0.12em]">{offer.code}</p>
            </div>
            <div className="min-w-0 rounded-md bg-[#0A3A38] px-1 py-0.5 text-white md:rounded-xl md:px-4 md:py-3">
              <p className="whitespace-nowrap text-[0.4rem] font-black uppercase tracking-0 opacity-70 sm:text-[0.48rem] md:text-[0.65rem] md:tracking-[0.16em]">You Save</p>
              <p className="mt-0 truncate text-[0.62rem] font-black sm:text-[0.7rem] md:mt-1 md:text-xl">{formatDiscount(offer)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1.5 border-t border-[#E8D9C7] pt-1.5 md:gap-3 md:pt-4">
            <div className="min-w-0 text-[0.58rem] font-bold leading-3 text-[#5A6362] sm:text-[0.66rem] md:text-sm md:leading-5">
              <p className="truncate">{formatMinimumOrder(offer.minimumOrderAmount)}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[#7D7B75] md:mt-1 md:gap-2">
                <CalendarDays className="h-3 w-3 shrink-0 text-[#B68A45] md:h-4 md:w-4" />
                <span className="truncate">Till {formatEndDate(offer.endAt)}</span>
              </p>
            </div>
            <Link href="/products" className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-full bg-[#0A3A38] px-2.5 text-[0.58rem] font-black text-white transition hover:bg-[#B68A45] sm:h-8 sm:text-[0.68rem] md:h-11 md:gap-2 md:px-5 md:text-sm">
              Shop <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
