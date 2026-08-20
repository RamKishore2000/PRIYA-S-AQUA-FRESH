"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LogoShowcaseItem } from "@/data/logo-showcase";

gsap.registerPlugin(ScrollTrigger);

type AnimatedLogoShowcaseProps = {
  title: string;
  logos: LogoShowcaseItem[];
  direction: "left" | "right";
  duration?: number;
  enableCenterFocus?: boolean;
};

const slotStates = [
  { x: "-190%", scale: 0.9, opacity: 0.78, rotation: 0, zIndex: 1 },
  { x: "-114%", scale: 0.96, opacity: 0.9, rotation: 0, zIndex: 2 },
  { x: "-38%", scale: 1, opacity: 1, rotation: 0, zIndex: 5 },
  { x: "38%", scale: 1, opacity: 1, rotation: 0, zIndex: 5 },
  { x: "114%", scale: 0.96, opacity: 0.9, rotation: 0, zIndex: 2 },
  { x: "190%", scale: 0.9, opacity: 0.78, rotation: 0, zIndex: 1 },
];

function getVisibleSlot(index: number, activeIndex: number, total: number) {
  const raw = (index - activeIndex + total) % total;
  if (raw > 5) return null;
  return raw;
}

export function AnimatedLogoShowcase({ title, logos, direction }: AnimatedLogoShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<HTMLButtonElement[]>([]);
  const timerRef = useRef<gsap.core.Tween | null>(null);
  const activeIndexRef = useRef(0);
  const startedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const visibleLogos = useMemo(() => logos.slice(0, 5), [logos]);
  const showcaseLogos = logos.length >= 5 ? logos : visibleLogos;

  const positionItems = useCallback(
    (nextIndex: number, immediate = false) => {
      const itemNodes = itemRefs.current.filter(Boolean);
      const movementDirection = direction === "right" ? -1 : 1;

      itemNodes.forEach((item, index) => {
        const slot = getVisibleSlot(index, nextIndex, showcaseLogos.length);
        const state = slot === null ? null : slotStates[slot];

        gsap.to(item, {
          x: state ? state.x : `${movementDirection * 330}%`,
          scale: state?.scale ?? 0.6,
          autoAlpha: state?.opacity ?? 0,
          rotation: state ? state.rotation * movementDirection : 0,
          zIndex: state?.zIndex ?? 0,
          duration: immediate ? 0 : 0.82,
          ease: immediate ? "none" : "back.out(.95)",
          overwrite: "auto",
        });
      });
    },
    [direction, showcaseLogos.length],
  );

  const goTo = useCallback(
    (nextIndex: number) => {
      const wrapped = gsap.utils.wrap(0, showcaseLogos.length, nextIndex);
      activeIndexRef.current = wrapped;
      setActiveIndex(wrapped);
      positionItems(wrapped);
    },
    [positionItems, showcaseLogos.length],
  );

  const scheduleNext = useCallback(() => {
    if (!startedRef.current) return;
    timerRef.current?.kill();
    timerRef.current = gsap.delayedCall(2.6, () => {
      goTo(activeIndexRef.current + (direction === "right" ? -1 : 1));
    });
  }, [direction, goTo]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

      if (mediaQuery.matches) {
        setReducedMotion(true);
        gsap.set(section.querySelectorAll("[data-showcase-reveal]"), { autoAlpha: 1, y: 0 });
        return;
      }

      positionItems(activeIndex, true);
      gsap.set(section.querySelectorAll("[data-showcase-reveal]"), { autoAlpha: 0, y: 24 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              startedRef.current = true;
              scheduleNext();
            },
            onLeaveBack: () => {
              startedRef.current = false;
              timerRef.current?.kill();
            },
          },
        })
        .to(section.querySelector("[data-showcase-heading]"), { autoAlpha: 1, y: 0, duration: 0.72 })
        .to(section.querySelector("[data-showcase-stage]"), { autoAlpha: 1, y: 0, duration: 0.82 }, "-=0.34");
    }, section);

    return () => {
      timerRef.current?.kill();
      timerRef.current = null;
      ctx.revert();
    };
  }, [positionItems, scheduleNext]);

  useEffect(() => {
    if (reducedMotion) return;
    scheduleNext();
    return () => {
      timerRef.current?.kill();
      timerRef.current = null;
    };
  }, [activeIndex, reducedMotion, scheduleNext]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden border-y border-white/10 bg-white/[0.025] px-4 py-8 text-white backdrop-blur-sm md:px-8 md:py-10"
    >
      <div className="mx-auto max-w-7xl overflow-hidden">
        <h2 data-showcase-reveal data-showcase-heading className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          {title}
        </h2>

        {reducedMotion ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {showcaseLogos.map((logo) => (
              <div key={logo.id} className="flex h-32 items-center justify-center p-5">
                <Image src={logo.image} alt={logo.name} width={150} height={150} className="h-20 w-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.26)]" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div
              data-showcase-reveal
              data-showcase-stage
              className="relative mt-3 h-[170px] overflow-hidden md:h-[230px] lg:h-[270px]"
              onMouseEnter={() => timerRef.current?.pause()}
              onMouseLeave={() => timerRef.current?.resume()}
            >
              <div className="absolute left-1/2 top-1/2 h-[1px] w-[1px] -translate-x-1/2 -translate-y-1/2">
                {showcaseLogos.map((logo, index) => (
                  <button
                    key={logo.id}
                    type="button"
                    aria-label={`Show ${logo.name}`}
                    onClick={() => goTo(index)}
                    ref={(node) => {
                      if (node) itemRefs.current[index] = node;
                    }}
                    className="absolute left-1/2 top-1/2 flex h-40 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center p-2 outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-[#12a8e6] md:h-48 md:w-72 lg:h-56 lg:w-80"
                  >
                    <Image
                      src={logo.image}
                      alt={logo.name}
                      width={150}
                      height={150}
                      sizes="(max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
                      className={
                        logo.id === "priyas-aqua-mart"
                          ? "h-20 w-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.32)] md:h-24 lg:h-28"
                          : "h-28 w-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.32)] md:h-36 lg:h-44"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
