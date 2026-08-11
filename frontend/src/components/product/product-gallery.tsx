"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const validImages = images.length > 0 ? images : ["/images/products/hero-purifier.svg"];
  const [activeImage, setActiveImage] = useState(validImages[0]);

  return (
    <div className="grid gap-5 md:grid-cols-[92px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
        {validImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            aria-label={`Show product image ${index + 1}`}
            onClick={() => setActiveImage(image)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md transition md:h-24 md:w-24",
              activeImage === image ? "ring-2 ring-[#12a8e6]" : "opacity-75 hover:opacity-100",
            )}
          >
            <Image src={image} alt={`${name} image ${index + 1}`} fill sizes="96px" className="object-contain" unoptimized />
          </button>
        ))}
      </div>
      <div className="relative order-1 min-h-[360px] overflow-visible md:order-2 md:min-h-[520px]">
        <div className="pointer-events-none absolute inset-x-12 bottom-8 h-20 rounded-full bg-black/45 blur-3xl" />
        <Image src={activeImage} alt={name} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-contain drop-shadow-[0_28px_48px_rgba(0,0,0,0.34)]" unoptimized />
      </div>
    </div>
  );
}
