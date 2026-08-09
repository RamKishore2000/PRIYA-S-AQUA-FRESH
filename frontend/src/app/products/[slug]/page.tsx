import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/common/page-header";
import { RatingStars } from "@/components/common/rating-stars";
import { SitePage } from "@/components/common/site-page";
import { PriceDisplay } from "@/components/product/price-display";
import { ProductShareButton } from "@/components/product/product-share-button";
import { LinkButton } from "@/components/ui/button";
import { products } from "@/data/products";

export default async function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <SitePage>
      <PageHeader title={product.name} description={product.description} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:px-8 lg:grid-cols-2">
        <div className="relative aspect-square rounded-lg bg-slate-50">
          <Image src={product.image} alt={product.name} fill sizes="50vw" className="object-contain p-10" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-600">{product.category}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">{product.name}</h1>
          <div className="mt-4"><RatingStars rating={product.rating} reviewCount={product.reviewCount} /></div>
          <div className="mt-5"><PriceDisplay price={product.price} originalPrice={product.originalPrice} /></div>
          <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/products">Back to Shop</LinkButton>
            <ProductShareButton product={product} variant="button" className="mt-0" />
          </div>
        </div>
      </section>
    </SitePage>
  );
}
