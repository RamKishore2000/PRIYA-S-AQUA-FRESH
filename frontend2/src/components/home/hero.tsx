"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, TouchEvent } from "react";
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

const accents = ["#0589C8", "#0A8ED1", "#12A8E6", "#0477B7", "#069FE0", "#086FA8"];
const mobileCardThemes = [
  { background: "linear-gradient(135deg,#EAF8FF 0%,#DDF3FF 54%,#F7FCFF 100%)", accent: "rgba(18,168,230,0.16)" },
  { background: "linear-gradient(135deg,#F1FAFF 0%,#D8F0FF 55%,#F8FCFF 100%)", accent: "rgba(5,137,200,0.15)" },
  { background: "linear-gradient(135deg,#E6F6FF 0%,#F6FCFF 52%,#DFF4FF 100%)", accent: "rgba(10,142,209,0.14)" },
  { background: "linear-gradient(135deg,#F4FBFF 0%,#DDF3FF 50%,#ECF8FF 100%)", accent: "rgba(6,159,224,0.14)" },
];

export function Hero({ banners, categories }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

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

  function goToPreviousItem() {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  }

  function goToNextItem() {
    setActiveIndex((current) => (current + 1) % items.length);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const distance = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current);
    touchStartX.current = null;

    if (Math.abs(distance) < 36) return;
    if (distance > 0) {
      goToNextItem();
      return;
    }
    goToPreviousItem();
  }

  return (
    <section ref={heroRef} className="relative isolate -mt-px overflow-hidden bg-[linear-gradient(135deg,#043C5C_0%,#057FC0_46%,#12A8E6_100%)] px-4 pb-0 pt-0 text-[#1D2D2E] md:px-6 lg:px-8 lg:pb-14">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 78% 28%, ${accent}4D, transparent 30%), radial-gradient(circle at 12% 14%, rgba(255,255,255,0.16), transparent 28%), radial-gradient(circle at 50% 72%, rgba(18,168,230,0.26), transparent 34%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#12A8E6]/45 to-transparent" />

      <div className="relative z-10 mx-auto block max-w-md pt-4 md:max-w-2xl lg:hidden">
        <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {items.map((item, index) => {
              const itemCopy = getHeroCopy(item);
              const theme = mobileCardThemes[index % mobileCardThemes.length];

              return (
                <div key={item.id} className="w-full shrink-0 px-0.5">
                  <div
                    className="relative grid min-h-[178px] grid-cols-[1fr_44%] items-center gap-2 overflow-hidden px-1 py-4 md:min-h-[210px] md:grid-cols-[1fr_40%] md:px-2 md:py-5"
                  >
                    <div className="relative min-w-0 pr-1">
                      <p className="border-l-2 border-white/75 pl-2 text-[0.58rem] font-extrabold uppercase leading-4 tracking-[0.16em] text-white/85 md:text-[0.7rem]">
                        {itemCopy.kicker}
                      </p>
                      <h1 className="mt-2 line-clamp-3 font-serif text-[1.45rem] font-semibold leading-[1.1] text-white md:text-3xl">
                        {itemCopy.title}
                      </h1>
                      <Link
                        href={item.buttonLink || `/products?category=${item.slug}`}
                        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[0.68rem] font-extrabold text-[#0477B7] shadow-[0_8px_18px_rgba(3,35,36,0.16)] md:px-4 md:py-2.5 md:text-xs"
                      >
                        Explore
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="relative h-[142px] min-w-0 md:h-[180px]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(min-width: 768px) 260px, 44vw"
                        className="object-contain object-center"
                        priority={index === 0}
                        unoptimized={isRemoteImage(item.image)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 items-center justify-center gap-2 border-t border-[#E5D8C7] bg-[#FFF9F1] px-3 py-3 shadow-[0_-1px_0_rgba(255,255,255,0.45)]">
          {items.slice(0, Math.min(items.length, 6)).map((dotItem, dotIndex) => (
            <button
              key={`mobile-dot-${dotItem.id}`}
              onClick={() => setActiveIndex(dotIndex)}
              className={`h-2 rounded-full transition-all duration-300 ${dotIndex === activeIndex ? "w-7 bg-[#0A3A38]" : "w-2 bg-[#D8C7AE] hover:bg-[#B68A45]"}`}
              aria-label={`Show ${dotItem.name}`}
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 mx-auto hidden min-h-[560px] max-w-7xl items-center gap-8 lg:grid lg:grid-cols-[0.86fr_1.14fr]">
        <div className="relative z-20 min-h-[210px] overflow-visible pb-0 md:min-h-[260px] lg:order-2 lg:min-h-[430px] lg:pb-8" aria-label="Priya's Aqua Fresh banner showcase">
          <div className="pointer-events-none absolute left-[16%] top-[10%] h-[26rem] w-[26rem] rounded-full bg-[#12A8E6]/24 blur-3xl" />
          <div className="pointer-events-none absolute bottom-8 left-[18%] h-36 w-[72%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(18,168,230,0.28),transparent_68%)] blur-xl" />

          {items.map((item, index) => {
            const slot = getHeroSlot(index, activeIndex, nextIndex, previousIndex);

            return (
              <HeroVisualCard
                key={item.id}
                item={item}
                slot={slot}
                priority={index === 0}
/>
            );
          })}
        </div>

        <div className="relative z-30 max-w-xl py-1 md:py-3 lg:order-1 lg:-translate-y-1 lg:py-10">
          <div key={active.id}>
            <p data-ref-copy className="inline-flex border-l-2 border-[#12A8E6] bg-white/70 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#0589C8] shadow-[0_8px_24px_rgba(84,61,35,0.06)] backdrop-blur lg:px-4 lg:py-2 lg:text-xs">
              {copy.kicker}
            </p>
            <h1 data-ref-copy className="mt-3 font-serif text-3xl font-semibold leading-tight text-white md:text-4xl lg:mt-5 lg:text-[4rem]">
              {copy.title}
            </h1>
            <p data-ref-copy className="mt-5 hidden max-w-xl text-base font-semibold leading-8 text-white/82 lg:block lg:text-lg">
              {copy.line}
            </p>
          </div>

          <div data-ref-copy className="mt-5 grid grid-cols-2 gap-2 sm:max-w-sm lg:mt-7 lg:flex lg:max-w-none lg:flex-row lg:gap-3">
            <Link
              href={active.buttonLink || `/products?category=${active.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#0477B7,#12A8E6)] px-3 py-3 text-xs font-extrabold text-white shadow-[0_8px_22px_rgba(10,36,38,0.18)] transition hover:bg-[#12383A] lg:gap-3 lg:px-7 lg:py-4 lg:text-sm"
            >
              Explore Range
              <ArrowIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/55 bg-white/12 px-3 py-3 text-xs font-extrabold text-white shadow-[0_8px_22px_rgba(3,35,36,0.14)] backdrop-blur transition hover:border-white hover:bg-white/20 lg:px-7 lg:py-4 lg:text-sm"
            >
              Contact Expert
            </Link>
          </div>
          <div data-ref-copy className="mt-9 hidden max-w-lg grid-cols-2 gap-4 text-xs font-bold text-white/88 lg:grid lg:grid-cols-4">
            {["D3 Purification", "7 Stage Hygiene", "Refined Filtration", "1 Year Warranty"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-white/70 bg-[#12A8E6]" />
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

function getHeroCopy(item: HeroItem) {
  if (item.title || item.description) {
    return {
      kicker: item.label || item.name,
      title: item.title || item.name,
      line: item.description || `Explore ${item.name.toLowerCase()} designed for reliable performance and daily comfort.`,
    };
  }

  return copyBySlug[item.slug] || {
    kicker: item.name,
    title: "Water Refined",
    line: `Explore ${item.name.toLowerCase()} designed for reliable performance and daily comfort.`,
  };
}

function HeroVisualCard({
  item,
  slot,
  priority,
}: {
  item: HeroItem;
  slot: HeroSlot;
  priority: boolean;
}) {
  return (
    <div className={heroVisualCardClass(slot)}>
      <div className="pointer-events-none absolute inset-x-[8%] bottom-[8%] hidden h-24 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.34),transparent_68%)] blur-2xl lg:block" />
      <div data-ref-product-inner={slot === "active" ? "" : undefined} className="relative h-full">
        <div className="relative mx-auto aspect-square w-[72%] lg:w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes={slot === "active" ? "(min-width: 1024px) 520px, 72vw" : "(min-width: 1024px) 260px, 44vw"}
            className="object-contain drop-shadow-[0_28px_44px_rgba(2,24,35,0.32)]"
            priority={priority}
            unoptimized={isRemoteImage(item.image)}
          />
        </div>
      </div>
    </div>
  );
}
function heroVisualCardClass(slot: HeroSlot) {
  const base =
    "absolute overflow-visible rounded-none border-0 bg-transparent shadow-none backdrop-blur-0 transition-[left,top,width,transform,opacity,filter] duration-[1450ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform";

  if (slot === "active") {
    return `${base} left-[13%] top-[50%] z-30 w-[74%] max-w-[310px] -translate-y-1/2 opacity-100 blur-0 md:left-[24%] md:w-[56%] lg:left-[32%] lg:top-[48%] lg:w-[58%] lg:max-w-[520px]`;
  }

  if (slot === "upcoming") {
    return `${base} left-[88%] top-[24%] z-20 w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.82] opacity-0 blur-[0.25px] lg:left-[72%] lg:top-[25%] lg:scale-[0.86] lg:opacity-55`;
  }

  if (slot === "leaving") {
    return `${base} left-[0%] top-[66%] z-10 w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.78] opacity-0 blur-sm lg:left-[8%] lg:scale-[0.82]`;
  }

  return `${base} left-[94%] top-[38%] z-0 w-[34%] max-w-[270px] -translate-y-1/2 scale-[0.78] opacity-0 blur-sm`;
}







