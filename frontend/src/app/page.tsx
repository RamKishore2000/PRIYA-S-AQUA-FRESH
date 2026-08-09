import { CategoryGrid } from "@/components/home/category-grid";
import { CommercialSolutions } from "@/components/home/commercial-solutions";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { HeroBanner } from "@/components/home/hero-banner";
import { Newsletter } from "@/components/home/newsletter";
import { ProductGrid } from "@/components/home/product-grid";
import { PromoBanner } from "@/components/home/promo-banner";
import { Testimonials } from "@/components/home/testimonials";
import { TrustFeatures } from "@/components/home/trust-feature";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AnimatedLogoShowcase } from "@/components/common/animated-logo-showcase";
import { brandLogos } from "@/data/logo-showcase";
import { bestSellingProducts } from "@/data/products";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProductsSection />
        <PromoBanner />
        <ProductGrid title="Best Selling Products" products={bestSellingProducts} />
        <CommercialSolutions />
        <TrustFeatures />
        <Testimonials />
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
