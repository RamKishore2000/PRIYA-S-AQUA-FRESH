"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export function HomeAnimations() {
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>("[data-home-reveal]");
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const targets = section.querySelectorAll("[data-reveal-item]");
      gsap.set(targets.length ? targets : section, { autoAlpha: 0, y: 34, filter: "blur(10px)" });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          gsap.to(targets.length ? targets : section, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          });
          observer.disconnect();
        },
        { threshold: 0.18 },
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return null;
}
