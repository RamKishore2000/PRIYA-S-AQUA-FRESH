import { ProductListingPage } from "@/components/product/product-listing-page";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getProducts } from "@/services/catalog-service";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <ProductListingPage products={products} />
      <Footer />
    </div>
  );
}
