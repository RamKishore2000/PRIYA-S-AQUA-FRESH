"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Award, BadgeCheck, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RatingStars } from "@/components/common/rating-stars";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    value: "4.9",
    suffix: "+",
    title: "Review Customer",
    quote: "Excellent products, exceptional service!",
    icon: BadgeCheck,
  },
  {
    value: "A",
    suffix: "+",
    title: "Business Class",
    quote: "Exceptional service, highly recommended!",
    icon: Award,
  },
];

export function WhyWeAre() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const image = section.querySelector<HTMLElement>("[data-home-why-image]");
      const revealItems = Array.from(section.querySelectorAll<HTMLElement>("[data-home-why-reveal]"));
      const ratingValue = section.querySelector<HTMLElement>("[data-home-why-rating]");

      if (reduceMotion) {
        gsap.set([...(image ? [image] : []), ...revealItems], { autoAlpha: 1, clearProps: "transform,clipPath" });
        if (ratingValue) ratingValue.textContent = "4.9";
        return;
      }

      if (image) {
        gsap.fromTo(
          image,
          { clipPath: "inset(0 100% 0 0)", autoAlpha: 0.72, x: -42 },
          {
            clipPath: "inset(0 0% 0 0)",
            autoAlpha: 1,
            x: 0,
            duration: 1.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: image,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      gsap.fromTo(
        revealItems,
        { autoAlpha: 0, y: 44, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.16,
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "restart none none reverse",
          },
        },
      );

      if (ratingValue) {
        const count = { value: 1 };

        gsap.to(count, {
          value: 4.9,
          duration: 1.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            toggleActions: "restart none none reset",
          },
          onUpdate: () => {
            ratingValue.textContent = count.value.toFixed(1);
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-transparent px-4 py-12 md:px-8 md:py-16">
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div data-home-why-image className="home-why-image">
          <div className="about-no1-badge" aria-label="India number one purifier badge">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-700">India</span>
            <span className="text-3xl font-black leading-none text-slate-950">No. 1</span>
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">Purifiers</span>
          </div>
          <Image
            src="/Untitled-design-10-2048x2048.png"
            alt="Priya's Aqua Fresh purifier"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-contain"
          />
        </div>

        <div>
          <div className="home-why-copy">
            <p data-home-why-reveal className="text-sm font-bold uppercase tracking-[0.22em] text-[#12a8e6]">Why We Are</p>
            <h2 data-home-why-reveal className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
              Trusted by Customers, Built for Better Water
            </h2>
            <p data-home-why-reveal className="mt-4 max-w-2xl leading-8 text-slate-300">
              Priya&apos;s Aqua Fresh focuses on dependable purification, practical support, and long-term customer trust across homes, businesses and commercial needs.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cards.map((card, index) => (
              <article
                key={card.title}
                data-home-why-reveal
                className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm transition duration-500 hover:border-[#12a8e6]/45 hover:bg-white/[0.055]"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#12a8e6]/15 blur-2xl transition duration-500 group-hover:bg-[#12a8e6]/25" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-3xl font-black leading-none text-white md:text-4xl">
                      {card.value === "4.9" ? <span data-home-why-rating>1.0</span> : card.value}
                      <span className="text-[#12a8e6]">{card.suffix}</span>
                    </span>
                    <div className="mt-3">
                      <RatingStars rating={4.7} showText={false} />
                    </div>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#12a8e6]/30 bg-[#12a8e6]/10 text-[#12a8e6]">
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="relative mt-5 text-lg font-bold text-white">{card.title}</h3>
                <p className="relative mt-3 flex gap-2 text-sm font-medium leading-6 text-slate-300">
                  <Quote className="mt-0.5 h-4 w-4 shrink-0 fill-[#12a8e6]/20 text-[#12a8e6]" />
                  <span>&quot;{card.quote}&quot;</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
