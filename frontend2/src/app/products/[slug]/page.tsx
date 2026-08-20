import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Truck } from "lucide-react";
import { SitePage } from "@/components/layout/site-page";
import { PriceDisplay } from "@/components/shop/price-display";
import { ProductDetailActions } from "@/components/shop/product-detail-actions";
import { ProductGrid } from "@/components/shop/product-grid";
import { StarIcon } from "@/components/shop/star-icon";
import { getProductBySlug, getProducts } from "@/services/catalog-service";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProductBySlug(slug).catch(() => null), getProducts().catch(() => [])]);

  if (!product) {
    return (
      <SitePage eyebrow="Product" title="Product not found" description="The product you are looking for is not available.">
        <section className="px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/products" className="font-black text-[#0A3A38]">Browse products</Link>
          </div>
        </section>
      </SitePage>
    );
  }

  const related = allProducts
    .filter((item) => item.slug !== product.slug)
    .sort((first, second) => {
      const firstMatchesCategory = first.category === product.category ? 0 : 1;
      const secondMatchesCategory = second.category === product.category ? 0 : 1;
      return firstMatchesCategory - secondMatchesCategory;
    })
    .slice(0, 4);

  return (
    <SitePage eyebrow={product.category} title={product.name} description="Review product details, pricing and support options before checkout." compactHero>
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-[#7D7B75]">
            <Link href="/" className="hover:text-[#0A3A38]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#0A3A38]">Products</Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="max-w-[280px] truncate text-[#1D2D2E]">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-[5.5rem_1fr]">
                <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:pb-0">
                  {product.images.map((image) => (
                    <span key={image} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] shadow-[0_8px_24px_rgba(84,61,35,0.06)]">
                      <Image src={image} alt="" fill sizes="80px" className="object-contain p-1.5" unoptimized />
                    </span>
                  ))}
                </div>
                <div data-product-detail-image className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-[#E5D8C7] bg-[#FFF9F1] shadow-[0_24px_70px_rgba(84,61,35,0.12)]">
                  <span className="absolute inset-x-16 bottom-10 h-16 rounded-full bg-[#0A3A38]/12 blur-2xl" />
                  <Image src={product.image} alt={product.name} fill sizes="620px" className="object-contain p-8" unoptimized />
                </div>
              </div>
              <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_14px_42px_rgba(84,61,35,0.08)]">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#B68A45]">Product Details</h2>
                <ProductDescription description={product.description} />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_18px_60px_rgba(84,61,35,0.08)] lg:sticky lg:top-28 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">{product.category}</p>
              <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#1D2D2E] md:text-4xl">{product.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-[#5A6362]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0A3A38] px-3 py-1 text-white">
                  <StarIcon className="h-4 w-4 fill-[#D8B879] text-[#D8B879]" />
                  {(product.rating || 4.8).toFixed(1)}
                </span>
                <span>({product.reviewCount || 0} reviews)</span>
              </div>

              <PriceDisplay product={product} className="mt-5" priceClassName="text-4xl" originalClassName="pb-1 text-xl" />

              <div className="mt-7 border-y border-[#E5D8C7] py-5">
                <p className="font-black text-[#1D2D2E]">Category: <span className="text-[#0A3A38]">{product.category}</span></p>
                {product.sku ? <p className="mt-3 font-black text-[#5A6362]">Product Code: {product.sku}</p> : null}
              </div>

              <ProductDetailActions product={product} />

              <div className="mt-6 grid gap-3 text-sm">
                <div className="flex items-start gap-3 rounded-xl border border-[#E5D8C7] bg-white p-3 font-semibold text-[#5A6362]">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#B68A45]" />
                  <p>Enjoy free delivery and free returns on selected orders.</p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-[#E5D8C7] bg-white p-3 font-semibold text-[#5A6362]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B68A45]" />
                  <p>Installation support available for eligible purifier models.</p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-[#E5D8C7] bg-white p-3 font-semibold text-[#5A6362]">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-[#B68A45]" />
                  <p>Genuine Priya&apos;s Aqua Fresh products and spare parts.</p>
                </div>
              </div>

            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-16 border-t border-[#E5D8C7] pt-10">
              <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">Recommended</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1D2D2E] md:text-5xl">
                    You May Also Like This Product
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#5A6362]">
                    Similar Priya&apos;s Aqua Fresh products selected from the catalog.
                  </p>
                </div>
                <Link href="/products" className="inline-flex w-fit rounded-full border border-[#C59A55] bg-[#FFF9F1] px-5 py-2.5 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
                  View All Products
                </Link>
              </div>
              <ProductGrid products={related} />
            </section>
          ) : null}
        </div>
      </section>
    </SitePage>
  );
}

function ProductDescription({ description }: { description: string }) {
  const { details, specifications } = parseProductDescriptionClean(description);

  if (details.length === 0 && specifications.length === 0) {
    return <p className="mt-3 text-sm font-semibold leading-7 text-[#5A6362]">Product information will be updated soon.</p>;
  }

  return (
    <div className="mt-4 space-y-5">
      {details.length > 0 ? (
        <div className="space-y-3">
          {details.map((item, index) => (
            item.kind === "point" ? (
              <div key={`${item.text}-${index}`} className="flex gap-3 text-sm font-semibold leading-7 text-[#5A6362]">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B68A45]" />
                <p>
                  {item.label ? <span className="font-black text-[#1D2D2E]">{item.label}: </span> : null}
                  {item.text}
                </p>
              </div>
            ) : (
              <p key={`${item.text}-${index}`} className="text-sm font-semibold leading-7 text-[#5A6362]">
                {item.text}
              </p>
            )
          ))}
        </div>
      ) : null}

      {specifications.length > 0 ? (
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#B68A45]">Specifications</h3>
          <div className="mt-3 space-y-2">
            {specifications.map((spec, index) => (
              <div key={`${spec.label}-${index}`} className="grid gap-1 text-sm leading-6 sm:grid-cols-[16rem_1rem_1fr] sm:gap-3">
                <span className="font-black text-[#1D2D2E]">{spec.label}</span>
                <span className="hidden text-lg font-black leading-6 text-[#1D2D2E] sm:block">:</span>
                <span className="font-semibold text-[#5A6362]">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type DetailItem = { kind: "paragraph" | "point"; label?: string; text: string };
type SpecItem = { label: string; value: string };

function parseProductDescriptionClean(description: string): { details: DetailItem[]; specifications: SpecItem[] } {
  const normalized = String(description || "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u00e2\u20ac\u00a2/g, "\u2022")
    .replace(/\s*SPECIFICATIONS\s*:/gi, "\nSPECIFICATIONS:\n")
    .trim();
  const specMatch = normalized.match(/\bSPECIFICATIONS\s*:/i);
  const detailsText = specMatch ? normalized.slice(0, specMatch.index).trim() : normalized;
  const specsText = specMatch ? normalized.slice((specMatch.index ?? 0) + specMatch[0].length).trim() : "";

  return {
    details: parseCleanDetails(detailsText),
    specifications: parseCleanSpecifications(specsText),
  };
}

function parseCleanDetails(value: string): DetailItem[] {
  return value
    .split("\n")
    .map((line) => line.trim().replace(/\u00e2\u20ac\u00a2/g, "\u2022"))
    .filter(Boolean)
    .map((line) => {
      const isBullet = /^(?:-|\?|\u2022)\s+/.test(line);
      const cleanLine = line.replace(/^(?:-|\?|\u2022)\s+/, "").trim();
      const labelMatch = cleanLine.match(/^([A-Z][A-Z0-9\s&/-]{2,}):\s*(.+)$/);
      if (isBullet || labelMatch) {
        return {
          kind: "point" as const,
          label: labelMatch?.[1]?.trim(),
          text: labelMatch?.[2]?.trim() || cleanLine,
        };
      }
      return { kind: "paragraph" as const, text: cleanLine };
    })
    .filter((item) => item.text.length > 0);
}

function parseCleanSpecifications(value: string): SpecItem[] {
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

const detailHeadings = [
  "ADVANCED PURIFICATION",
  "PRIYAS AQUAFRESH STORAGE CAPACITY",
  "STORAGE CAPACITY",
  "LED INDICATOR",
  "COMPACT DIMENSIONS",
  "HIGH FLOW RATE",
  "AUTOMATIC SHUT-OFF",
];

const specificationKeys = [
  "Brand",
  "Special Feature",
  "Product Dimensions",
  "Material",
  "Capacity",
  "Flow Rate",
];

function parseProductDescription(description: string): { details: DetailItem[]; specifications: SpecItem[] } {
  const normalized = normalizeProductDescription(description);
  const specMatch = normalized.match(/\bSPECIFICATIONS\s*:/i);
  const detailsText = specMatch ? normalized.slice(0, specMatch.index).trim() : normalized.trim();
  const specsText = specMatch ? normalized.slice((specMatch.index ?? 0) + specMatch[0].length).trim() : "";

  return {
    details: parseDetails(detailsText),
    specifications: parseSpecifications(specsText),
  };
}

function normalizeProductDescription(value: string) {
  let text = String(value || "").replace(/\r\n?/g, "\n").replace(/\u2022/g, "\n• ");
  text = text.replace(/\s*SPECIFICATIONS\s*:/gi, "\nSPECIFICATIONS:\n");

  for (const heading of detailHeadings) {
    const pattern = new RegExp(`\\s+(${escapeRegExp(heading)}\\s*:)`, "gi");
    text = text.replace(pattern, "\n$1");
  }

  for (const key of specificationKeys) {
    const pattern = new RegExp(`\\s+(${escapeRegExp(key)}\\s*:)`, "g");
    text = text.replace(pattern, "\n$1");
  }

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function parseDetails(value: string): DetailItem[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .map((line) => line.replace(/^[-?]\s+/, "\u00e2\u20ac\u00a2 "))
    .filter(Boolean)
    .map((line) => {
      const cleanLine = line.replace(/^•\s*/, "").trim();
      const labelMatch = cleanLine.match(/^([A-Z][A-Z0-9\s&/-]{2,}):\s*(.+)$/);
      if (line.startsWith("•") || labelMatch) {
        return {
          kind: "point" as const,
          label: labelMatch?.[1]?.trim(),
          text: labelMatch?.[2]?.trim() || cleanLine,
        };
      }
      return { kind: "paragraph" as const, text: cleanLine };
    })
    .filter((item) => item.text.trim().length > 0);
}

function parseSpecifications(value: string): SpecItem[] {
  return value
    .split("\n")
    .map((line) => line.replace(/^[-?]\s+/, "\u00e2\u20ac\u00a2 "))
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return {
        label: label.trim(),
        value: rest.join(":").trim(),
      };
    })
    .filter((item) => item.label && item.value);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
