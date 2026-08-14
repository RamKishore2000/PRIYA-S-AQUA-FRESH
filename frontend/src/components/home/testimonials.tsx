"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RatingStars } from "@/components/common/rating-stars";
import { SectionHeader } from "@/components/common/section-header";
import { TestimonialCard } from "@/components/home/testimonial-card";
import type { Testimonial } from "@/types/product";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);
  const [trackWidth, setTrackWidth] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLayout = () => {
      const width = viewportRef.current?.offsetWidth ?? 0;
      setTrackWidth(width);
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setTransitionEnabled(true);
      setActiveIndex((index) => index + 1);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const carouselItems = useMemo(
    () => [...testimonials, ...testimonials.slice(0, Math.max(3, visibleCount))],
    [testimonials, visibleCount],
  );
  const averageRating = testimonials.length
    ? testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) / testimonials.length
    : 0;

  const slideWidth = visibleCount > 0 ? trackWidth / visibleCount : 0;

  const goToPrevious = () => {
    if (testimonials.length === 0) return;
    setTransitionEnabled(true);
    setActiveIndex((index) => (index - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setTransitionEnabled(true);
    setActiveIndex((index) => index + 1);
  };

  const handleTransitionEnd = () => {
    if (testimonials.length === 0) return;
    if (activeIndex >= testimonials.length) {
      setTransitionEnabled(false);
      setActiveIndex(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTransitionEnabled(true));
      });
    }
  };

  return (
    <section className="bg-transparent py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader title="What Our Customers Say" subtitle="A premium buying experience backed by support and practical product guidance." variant="dark" />
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-sm backdrop-blur">
              <p className="text-4xl font-bold text-[#12a8e6]">{averageRating.toFixed(1)} / 5</p>
              <div className="mt-2"><RatingStars rating={averageRating} reviewCount={testimonials.length} /></div>
              <p className="mt-2 text-sm text-slate-300">
                {testimonials.length > 0 ? `Based on ${testimonials.length} customer reviews` : "Customer reviews will appear here"}
              </p>
            </div>
          </div>
          <div
            ref={viewportRef}
            className="overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {testimonials.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.06] p-6 text-sm font-semibold text-slate-300 shadow-sm">
                Customer reviews will appear here.
              </div>
            ) : (
            <>
            <div
              className={`flex ${transitionEnabled ? "transition-transform duration-700 ease-in-out" : ""}`}
              style={{ transform: `translateX(-${activeIndex * slideWidth}px)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {carouselItems.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="shrink-0 px-2"
                  style={{ width: slideWidth || "100%" }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
            </>
            )}
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    aria-label={`Show testimonial ${index + 1}`}
                    onClick={() => {
                      setTransitionEnabled(true);
                      setActiveIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      activeIndex % testimonials.length === index ? "w-7 bg-[#12a8e6]" : "w-2 bg-white/25"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#12a8e6]/35 bg-[#12a8e6] text-white shadow-[0_12px_28px_rgba(18,168,230,0.22)] transition hover:border-[#12a8e6] hover:bg-[#0871cf]"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5 stroke-[2.4]" />
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#12a8e6]/35 bg-[#12a8e6] text-white shadow-[0_12px_28px_rgba(18,168,230,0.22)] transition hover:border-[#12a8e6] hover:bg-[#0871cf]"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5 stroke-[2.4]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
