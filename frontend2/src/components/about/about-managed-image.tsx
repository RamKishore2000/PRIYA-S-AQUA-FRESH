"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { defaultSiteSettings, fetchSiteSettings } from "@/services/settings-service";

type AboutManagedImageProps = {
  index: number;
  fallback: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function AboutManagedImage({ index, fallback, alt, sizes, className, priority }: AboutManagedImageProps) {
  const [src, setSrc] = useState(fallback || defaultSiteSettings.aboutImages[index] || "");

  useEffect(() => {
    let active = true;
    fetchSiteSettings()
      .then((settings) => {
        const nextImage = settings.aboutImages[index] || fallback || defaultSiteSettings.aboutImages[index] || "";
        if (active) setSrc(nextImage);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [fallback, index]);

  return <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={priority} unoptimized={src.startsWith("http")} />;
}
