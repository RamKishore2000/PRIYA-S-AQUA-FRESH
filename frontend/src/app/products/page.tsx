import { ProductListingPage } from "@/components/product/product-listing-page";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getProducts } from "@/services/catalog-service";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen flex-col !bg-[#0d1114] text-slate-100" style={{ backgroundColor: "#0d1114" }}>
      <Header />
      <ProductListingPage products={products} />
      <Footer />
    </div>
  );
}
