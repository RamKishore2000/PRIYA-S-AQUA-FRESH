import { ProductListingPage } from "@/components/product/product-listing-page";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <ProductListingPage />
      <Footer />
    </div>
  );
}
