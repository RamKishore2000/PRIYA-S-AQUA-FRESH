"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { getAboutAwards } from "@/services/catalog-service";
import type { AboutAward } from "@/types/product";

const defaultAwards: AboutAward[] = [
  {
    id: "default-award",
    title: "Honored with Excellence Award by Telugu Film Actor Ali Garu",
    description: "This recognition celebrates Priya's Aqua Fresh commitment to water purification, product quality and customer trust.",
    image: "/images/about/award-excellence.jpg",
    sortOrder: 0,
  },
];

export function AboutAwardsSlider() {
  const [awards, setAwards] = useState<AboutAward[]>(defaultAwards);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let active = true;
    getAboutAwards()
      .then((items) => {
        if (active && items.length) {
          setAwards(items.sort((first, second) => first.sortOrder - second.sortOrder));
          setActiveIndex(0);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (awards.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % awards.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [awards.length]);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + awards.length) % awards.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % awards.length);
  }

  const activeAward = awards[activeIndex] || defaultAwards[0];

  return (
    <section className="px-5 pb-16 md:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#0057C8] text-white shadow-[0_24px_80px_rgba(0,87,200,0.16)]">
        <article className="grid gap-0 lg:grid-cols-[0.96fr_1.04fr] lg:items-stretch">
          <div data-about-mask className="relative min-h-[300px] overflow-hidden bg-[#EAF6FF] md:min-h-[420px] lg:min-h-[500px]">
            <Image src={activeAward.image} alt={activeAward.title} fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" unoptimized={activeAward.image.startsWith("http")} />
          </div>
          <div data-about-reveal className="relative flex min-h-[330px] flex-col justify-center p-6 md:p-10 lg:p-12">
            <Award className="h-10 w-10 text-[#7ED957]" />
            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#C7E4F8]">Awards & Recognition</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-5xl">{activeAward.title}</h2>
            <p className="mt-5 max-w-2xl font-semibold leading-8 text-[#FFFFFF]">{activeAward.description}</p>

            {awards.length > 1 ? (
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {awards.map((award, index) => (
                    <button
                      key={award.id}
                      type="button"
                      aria-label={`Show award ${index + 1}`}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-9 bg-[#7ED957]" : "w-2.5 bg-white/35"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={showPrevious} aria-label="Previous award" className="grid h-11 w-11 place-items-center rounded-full border border-white/35 text-white transition hover:bg-white hover:text-[#0057C8]">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={showNext} aria-label="Next award" className="grid h-11 w-11 place-items-center rounded-full border border-white/35 text-white transition hover:bg-white hover:text-[#0057C8]">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
