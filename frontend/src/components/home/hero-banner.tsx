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

    return () => delayedCall?.kill();
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
        <div className="relative overflow-hidden border-b border-white/10 bg-[#061511]/42 px-5 pb-8 pt-24 backdrop-blur-xl sm:px-8 md:pb-10 lg:min-h-[560px] lg:px-12 lg:pt-28">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.045),transparent_42%)]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[0.86fr_1.14fr]">
            <div ref={copyRef} className="relative z-20 max-w-xl lg:-translate-y-2">
              <div key={activeItem.title}>
                <div className="hero-copy-step mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 opacity-0 backdrop-blur">
                  <Droplets className="h-4 w-4" style={{ color: activeItem.accent }} />
                  Priya&apos;s Aqua Fresh
                </div>
                <h1 className="hero-copy-step max-w-2xl font-serif text-4xl font-medium leading-[0.98] tracking-normal text-white opacity-0 sm:text-5xl md:text-[3.45rem]">
                  {activeItem.title}
                </h1>
                <p className="hero-copy-step mt-4 max-w-xl text-base leading-7 text-slate-300 opacity-0 md:text-lg md:leading-8">
                  {activeItem.description}
                </p>
                <div className="hero-copy-step mt-5 flex flex-col gap-3 opacity-0 sm:flex-row">
                  <LinkButton
                    href={activeItem.href}
                    size="lg"
                    className="rounded-full !bg-[#12a8e6] px-7 !text-white shadow-none hover:!bg-[#0871cf]"
                  >
                    Explore Range <ArrowRight className="h-5 w-5" />
                  </LinkButton>
                  <LinkButton
                    href="/contact"
                    size="lg"
                    variant="secondary"
                    className="rounded-full !border-[#12a8e6]/35 !bg-[#12a8e6]/10 px-7 !text-white backdrop-blur hover:!border-[#12a8e6] hover:!bg-[#12a8e6] hover:!text-white"
                  >
                    Contact Expert
                  </LinkButton>
                </div>
              </div>
            </div>

            <div className="relative z-10 min-h-[330px] sm:min-h-[400px] lg:min-h-[430px]" aria-label="Priya's Aqua Fresh banner showcase">
              {bannerItems.map((item, index) => (
                <BannerCard
                  key={item.id}
                  item={item}
                  slot={getBannerCardSlot(index, activeIndex, indexes.next, indexes.previous)}
                  priority={index === 0}
                />
              ))}
              <div className="absolute bottom-[13%] right-[18%] z-40 flex items-center gap-2 lg:right-[22%]">
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
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_42%)]" />
      <div className="relative mx-auto mt-4 aspect-square w-[70%]">
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
      <div className="relative px-6 pb-5 pt-3">
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
    "absolute overflow-hidden rounded-[1.65rem] border border-white/12 bg-[#06120f]/88 shadow-none backdrop-blur-xl transition-[left,top,width,transform,opacity,filter] duration-[1450ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform";

  if (slot === "active") {
    return `${base} left-[32%] top-[56%] z-30 w-[52%] max-w-[360px] -translate-y-1/2 opacity-100 blur-0`;
  }

  if (slot === "upcoming") {
    return `${base} left-[72%] top-[35%] z-20 w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.86] opacity-55 blur-[0.25px]`;
  }

  if (slot === "leaving") {
    return `${base} left-[8%] top-[76%] z-10 w-[36%] max-w-[285px] -translate-y-1/2 scale-[0.82] opacity-0 blur-sm`;
  }

  return `${base} left-[94%] top-[38%] z-0 w-[34%] max-w-[270px] -translate-y-1/2 scale-[0.78] opacity-0 blur-sm`;
}
