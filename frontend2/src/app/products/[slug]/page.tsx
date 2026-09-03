import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductDetailClient } from "@/components/shop/product-detail-client";
import { getProducts } from "@/services/catalog-service";

export const dynamicParams = false;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.priyasaquafresh.com";
const SITE_ORIGIN = "https://priyasaquafresh.com";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type MetadataProduct = {
  slug: string;
  name: string;
  description?: string | null;
  image?: string;
  images?: { imageUrl?: string | null; isPrimary?: boolean; colorName?: string | null; colorCode?: string | null }[];
};

function cleanDescription(description?: string | null) {
  return String(description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function absoluteImageUrl(url?: string | null) {
  if (!url) return `${SITE_ORIGIN}/share-card.png`;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  if (url.startsWith("/")) return `${SITE_ORIGIN}${url}`;
  return `${API_BASE_URL}/${url}`;
}

async function getMetadataProduct(slug: string): Promise<MetadataProduct | null> {
  const response = await fetch(`${API_BASE_URL}/api/products`, { cache: "force-cache" }).catch(() => null);
  if (!response?.ok) return null;
  const result = await response.json().catch(() => null);
  const products = result?.data?.products || [];
  return products.find((product: MetadataProduct) => product.slug === slug) || null;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getMetadataProduct(slug);

  if (!product) {
    return {
      title: "Priya's Aqua Fresh",
      description: "Premium water purifiers, RO systems, alkaline water solutions and home purification support.",
      openGraph: {
        title: "Priya's Aqua Fresh",
        description: "Premium water purifiers, RO systems, alkaline water solutions and home purification support.",
        images: [{ url: `${SITE_ORIGIN}/share-card.png`, width: 1200, height: 630, alt: "Priya's Aqua Fresh" }],
      },
      twitter: { card: "summary_large_image", images: [`${SITE_ORIGIN}/share-card.png`] },
    };
  }

  const description = cleanDescription(product.description) || "Premium Priya's Aqua Fresh water purifier.";
  const primaryImage = product.images?.find((image) => image.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || product.image;
  const image = absoluteImageUrl(primaryImage);
  const productUrl = `${SITE_ORIGIN}/products/${product.slug}`;

  return {
    title: `${product.name} | Priya's Aqua Fresh`,
    description,
    alternates: { canonical: productUrl },
    openGraph: {
      title: product.name,
      description,
      url: productUrl,
      siteName: "Priya's Aqua Fresh",
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts().catch(() => []);
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProductDetailClient />
    </Suspense>
  );
}