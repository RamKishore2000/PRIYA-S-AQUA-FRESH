"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutGsapAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-about-reveal]");

      if (reduceMotion) {
        gsap.set(revealItems, { autoAlpha: 1, clearProps: "transform" });
        gsap.set("[data-about-line]", { scaleY: 1 });
        return;
      }

      gsap.set("[data-about-word]", { yPercent: 115, autoAlpha: 0 });
      gsap.to("[data-about-word]", {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.06,
      });

      revealItems.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.74,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-about-mask]").forEach((item) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(0 100% 0 0)", autoAlpha: 0.7 },
          {
            clipPath: "inset(0 0% 0 0)",
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.fromTo(
        "[data-about-line]",
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-about-vision]",
            start: "top 76%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return null;
}
