"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/types/product";

export function HeroCategoryShowcase({ categories }: { categories: Category[] }) {
  const showcaseItems = categories.length > 0 ? categories.slice(0, 6) : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (showcaseItems.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % showcaseItems.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [showcaseItems.length]);

  if (showcaseItems.length === 0) {
    return (
      <div className="hero-category-showcase">
        <div className="hero-category-image-stage">
          <Image
            src="/images/products/hero-purifier.svg"
            alt="Priya's Aqua Fresh water purifier"
            fill
            sizes="(min-width: 1024px) 430px, 90vw"
            className="object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  const activeCategory = showcaseItems[activeIndex];

  return (
    <Link
      href={`/products?category=${activeCategory.slug}`}
      className="hero-category-showcase group"
      aria-label={`Shop ${activeCategory.name}`}
    >
      <div className="hero-category-image-stage">
        {showcaseItems.map((category, index) => (
          <Image
            key={category.id}
            src={category.image}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 430px, 90vw"
            className={`hero-category-image object-contain transition duration-700 ease-out ${
              index === activeIndex
                ? "translate-x-0 translate-y-0 scale-100 opacity-100 group-hover:scale-[1.03]"
                : "translate-x-10 translate-y-6 scale-95 opacity-0"
            }`}
            priority={index === 0}
            unoptimized
          />
        ))}
      </div>
      <span key={activeCategory.id} className="hero-category-name">
        {activeCategory.name}
      </span>
    </Link>
  );
}
