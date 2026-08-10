import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { FaqsSection } from "@/components/home/faqs-section";
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
import { getBanners, getCategories, getProducts, getTestimonials } from "@/services/catalog-service";

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const banners = await getBanners();
  const testimonials = await getTestimonials();
  const bestSellingProducts = products.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-[#12161a]">
      <Header overlay />
      <main className="flex-1 bg-[#12161a]">
        <HeroBanner categories={categories} banners={banners} />
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
        <FaqsSection />
      </main>
      <Footer />
    </div>
  );
}
