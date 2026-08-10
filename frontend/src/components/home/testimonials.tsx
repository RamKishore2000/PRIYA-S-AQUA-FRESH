"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RatingStars } from "@/components/common/rating-stars";
import { SectionHeader } from "@/components/common/section-header";
import { TestimonialCard } from "@/components/home/testimonial-card";
import { Button } from "@/components/ui/button";
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
    <section className="bg-slate-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader title="What Our Customers Say" subtitle="A premium buying experience backed by support and practical product guidance." />
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-4xl font-bold text-slate-950">{averageRating.toFixed(1)} / 5</p>
              <div className="mt-2"><RatingStars rating={averageRating} reviewCount={testimonials.length} /></div>
              <p className="mt-2 text-sm text-slate-500">
                {testimonials.length > 0 ? `Based on ${testimonials.length} active testimonials` : "Testimonials will appear after approval"}
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
              <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500 shadow-sm">
                Customer testimonials will appear here after approval.
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
                      activeIndex % testimonials.length === index ? "w-7 bg-teal-600" : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" aria-label="Previous testimonial" onClick={goToPrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" aria-label="Next testimonial" onClick={goToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
