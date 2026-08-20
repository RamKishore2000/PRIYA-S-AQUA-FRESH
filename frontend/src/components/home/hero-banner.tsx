"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowRight, Droplets } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { Banner, Category } from "@/types/product";

const bannerItemConfig = [
  {
    title: "Alkaline Water Purifiers",
    slugs: ["alkaline-water-purifiers", "alkaline"],
    description: "Balanced alkaline purification for fresh-tasting everyday drinking water with dependable home performance.",
    href: "/products?category=alkaline-water-purifiers",
    glow: "rgba(45, 212, 191, 0.34)",
    accent: "#2dd4bf",
  },
  {
    title: "RO Water Purifiers",
    slugs: ["ro-water-purifiers", "ro-purifiers", "ro"],
    description: "Advanced RO filtration built to reduce impurities and deliver clean, safe water for modern homes.",
    href: "/products?category=ro-water-purifiers",
    glow: "rgba(56, 189, 248, 0.34)",
    accent: "#38bdf8",
  },
  {
    title: "Commercial Water Purifiers",
    slugs: ["commercial-water-purifiers", "commercial"],
    description: "High-capacity purification systems for offices, hotels, schools, hospitals and business spaces.",
    href: "/commercial",
    glow: "rgba(74, 222, 128, 0.3)",
    accent: "#4ade80",
  },
  {
    title: "Electronics",
    slugs: ["electronics", "smart-tvs", "smart-tv"],
    description: "Smart electronics and home essentials selected for reliable performance and everyday convenience.",
    href: "/products?category=electronics",
    glow: "rgba(129, 140, 248, 0.32)",
    accent: "#818cf8",
  },
  {
    title: "Water Softners",
    slugs: ["water-softners", "water-softeners", "softeners"],
    description: "Water softening solutions designed to protect appliances, improve water feel and support daily comfort.",
    href: "/products?category=water-softners",
    glow: "rgba(52, 211, 153, 0.32)",
    accent: "#34d399",
  },
  {
    title: "Spare Parts",
    slugs: ["spare-parts", "spares"],
    description: "Genuine purifier parts, filters and service essentials to keep your system running smoothly.",
    href: "/products?category=spare-parts",
    glow: "rgba(14, 165, 233, 0.32)",
    accent: "#0ea5e9",
  },
];

type BannerItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  glow: string;
  accent: string;
};
type BannerSlot = "active" | "upcoming" | "leaving" | "hidden";

export function HeroBanner({ categories, banners }: { categories: Category[]; banners: Banner[] }) {
  const bannerItems = useMemo(() => buildBannerItems({ categories, banners }), [banners, categories]);
  const itemCount = bannerItems.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = bannerItems[activeIndex];
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let delayedCall: gsap.core.Tween | undefined;

    const rotate = () => {
      setActiveIndex((current) => (current + 1) % itemCount);
      delayedCall = gsap.delayedCall(5.2, rotate);
    };

    delayedCall = gsap.delayedCall(5.2, rotate);

    return () => {
      delayedCall?.kill();
    };
  }, [itemCount]);

  useEffect(() => {
    if (!copyRef.current) return;

    const copySteps = gsap.utils.toArray<HTMLElement>(copyRef.current.querySelectorAll(".hero-copy-step"));
    gsap.killTweensOf(copySteps);
    gsap.fromTo(
      copySteps,
      {
        autoAlpha: 0,
        y: 42,
        filter: "blur(8px)",
      },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.05,
        stagger: 0.28,
        ease: "power3.out",
      },
    );
  }, [activeIndex]);

  const indexes = useMemo(() => {
    const previous = (activeIndex - 1 + itemCount) % itemCount;
    const next = (activeIndex + 1) % itemCount;
    return { previous, next };
  }, [activeIndex, itemCount]);

  return (
    <section className="relative overflow-hidden bg-transparent pb-0 pt-0">
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(circle at 78% 28%, ${activeItem.glow}, transparent 25%)`,
        }}
      />

      <div className="relative w-full">
        <div className="relative overflow-hidden border-b border-white/10 bg-[#061511]/42 px-5 pb-7 pt-18 backdrop-blur-xl sm:px-8 sm:pt-20 md:pb-9 md:pt-22 lg:min-h-[560px] lg:px-12 lg:pt-28">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.045),transparent_42%)]" />

          <div className="relative grid items-center gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8">
            <div ref={copyRef} className="relative z-20 order-2 mx-auto max-w-xl text-center lg:order-1 lg:mx-0 lg:-translate-y-2 lg:text-left">
              <div key={activeItem.title}>
                <div className="hero-copy-step mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200 opacity-0 backdrop-blur sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em] lg:mb-4">
                  <Droplets className="h-4 w-4" style={{ color: activeItem.accent }} />
                  Priya&apos;s Aqua Fresh
                </div>
                <h1 className="hero-copy-step mx-auto max-w-2xl font-serif text-2xl font-medium leading-[1.06] tracking-normal text-white opacity-0 sm:text-3xl md:text-4xl lg:mx-0 lg:text-[3.45rem] lg:leading-[0.98]">
                  {activeItem.title}
                </h1>
                <p className="hero-copy-step mx-auto mt-3 hidden max-w-xl text-sm leading-6 text-slate-300 opacity-0 sm:text-base sm:leading-7 md:text-lg md:leading-8 lg:mx-0 lg:mt-4 lg:block">
                  {activeItem.description}
                </p>
                <div className="hero-copy-step mx-auto mt-4 grid w-full max-w-xs grid-cols-2 gap-2 opacity-0 sm:max-w-sm sm:gap-3 lg:mx-0 lg:mt-5 lg:max-w-none lg:flex lg:flex-row lg:justify-start">
                  <LinkButton
                    href={activeItem.href}
                    size="lg"
                    className="h-10 rounded-full !bg-[#12a8e6] px-2 text-[11px] !text-white shadow-none hover:!bg-[#0871cf] sm:px-5 sm:text-sm lg:h-12 lg:px-7 lg:text-base"
                  >
                    Explore Range <ArrowRight className="h-5 w-5" />
                  </LinkButton>
                  <LinkButton
                    href="/contact"
                    size="lg"
                    variant="secondary"
                    className="h-10 rounded-full !border-[#12a8e6]/35 !bg-[#12a8e6]/10 px-2 text-[11px] !text-white backdrop-blur hover:!border-[#12a8e6] hover:!bg-[#12a8e6] hover:!text-white sm:px-5 sm:text-sm lg:h-12 lg:px-7 lg:text-base"
                  >
                    Contact Expert
                  </LinkButton>
                </div>
              </div>
            </div>

            <div className="relative z-10 order-1 min-h-[185px] sm:min-h-[235px] md:min-h-[285px] lg:order-2 lg:min-h-[430px]" aria-label="Priya's Aqua Fresh banner showcase">
              {bannerItems.map((item, index) => (
                <BannerCard
                  key={item.id}
                  item={item}
                  slot={getBannerCardSlot(index, activeIndex, indexes.next, indexes.previous)}
                  priority={index === 0}
                />
              ))}
              <div className="absolute bottom-2 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 lg:bottom-[13%] lg:left-auto lg:right-[22%] lg:translate-x-0">
                {bannerItems.slice(0, Math.min(itemCount, 6)).map((item, index) => (
                  <span
                    key={`dot-${item.id}`}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === activeIndex ? "w-7 bg-white" : "w-2 bg-white/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getBannerCardSlot(index: number, activeIndex: number, nextIndex: number, previousIndex: number): BannerSlot {
  if (index === activeIndex) return "active";
  if (index === nextIndex) return "upcoming";
  if (index === previousIndex) return "leaving";
  return "hidden";
}

function buildBannerItems({ categories, banners }: { categories: Category[]; banners: Banner[] }): BannerItem[] {
  const categoryItems = buildCategoryBannerItems(categories);

  if (banners.length > 0) {
    const bannerItems = banners.map((banner) => ({
      id: `banner-${banner.id}`,
      title: banner.title,
      description: banner.description,
      image: banner.image,
      href: banner.buttonLink,
      glow: banner.glowColor,
      accent: banner.themeColor,
    }));

    if (bannerItems.length >= 3) {
      return bannerItems;
    }

    const uploadedTitles = new Set(bannerItems.map((item) => item.title.toLowerCase()));
    return [
      ...bannerItems,
      ...categoryItems.filter((item) => !uploadedTitles.has(item.title.toLowerCase())),
    ].slice(0, 6);
  }

  return categoryItems;
}

function buildCategoryBannerItems(categories: Category[]): BannerItem[] {
  return bannerItemConfig.map((item) => {
    const category = categories.find((candidate) => {
      const candidateName = candidate.name.toLowerCase();
      return item.slugs.includes(candidate.slug) || candidateName === item.title.toLowerCase();
    });

    return {
      id: `category-${category?.slug || item.title.toLowerCase().replaceAll(" ", "-")}`,
      title: item.title,
      description: item.description,
      image: category?.image || categories[0]?.image || "/images/products/hero-purifier.svg",
      href: category ? `/products?category=${category.slug}` : item.href,
      glow: item.glow,
      accent: item.accent,
    };
  });
}

function BannerCard({ item, slot, priority }: { item: BannerItem; slot: BannerSlot; priority: boolean }) {
  return (
    <div className={bannerCardClass(slot)}>
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_42%)] lg:block" />
      <div className="relative mx-auto aspect-square w-full lg:mt-4 lg:w-[70%]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes={slot === "active" ? "(min-width: 1024px) 360px, 72vw" : "(min-width: 1024px) 260px, 44vw"}
          className="object-contain"
          priority={priority}
          unoptimized={isRemoteImage(item.image)}
        />
      </div>
      <div className="relative hidden px-6 pb-5 pt-3 lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Featured range</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-semibold tracking-normal text-white md:text-2xl">{item.title}</h3>
        <LinkButton
          href={item.href}
          size="sm"
          className="mt-4 rounded-full !border !border-[#12a8e6]/35 !bg-[#12a8e6]/10 px-6 !text-white backdrop-blur hover:!border-[#12a8e6] hover:!bg-[#12a8e6] hover:!text-white"
        >
          Explore <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </div>
    </div>
  );
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function bannerCardClass(slot: BannerSlot) {
  const base =
    "absolute overflow-hidden rounded-[1.65rem] border border-transparent bg-transparent shadow-none transition-[left,top,width,transform,opacity,filter] duration-[1450ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform lg:border-white/12 lg:bg-[#06120f]/88 lg:backdrop-blur-xl";

  if (slot === "active") {
    return `${base} left-1/2 top-1/2 z-30 w-[58%] max-w-[210px] -translate-x-1/2 -translate-y-1/2 opacity-100 blur-0 sm:w-[42%] sm:max-w-[245px] md:max-w-[270px] lg:left-[32%] lg:top-[56%] lg:w-[52%] lg:max-w-[360px] lg:translate-x-0`;
  }

  if (slot === "upcoming") {
    return `${base} left-[72%] top-[35%] z-20 hidden w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.86] opacity-55 blur-[0.25px] lg:block`;
  }

  if (slot === "leaving") {
    return `${base} left-[8%] top-[76%] z-10 hidden w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.82] opacity-0 blur-sm lg:block`;
  }

  return `${base} left-[94%] top-[38%] z-0 hidden w-[34%] max-w-[270px] -translate-y-1/2 scale-[0.78] opacity-0 blur-sm lg:block`;
}
