import { ProductListingPage } from "@/components/product/product-listing-page";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getProducts } from "@/services/catalog-service";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen flex-col bg-[#0d1114] text-slate-100">
      <Header />
      <main className="relative isolate flex-1 overflow-hidden bg-[#0d1114]">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.12),transparent_30%),radial-gradient(circle_at_8%_18%,rgba(255,255,255,0.06),transparent_24%),linear-gradient(112deg,#10171b_0%,#14201f_48%,#07120f_100%)]" />
        <div className="pointer-events-none fixed -left-24 top-40 z-0 h-80 w-80 rounded-full bg-[#12a8e6]/[0.045] blur-3xl" />
        <div className="pointer-events-none fixed -right-28 top-[42vh] z-0 h-96 w-96 rounded-full bg-[#00BFA6]/[0.04] blur-3xl" />
        <div className="relative z-10">
          <ProductListingPage products={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
