"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, Droplets, PackageCheck, UsersRound } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowIcon } from "@/components/ui/icons";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Award, value: "10+", label: "Years of Experience" },
  { icon: UsersRound, value: "25,000+", label: "Happy Customers" },
  { icon: PackageCheck, value: "50+", label: "Premium Products" },
  { icon: Droplets, value: "100%", label: "Pure & Safe Water" },
];

export function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const image = section.querySelector<HTMLElement>("[data-why-image]");
      const revealItems = Array.from(section.querySelectorAll<HTMLElement>("[data-why-reveal]"));

      if (reduceMotion) {
        gsap.set([...(image ? [image] : []), ...revealItems], { autoAlpha: 1, clearProps: "transform,clipPath,filter" });
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
            duration: 1.15,
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
        { autoAlpha: 0, y: 38, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "restart none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#F8F3EC] px-4 py-8 text-white md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[1.35rem] border border-[#E5D8C7] bg-[linear-gradient(115deg,#073133_0%,#06282A_48%,#083C3A_100%)] p-3 shadow-[0_18px_45px_rgba(28,43,38,0.18)]">
          <div className="pointer-events-none absolute inset-0 opacity-55 bg-[radial-gradient(circle_at_18%_45%,rgba(216,184,121,0.18),transparent_28%),radial-gradient(circle_at_62%_12%,rgba(18,168,230,0.12),transparent_24%)]" />
          <div className="pointer-events-none absolute left-[8%] top-0 h-full w-[28%] rounded-t-full border border-[#C59A55]/35 opacity-45" />
          <div className="relative grid gap-5 rounded-[1rem] border border-[#D8B879]/35 p-4 md:p-5 lg:grid-cols-[0.92fr_0.9fr_0.86fr] lg:items-center">
            <div data-why-image className="relative min-h-[260px] overflow-hidden rounded-[0.9rem] bg-[linear-gradient(135deg,rgba(255,249,241,0.12),rgba(255,255,255,0.02))] md:min-h-[310px] lg:min-h-[330px]">
              <div className="absolute right-4 top-4 z-10 flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full border-2 border-teal-500/25 bg-[radial-gradient(circle_at_30%_22%,#ffffff,#f0fdfa_58%,#ccfbf1)] text-center shadow-[0_16px_34px_rgba(15,23,42,0.16)]">
                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-700">India</span>
                <span className="text-2xl font-black leading-none text-slate-950">No. 1</span>
                <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-600">Purifiers</span>
              </div>
              <div className="absolute bottom-5 left-1/2 h-16 w-[74%] -translate-x-1/2 rounded-[100%] bg-[#FFF9F1]/90 shadow-[0_18px_46px_rgba(0,0,0,0.28)]" />
              <div className="absolute left-7 top-10 h-32 w-16 rounded-full border border-[#D8B879]/25" />
              <Image src="/Untitled-design-10-2048x2048.png" alt="Priya's Aqua Fresh purifier" fill sizes="420px" className="object-contain p-6 drop-shadow-[0_34px_70px_rgba(0,0,0,0.35)]" />
            </div>

            <div data-why-reveal className="px-1 lg:px-3">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D8B879]">Why We Are</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#FFF9F1] md:text-4xl">
                Trusted by Thousands Across India
              </h2>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-[#D8E4E0] md:text-[0.95rem]">
                At Priya&apos;s Aqua Fresh, we strive every water to the standard of purity and safety. Our advanced purifiers ensure water of highest quality, 100% pure and safe.
              </p>
              <Link href="/about" className="mt-5 inline-flex items-center gap-2 rounded-md border border-[#C59A55] bg-[#0A3A38]/40 px-4 py-2.5 text-xs font-black text-[#FFE5AF] transition hover:bg-[#C59A55] hover:text-[#06282A]">
                Know More About Us
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article key={stat.label} data-why-reveal className="rounded-xl border border-[#D8B879] bg-[#FFF9F1] p-4 text-[#253636] shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(216,184,121,0.22)]">
                    <div className="flex items-center gap-3">
                      <Icon className="h-9 w-9 shrink-0 text-[#B47A2F]" strokeWidth={1.7} />
                      <div>
                        <p className="font-serif text-2xl font-semibold leading-none text-[#B47A2F]">{stat.value}</p>
                        <p className="mt-1 text-xs font-black leading-4 text-[#4F5D5C]">{stat.label}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
