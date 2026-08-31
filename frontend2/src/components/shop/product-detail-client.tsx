"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Heart, MapPin, Truck } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { PriceDisplay } from "@/components/shop/price-display";
import { ProductDetailActions, ProductDetailIconActions } from "@/components/shop/product-detail-actions";
import { ProductDetailSkeleton } from "@/components/ui/skeletons";
import { ProductCard } from "@/components/shop/product-card";
import { StarIcon } from "@/components/shop/star-icon";
import { getProductBySlug, getProducts } from "@/services/catalog-service";
import type { Product } from "@/types/product";

type LoadState = "loading" | "ready" | "not-found" | "error";
type DetailItem = { kind: "paragraph" | "point"; label?: string; text: string };
type SpecItem = { label: string; value: string };

export function ProductDetailClient() {
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<LoadState>("loading");
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const querySlug = params.get("slug");
    const pathSlug = window.location.pathname.match(/^\/products\/([^/]+)/)?.[1];
    setSlug(decodeURIComponent(querySlug || pathSlug || ""));
  }, []);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setStatus("loading");

    Promise.all([getProductBySlug(slug).catch(() => null), getProducts().catch(() => [])])
      .then(([nextProduct, nextProducts]) => {
        if (!active) return;
        if (!nextProduct) {
          setProduct(null);
          setAllProducts(nextProducts);
          setStatus("not-found");
          return;
        }
        setProduct(nextProduct);
        setAllProducts(nextProducts);
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((item) => item.slug !== product.slug)
      .sort((first, second) => {
        const firstMatchesCategory = first.category === product.category ? 0 : 1;
        const secondMatchesCategory = second.category === product.category ? 0 : 1;
        return firstMatchesCategory - secondMatchesCategory;
      })
      .slice(0, 4);
  }, [allProducts, product]);

  if (status === "loading") {
    return (
      <SitePage eyebrow="Product" title="Loading product" description="Fetching the latest product information." compactHero>
        <ProductDetailSkeleton />
      </SitePage>
    );
  }

  if (!product || status === "not-found" || status === "error") {
    return (
      <SitePage eyebrow="Product" title="Product not found" description="The product you are looking for is not available.">
        <section data-native-screen="product-detail" className="px-4 pb-20 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/products" className="font-black text-[#0057C8]">Browse products</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  const galleryImages = product.images.length ? product.images : [product.image];

  return (
    <SitePage eyebrow={product.category} title={product.name} description="Review product details, pricing and support options before checkout." compactHero>
      <section data-native-screen="product-detail" className="px-4 pb-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-4 hidden flex-wrap items-center gap-2 text-xs font-bold text-[#74879A] md:flex lg:mb-6">
            <Link href="/" className="hover:text-[#0057C8]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#0057C8]">Products</Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="max-w-[280px] truncate text-[#102033]">{product.name}</span>
          </nav>

          <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-8">
            <div className="grid gap-4 lg:gap-5">
              <div className="grid gap-3 md:grid-cols-[5.5rem_1fr] lg:gap-4">
                <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:pb-0">
                  {galleryImages.map((image) => (
                    <span key={image} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] shadow-[0_8px_24px_rgba(0,87,200,0.07)]">
                      <Image src={image} alt="" fill sizes="80px" className="object-contain p-1.5" unoptimized />
                    </span>
                  ))}
                </div>
                <div data-product-detail-image className="relative min-h-[20rem] overflow-hidden rounded-2xl border-0 bg-transparent shadow-none md:min-h-[24rem] lg:min-h-[28rem] lg:rounded-[2rem] lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF] lg:shadow-[0_24px_70px_rgba(0,87,200,0.12)]">
                  <span className="absolute inset-x-16 bottom-10 h-16 rounded-full bg-[#0057C8]/12 blur-2xl" />
                  <Image src={product.image} alt={product.name} fill sizes="620px" className="object-contain p-5 md:p-6 lg:p-8" unoptimized />
                  <div className="absolute right-3 top-3 z-20 lg:hidden">
                    <ProductDetailIconActions product={product} />
                  </div>
                </div>
              </div>
              <div className="rounded-none border-0 bg-transparent p-0 shadow-none lg:rounded-2xl lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF] lg:p-5 lg:shadow-[0_14px_42px_rgba(0,87,200,0.08)]">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#0057C8]">Product Details</h2>
                <ProductDescription description={product.description} />
              </div>
            </div>

            <div className="rounded-none border-0 bg-transparent p-0 shadow-none md:p-0 lg:sticky lg:top-28 lg:rounded-2xl lg:border lg:border-[#D8EAF8] lg:bg-[#FFFFFF] lg:p-6 lg:shadow-[0_18px_60px_rgba(0,87,200,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0057C8]">{product.category}</p>
              <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight text-[#102033] md:text-3xl lg:mt-3 lg:text-4xl">{product.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-[#40576C]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0057C8] px-3 py-1 text-white">
                  <StarIcon className="h-4 w-4 fill-[#28B463] text-[#28B463]" />
                  {(product.rating || 4.8).toFixed(1)}
                </span>
                <span>({product.reviewCount || 0} reviews)</span>
              </div>

              <PriceDisplay product={product} className="mt-4 lg:mt-5" priceClassName="text-2xl md:text-3xl lg:text-4xl" originalClassName="pb-1 text-sm md:text-base lg:text-xl" />

              <div className="mt-5 border-y border-[#D8EAF8] py-4 lg:mt-7 lg:py-5">
                <p className="font-black text-[#102033]">Category: <span className="text-[#0057C8]">{product.category}</span></p>
                {product.sku ? <p className="mt-3 font-black text-[#40576C]">Product Code: {product.sku}</p> : null}
              </div>

              <ProductDetailActions product={product} />

              <div className="mt-5 grid gap-2 pb-16 text-sm lg:mt-6 lg:gap-3 lg:pb-0">
                <InfoLine icon={<Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#0057C8]" />} text="Enjoy free delivery and free returns on selected orders." />
                <InfoLine icon={<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0057C8]" />} text="Installation support available for eligible purifier models." />
                <InfoLine icon={<Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#0057C8]" />} text="Genuine Priya's Aqua Fresh products and spare parts." />
              </div>
            </div>
          </div>

          {related.length > 0 ? (
            <section data-related-products-section className="mt-12 border-t border-[#D8EAF8] pt-8 lg:mt-16 lg:pt-10">
              <div className="mb-5 flex flex-col justify-between gap-3 md:mb-7 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0057C8]">Recommended</p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[#102033] md:text-5xl">You May Also Like This Product</h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#40576C]">Similar Priya's Aqua Fresh products selected from the catalog.</p>
                </div>
                <Link href="/products" className="inline-flex w-fit rounded-full border border-[#0057C8] bg-[#FFFFFF] px-5 py-2.5 text-sm font-black text-[#0057C8] transition hover:bg-[#EAF6FF]">View All Products</Link>
              </div>
              <div data-related-product-rail data-native-home-product-row className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
                {related.map((item) => (
                  <div key={item.id} data-related-product-card data-native-home-product-card className="w-[var(--home-product-card-width)] max-w-none shrink-0 snap-start sm:max-w-[18rem] md:w-[31vw] lg:w-auto lg:max-w-none" style={{ "--home-product-card-width": "calc((100vw - 3.1rem) / 2)" } as CSSProperties}>
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </SitePage>
  );
}

function InfoLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-none border-0 bg-transparent p-0 font-semibold text-[#40576C] lg:rounded-xl lg:border lg:border-[#D8EAF8] lg:bg-white lg:p-3">
      {icon}
      <p>{text}</p>
    </div>
  );
}

function ProductDescription({ description }: { description: string }) {
  const { details, specifications } = parseProductDescription(description);

  if (details.length === 0 && specifications.length === 0) {
    return <p className="mt-3 text-sm font-semibold leading-7 text-[#40576C]">Product information will be updated soon.</p>;
  }

  return (
    <div className="mt-4 space-y-5">
      {details.length > 0 ? (
        <div className="space-y-3">
          {details.map((item, index) =>
            item.kind === "point" ? (
              <div key={`${item.text}-${index}`} className="flex gap-3 text-sm font-semibold leading-7 text-[#40576C]">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0057C8]" />
                <p>{item.label ? <span className="font-black text-[#102033]">{item.label}: </span> : null}{item.text}</p>
              </div>
            ) : (
              <p key={`${item.text}-${index}`} className="text-sm font-semibold leading-7 text-[#40576C]">{item.text}</p>
            ),
          )}
        </div>
      ) : null}

      {specifications.length > 0 ? (
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#0057C8]">Specifications</h3>
          <div className="mt-3 space-y-2">
            {specifications.map((spec, index) => (
              <div key={`${spec.label}-${index}`} className="grid gap-1 text-sm leading-6 sm:grid-cols-[16rem_1rem_1fr] sm:gap-3">
                <span className="font-black text-[#102033]">{spec.label}</span>
                <span className="hidden text-lg font-black leading-6 text-[#102033] sm:block">:</span>
                <span className="font-semibold text-[#40576C]">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function parseProductDescription(description: string): { details: DetailItem[]; specifications: SpecItem[] } {
  const normalized = String(description || "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u00e2\u20ac\u00a2/g, "\u2022")
    .replace(/\s*SPECIFICATIONS\s*:/gi, "\nSPECIFICATIONS:\n")
    .trim();
  const specMatch = normalized.match(/\bSPECIFICATIONS\s*:/i);
  const detailsText = specMatch ? normalized.slice(0, specMatch.index).trim() : normalized;
  const specsText = specMatch ? normalized.slice((specMatch.index ?? 0) + specMatch[0].length).trim() : "";

  return {
    details: parseDetails(detailsText),
    specifications: parseSpecifications(specsText),
  };
}

function parseDetails(value: string): DetailItem[] {
  return value
    .split("\n")
    .map((line) => line.trim().replace(/\u00e2\u20ac\u00a2/g, "\u2022"))
    .filter(Boolean)
    .map((line) => {
      const isBullet = /^(?:-|\?|\u2022)\s+/.test(line);
      const cleanLine = line.replace(/^(?:-|\?|\u2022)\s+/, "").trim();
      const labelMatch = cleanLine.match(/^([A-Z][A-Z0-9\s&/-]{2,}):\s*(.+)$/);
      if (isBullet || labelMatch) {
        return { kind: "point" as const, label: labelMatch?.[1]?.trim(), text: labelMatch?.[2]?.trim() || cleanLine };
      }
      return { kind: "paragraph" as const, text: cleanLine };
    })
    .filter((item) => item.text.length > 0);
}

function parseSpecifications(value: string): SpecItem[] {
  return value
    .split("\n")
    .map((line) => line.trim().replace(/\u00e2\u20ac\u00a2/g, "\u2022").replace(/^(?:-|\?|\u2022)\s+/, ""))
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: label.trim(), value: rest.join(":").trim() };
    })
    .filter((item) => item.label && item.value);
}
