import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SitePage } from "@/components/common/site-page";
import { PageHeader } from "@/components/common/page-header";
import { LinkButton } from "@/components/ui/button";
import { categories } from "@/data/categories";

export default function CategoriesPage() {
  return (
    <SitePage>
      <PageHeader
        eyebrow="Categories"
        title="Shop by Category"
        description="Explore Priya's Aqua Fresh product ranges for homes, businesses, electronics, and service parts."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 md:grid-cols-2 md:px-8 lg:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`relative aspect-[4/3] rounded-md ${category.accent}`}>
              <Image src={category.image} alt={category.name} fill sizes="33vw" className="object-contain p-8" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">{category.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Browse selected products and solutions in this category.
            </p>
            <p className="mt-3 text-sm font-semibold text-teal-700">{category.productCount} products</p>
            <LinkButton href={`/products?category=${category.slug}`} variant="secondary" className="mt-5">
              Explore Products <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </article>
        ))}
      </section>
    </SitePage>
  );
}
