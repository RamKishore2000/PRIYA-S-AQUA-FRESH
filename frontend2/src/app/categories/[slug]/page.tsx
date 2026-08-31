import Link from "next/link";
import { SitePage } from "@/components/layout/site-page";
import { getCategories } from "@/services/catalog-service";

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getCategories().catch(() => []);
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories().catch(() => []);
  const category = categories.find((item) => item.slug === slug);
  const title = category?.name || "Category";

  return (
    <SitePage eyebrow="Category" title={title} description="Browse matching Priya's Aqua Fresh products.">
      <section className="px-4 pb-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/products?category=${slug}`}
            className="inline-flex rounded-full bg-[#0057C8] px-6 py-3 text-sm font-black text-white"
          >
            View Products
          </Link>
        </div>
      </section>
    </SitePage>
  );
}