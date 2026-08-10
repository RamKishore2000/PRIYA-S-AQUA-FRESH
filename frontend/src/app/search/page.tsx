import { ProductListingPage } from "@/components/product/product-listing-page";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getProducts } from "@/services/catalog-service";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = String(params.q || "").trim();
  const products = query ? await getProducts(undefined, query) : [];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <ProductListingPage
        products={products}
        title={query ? `Search results for "${query}"` : "Search Products"}
        description={query ? "Products matching your search are shown below." : "Type a product name in the search bar to find purifiers, spare parts, and related items."}
      />
      <Footer />
    </div>
  );
}
