"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const brands = [
  { name: "Priya's Aqua Mart", image: "/images/brands/priyas-aqua-mart-transparent-hd.png" },
  { name: "Priya's Smart LED TV", image: "/images/brands/priyas-smart-led-tv.png" },
  { name: "Priya's RO Care India", image: "/images/brands/priyas-ro-care-india.png" },
  { name: "Priya's Aqua RO Water Solutions", image: "/images/brands/priyas-aqua-ro-water-solutions.png" },
  { name: "Priya's Group", image: "/images/brands/priyas-group.png" },
  { name: "Priya's Instant Geyser", image: "/images/brands/priyas-instant-geyser.png" },
  { name: "J Plus Series", image: "/images/brands/j-plus-series-alkaline-water-purifiers.png" },
];

export function BrandShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const ctx = gsap.context(() => {
      const logos = gsap.utils.toArray<HTMLElement>("[data-gsap-brand]");

      gsap.set(logos, { xPercent: 0 });

      const tween = gsap.to(logos, {
        xPercent: -100 * brands.length,
        duration: 28,
        ease: "none",
        repeat: -1,
        modifiers: {
          xPercent: gsap.utils.wrap(-100 * brands.length, 0),
        },
      });

      logos.forEach((logo) => {
        logo.addEventListener("mouseenter", () => tween.pause());
        logo.addEventListener("mouseleave", () => tween.resume());
      });
    }, trackRef);

    return () => ctx.revert();
  }, []);

  return (
    <section data-home-reveal className="relative overflow-hidden bg-[#F8F0E6] py-10 md:py-12 lg:py-20">
      <div className="absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#B68A45]/45 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div data-reveal-item className="mb-7 flex flex-wrap items-end justify-between gap-4 lg:mb-12 lg:gap-6">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#B68A45]">Trusted Brands</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#1D2D2E] md:text-4xl lg:mt-3 lg:text-6xl">Our Brands &amp; Solutions</h2>
          </div>
          <p className="hidden max-w-md text-sm font-semibold leading-7 text-[#5A6362] lg:block lg:text-base">
            Real Priya&apos;s brand marks and solution partners presented in a clean premium strip.
          </p>
        </div>
      </div>

      <div data-reveal-item className="relative">
        <div className="brand-gsap-window">
          <div ref={trackRef} className="brand-gsap-track">
            {[...brands, ...brands].map((brand, index) => (
              <div key={`${brand.name}-${index}`} data-gsap-brand className="brand-gsap-item">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={300}
                  height={130}
                  className={brand.name === "Priya's Aqua Mart" ? "max-h-20 w-auto object-contain md:max-h-24" : "max-h-24 w-auto object-contain md:max-h-28"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
