import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { HeroBanner } from "@/components/home/hero-banner";
import { Newsletter } from "@/components/home/newsletter";
import { ProductGrid } from "@/components/home/product-grid";
import { Testimonials } from "@/components/home/testimonials";
import { TrustFeatures } from "@/components/home/trust-feature";
import { WhyWeAre } from "@/components/home/why-we-are";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AnimatedLogoShowcase } from "@/components/common/animated-logo-showcase";
import { brandLogos } from "@/data/logo-showcase";
import { getProducts, getTestimonials } from "@/services/catalog-service";

export default async function Home() {
  const products = await getProducts();
  const testimonials = await getTestimonials();
  const bestSellingProducts = products.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProductsSection products={products} />
        <WhyWeAre />
        <ProductGrid title="Best Selling Products" products={bestSellingProducts} />
        <TrustFeatures />
        <Testimonials testimonials={testimonials} />
        <AnimatedLogoShowcase
          title="Our Brands & Solutions"
          logos={brandLogos}
          direction="left"
          duration={28}
          enableCenterFocus
        />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
