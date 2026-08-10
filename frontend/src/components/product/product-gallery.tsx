"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const validImages = images.length > 0 ? images : ["/images/products/hero-purifier.svg"];
  const [activeImage, setActiveImage] = useState(validImages[0]);

  return (
    <div className="grid gap-4 md:grid-cols-[84px_1fr]">
      {validImages.length > 1 ? (
        <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`Show product image ${index + 1}`}
              onClick={() => setActiveImage(image)}
              className={cn(
                "relative h-20 w-20 shrink-0 rounded-md border bg-slate-50 transition hover:border-teal-400",
                activeImage === image ? "border-teal-600 ring-2 ring-teal-100" : "border-slate-200",
              )}
            >
              <Image src={image} alt={`${name} image ${index + 1}`} fill sizes="120px" className="object-contain p-2" unoptimized />
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative order-1 aspect-square rounded-md bg-slate-50 md:order-2">
        <Image src={activeImage} alt={name} fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-contain p-6 md:p-8" unoptimized />
      </div>
    </div>
  );
}
