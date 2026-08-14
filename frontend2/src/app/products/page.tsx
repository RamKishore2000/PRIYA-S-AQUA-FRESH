import { SitePage } from "@/components/layout/site-page";
import { ProductListingPage } from "@/components/shop/product-listing-page";
import { getCategories, getProducts } from "@/services/catalog-service";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getProducts().catch(() => []), getCategories().catch(() => [])]);
  const selectedCategory = params.category || "";
  const query = (params.q || "").toLowerCase();

  return (
    <SitePage eyebrow="Shop" title={selectedCategory ? "Selected Products" : "Shop All Products"} description="Explore premium purification, commercial RO systems, electronics and spare parts.">
      <ProductListingPage key={`${selectedCategory}-${query}`} products={products} categories={categories} selectedCategory={selectedCategory} query={query} />
    </SitePage>
  );
}
