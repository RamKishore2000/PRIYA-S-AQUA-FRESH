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

type BannerSlot = "center" | "top" | "bottom" | "hidden";
type BannerItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  glow: string;
  accent: string;
};

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
    document.documentElement.style.setProperty("--home-hero-accent", activeItem.accent);
  }, [activeItem.accent]);

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
    <section className="relative min-h-[680px] overflow-hidden bg-[#10181d] px-4 pb-16 pt-28 md:px-8 lg:min-h-[730px] lg:pt-32">
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(circle at 76% 42%, ${activeItem.glow}, transparent 30%), radial-gradient(circle at 18% 24%, rgba(255,255,255,0.11), transparent 24%), linear-gradient(112deg, #121a20 0%, #1d2930 45%, #102019 100%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:46px_46px] opacity-20 [transform:perspective(780px)_rotateX(66deg)_translateY(84px)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0d1114] via-[#0d1114]/62 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div ref={copyRef} className="relative z-20 max-w-xl lg:-translate-y-10">
          <div key={activeItem.title}>
            <div className="hero-copy-step mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 opacity-0 backdrop-blur">
              <Droplets className="h-4 w-4" style={{ color: activeItem.accent }} />
              Priya&apos;s Aqua Fresh
            </div>
            <h1 className="hero-copy-step max-w-2xl font-serif text-4xl font-medium leading-[0.98] tracking-normal text-white opacity-0 sm:text-5xl md:text-6xl">
              {activeItem.title}
            </h1>
            <p className="hero-copy-step mt-5 max-w-2xl text-lg leading-8 text-slate-300 opacity-0 md:text-xl md:leading-9">
              {activeItem.description}
            </p>
            <div className="hero-copy-step mt-6 flex flex-col gap-3 opacity-0 sm:flex-row">
              <LinkButton
                href={activeItem.href}
                size="lg"
                className="rounded-full px-7 text-white shadow-[0_18px_38px_rgba(45,212,191,0.22)]"
                style={{ backgroundColor: activeItem.accent }}
              >
                Explore Range <ArrowRight className="h-5 w-5" />
              </LinkButton>
              <LinkButton
                href="/contact"
                size="lg"
                variant="secondary"
                className="rounded-full border-white/20 bg-white/5 px-7 text-white backdrop-blur hover:bg-white hover:text-slate-950"
              >
                Contact Expert
              </LinkButton>
            </div>
          </div>
        </div>

        <div className="relative z-10 min-h-[430px] sm:min-h-[520px] lg:min-h-[590px]" aria-label="Priya's Aqua Fresh banner showcase">
          <div className="pointer-events-none absolute left-[8%] top-[19%] h-[62%] w-[64%] rounded-full blur-[90px]" style={{ backgroundColor: activeItem.glow }} />
          {bannerItems.map((item, index) => (
            <BannerProductSlot
              key={item.id}
              item={item}
              slot={getBannerSlot(index, activeIndex, indexes.previous, indexes.next)}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function getBannerSlot(index: number, activeIndex: number, previousIndex: number, nextIndex: number): BannerSlot {
  if (index === activeIndex) {
    return "center";
  }
  if (index === nextIndex) {
    return "top";
  }
  if (index === previousIndex) {
    return "bottom";
  }
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

function BannerProductSlot({
  item,
  slot,
  priority = false,
}: {
  item: BannerItem;
  slot: BannerSlot;
  priority?: boolean;
}) {
  return (
    <div className={bannerSlotClass(slot)}>
      <BannerImage item={item} slot={slot} priority={priority} />
    </div>
  );
}

function BannerImage({ item, slot, priority }: { item: BannerItem; slot: BannerSlot; priority: boolean }) {
  return (
    <Image
      src={item.image}
      alt={item.title}
      fill
      sizes={slot === "center" ? "(min-width: 1024px) 860px, 92vw" : "(min-width: 1024px) 260px, 34vw"}
      className="object-contain drop-shadow-[0_28px_34px_rgba(0,0,0,0.34)]"
      priority={priority}
      unoptimized={isRemoteImage(item.image)}
    />
  );
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function bannerSlotClass(slot: BannerSlot) {
  const base =
    "absolute aspect-square overflow-hidden rounded-sm transition-[left,top,width,transform,opacity,filter] duration-[1650ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform";

  if (slot === "center") {
    return `${base} left-[7%] top-1/2 z-30 w-[54%] -translate-y-1/2 scale-100 opacity-100 blur-0`;
  }

  if (slot === "top") {
    return `${base} left-[76%] top-[2%] z-20 w-[22%] scale-100 opacity-[0.78] blur-[0.15px]`;
  }

  if (slot === "bottom") {
    return `${base} left-[76%] top-[73%] z-10 w-[19%] scale-100 opacity-45 blur-[0.35px]`;
  }

  return `${base} left-[96%] top-[88%] z-0 w-[14%] scale-[0.68] opacity-0 blur-sm`;
}
