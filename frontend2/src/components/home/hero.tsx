"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowIcon } from "@/components/ui/icons";
import type { Banner, Category } from "@/types/product";

type HeroProps = {
  banners: Banner[];
  categories: Category[];
};

type HeroItem = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  image: string;
  label?: string;
  title?: string;
  description?: string;
  buttonLink?: string;
};
type HeroSlot = "active" | "upcoming" | "leaving" | "hidden";

const copyBySlug: Record<string, { kicker: string; title: string; line: string }> = {
  "alkaline-water-purifiers": {
    kicker: "Better Water.",
    title: "Healthier Water. Better Everyday.",
    line: "Balanced alkaline purification for fresh-tasting water and everyday wellness.",
  },
  "ro-water-purifiers": {
    kicker: "Better Water.",
    title: "Pure Water. Better Living.",
    line: "Advanced RO systems designed for safe, clean water at home.",
  },
  "commercial-water-purifiers": {
    kicker: "Commercial Solutions",
    title: "Powerful Purification for Business.",
    line: "High-capacity water systems for offices, hotels, schools and commercial needs.",
  },
  electronics: {
    kicker: "Modern Living",
    title: "Smart Technology for Modern Living.",
    line: "Reliable electronics and home essentials selected for everyday comfort.",
  },
  "water-softners": {
    kicker: "Comfort Water",
    title: "Softer Water. Better Comfort.",
    line: "Reduce hardness, protect appliances and improve daily water feel.",
  },
  "water-softeners": {
    kicker: "Comfort Water",
    title: "Softer Water. Better Comfort.",
    line: "Reduce hardness, protect appliances and improve daily water feel.",
  },
  "spare-parts": {
    kicker: "Original Parts",
    title: "Reliable Parts. Lasting Performance.",
    line: "Filters, membranes and purifier parts that keep performance flowing.",
  },
};

const accents = ["#0A3A38", "#12383A", "#0A2426", "#2B494B", "#0A3A38", "#12383A"];

export function Hero({ banners, categories }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  const items = useMemo<HeroItem[]>(() => {
    const bannerItems = banners
      .filter((banner) => banner.image)
      .slice(0, 6)
      .map((banner, index) => ({
        id: banner.id,
        name: banner.title,
        slug: banner.buttonLink.replace("/products?category=", "") || `banner-${index}`,
        productCount: 0,
        image: banner.image,
        label: banner.subtitle || banner.title,
        title: banner.title,
        description: banner.description,
        buttonLink: banner.buttonLink,
      }))
      .slice(0, 6);

    if (bannerItems.length) return bannerItems;

    const categoryItems = categories.filter((category) => category.image).slice(0, 6);

    return categoryItems;
  }, [banners, categories]);

  useEffect(() => {
    if (items.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5400);

    return () => window.clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-ref-copy]",
        { y: 26, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.95, ease: "power3.out", stagger: 0.1 },
      );
      gsap.fromTo(
        "[data-ref-product-inner]",
        { y: 34, scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.15, ease: "power3.out" },
      );
    }, heroRef);

    return () => ctx.revert();
  }, [activeIndex, items.length]);

  if (!items.length) return null;

  const active = items[activeIndex] || items[0];
  const previousIndex = (activeIndex - 1 + items.length) % items.length;
  const nextIndex = (activeIndex + 1) % items.length;
  const copy =
    active.title || active.description
      ? {
          kicker: active.label || active.name,
          title: active.title || active.name,
          line: active.description || `Explore ${active.name.toLowerCase()} designed for reliable performance and daily comfort.`,
        }
      : copyBySlug[active.slug] || {
          kicker: active.name,
          title: "Water Refined",
          line: `Explore ${active.name.toLowerCase()} designed for reliable performance and daily comfort.`,
        };
  const accent = accents[activeIndex % accents.length];

  return (
    <section ref={heroRef} className="relative isolate -mt-px overflow-hidden bg-[linear-gradient(120deg,#FFF9F1_0%,#F8F3EC_58%,#F1E5D6_100%)] px-4 pb-8 pt-0 text-[#1D2D2E] md:px-6 md:pb-10 lg:px-8 lg:pb-14">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 78% 28%, ${accent}18, transparent 26%), radial-gradient(circle at 10% 12%, rgba(182,138,69,0.10), transparent 24%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(90deg,rgba(182,138,69,0.08)_1px,transparent_1px),linear-gradient(rgba(182,138,69,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B68A45]/45 to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[430px] max-w-7xl items-center gap-4 md:min-h-[500px] lg:min-h-[560px] lg:grid-cols-[0.86fr_1.14fr] lg:gap-8">
        <div className="relative z-20 min-h-[250px] overflow-visible pb-4 md:min-h-[310px] lg:order-2 lg:min-h-[430px] lg:pb-8" aria-label="Priya's Aqua Fresh banner showcase">
          <div className="pointer-events-none absolute left-[16%] top-[10%] h-[26rem] w-[26rem] rounded-full bg-[#0A3A38]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-8 left-[18%] h-36 w-[72%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(182,138,69,0.22),transparent_68%)] blur-xl" />

          {items.map((item, index) => {
            const slot = getHeroSlot(index, activeIndex, nextIndex, previousIndex);

            return (
              <HeroVisualCard
                key={item.id}
                item={item}
                slot={slot}
                priority={index === 0}
                indicators={
                  slot === "active" ? (
                    <div className="flex items-center gap-2 rounded-full border border-[#E5D8C7] bg-[#FFF9F1]/90 px-3 py-2 shadow-[0_8px_24px_rgba(84,61,35,0.07)] backdrop-blur">
                      {items.slice(0, Math.min(items.length, 6)).map((dotItem, dotIndex) => (
                        <button
                          key={`dot-${dotItem.id}`}
                          onClick={() => setActiveIndex(dotIndex)}
                          className={`h-2 rounded-full transition-all duration-500 ${dotIndex === activeIndex ? "w-7 bg-[#0A3A38]" : "w-2 bg-[#B68A45]/45 hover:bg-[#B68A45]"}`}
                          aria-label={`Show ${dotItem.name}`}
                        />
                      ))}
                    </div>
                  ) : null
                }
              />
            );
          })}
        </div>

        <div className="relative z-30 max-w-xl py-3 md:py-5 lg:order-1 lg:-translate-y-1 lg:py-10">
          <div key={active.id}>
            <p data-ref-copy className="inline-flex border-l-2 border-[#B68A45] bg-[#FFF9F1]/70 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#9B7137] shadow-[0_8px_24px_rgba(84,61,35,0.06)] backdrop-blur lg:px-4 lg:py-2 lg:text-xs">
              {copy.kicker}
            </p>
            <h1 data-ref-copy className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#1D2D2E] md:text-4xl lg:mt-5 lg:text-[4rem]">
              {copy.title}
            </h1>
            <p data-ref-copy className="mt-5 hidden max-w-xl text-base font-semibold leading-8 text-[#5A6362] lg:block lg:text-lg">
              {copy.line}
            </p>
          </div>

          <div data-ref-copy className="mt-5 grid grid-cols-2 gap-2 sm:max-w-sm lg:mt-7 lg:flex lg:max-w-none lg:flex-row lg:gap-3">
            <Link
              href={active.buttonLink || `/products?category=${active.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A3A38] px-3 py-3 text-xs font-extrabold text-white shadow-[0_8px_22px_rgba(10,36,38,0.18)] transition hover:bg-[#12383A] lg:gap-3 lg:px-7 lg:py-4 lg:text-sm"
            >
              Explore Range
              <ArrowIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-[#C59A55] bg-transparent px-3 py-3 text-xs font-extrabold text-[#9B7137] transition hover:bg-[#F5E9D8] lg:px-7 lg:py-4 lg:text-sm"
            >
              Contact Expert
            </Link>
          </div>
          <div data-ref-copy className="mt-9 hidden max-w-lg grid-cols-2 gap-4 text-xs font-bold text-[#5A6362] lg:grid lg:grid-cols-4">
            {["D3 Purification", "7 Stage Hygiene", "Refined Filtration", "1 Year Warranty"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-[#B68A45]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function getHeroSlot(index: number, activeIndex: number, nextIndex: number, previousIndex: number): HeroSlot {
  if (index === activeIndex) return "active";
  if (index === nextIndex) return "upcoming";
  if (index === previousIndex) return "leaving";
  return "hidden";
}

function HeroVisualCard({
  item,
  slot,
  priority,
  indicators,
}: {
  item: HeroItem;
  slot: HeroSlot;
  priority: boolean;
  indicators?: ReactNode;
}) {
  return (
    <div className={heroVisualCardClass(slot)}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,253,248,0.88),rgba(244,234,223,0.58)_48%,rgba(10,58,56,0.10))]" />
      <div data-ref-product-inner={slot === "active" ? "" : undefined}>
        <div className="relative mx-auto mt-4 aspect-square w-[66%]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes={slot === "active" ? "(min-width: 1024px) 360px, 72vw" : "(min-width: 1024px) 260px, 44vw"}
            className="object-contain"
            priority={priority}
            unoptimized={isRemoteImage(item.image)}
          />
        </div>
        <div className="relative px-6 pb-5 pt-2">
          <p className="hidden text-xs font-black uppercase tracking-[0.2em] text-[#B68A45] lg:block">Featured range</p>
          <h3 className="mt-1 truncate text-center text-sm font-black text-[#1D2D2E] md:text-base lg:mt-2 lg:text-left lg:text-2xl">{item.name}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href={item.buttonLink || `/products?category=${item.slug}`} className="inline-flex rounded-lg border border-[#C59A55] px-5 py-2 text-xs font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
              Explore
            </Link>
            {indicators}
          </div>
        </div>
      </div>
    </div>
  );
}

function heroVisualCardClass(slot: HeroSlot) {
  const base =
    "absolute overflow-hidden rounded-[1.65rem] border border-[#E8DCCB] bg-[#FFF9F1]/92 shadow-[0_18px_48px_rgba(84,61,35,0.12)] backdrop-blur-xl transition-[left,top,width,transform,opacity,filter] duration-[1450ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform";

  if (slot === "active") {
    return `${base} left-[13%] top-[50%] z-30 w-[74%] max-w-[310px] -translate-y-1/2 opacity-100 blur-0 md:left-[24%] md:w-[56%] lg:left-[32%] lg:top-[48%] lg:w-[52%] lg:max-w-[360px]`;
  }

  if (slot === "upcoming") {
    return `${base} left-[88%] top-[24%] z-20 w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.82] opacity-0 blur-[0.25px] lg:left-[72%] lg:top-[25%] lg:scale-[0.86] lg:opacity-55`;
  }

  if (slot === "leaving") {
    return `${base} left-[0%] top-[66%] z-10 w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.78] opacity-0 blur-sm lg:left-[8%] lg:scale-[0.82]`;
  }

  return `${base} left-[94%] top-[38%] z-0 w-[34%] max-w-[270px] -translate-y-1/2 scale-[0.78] opacity-0 blur-sm`;
}
