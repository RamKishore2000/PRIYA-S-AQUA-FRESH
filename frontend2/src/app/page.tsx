import { BrandShowcase } from "@/components/home/brand-showcase";
import { BuyingBenefits } from "@/components/home/buying-benefits";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { CouponOffersSection } from "@/components/home/coupon-offers-section";
import { CustomerTrustGallery } from "@/components/home/customer-trust-gallery";
import { FaqSection } from "@/components/home/faq-section";
import { Hero } from "@/components/home/hero";
import { HeroBrandStrip } from "@/components/home/hero-brand-strip";
import { HomeAnimations } from "@/components/home/home-animations";
import { NewsletterStrip } from "@/components/home/newsletter-strip";
import { ProductShowcase } from "@/components/home/product-showcase";
import { Testimonials } from "@/components/home/testimonials";
import { WhyChoose } from "@/components/home/why-choose";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomTabs } from "@/components/layout/mobile-bottom-tabs";
import { getHomeData } from "@/services/home-data";

export default async function Home() {
  const { categories, banners, products, couponOffers, testimonials } = await getHomeData();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8F3EC] pb-20 text-[#1D2D2E] lg:pb-0">
      <HomeAnimations />
      <Header overlay />
      <Hero banners={banners} categories={categories} />
      <HeroBrandStrip />
      <CategoryShowcase categories={categories} />
      <CouponOffersSection offers={couponOffers} />
      <ProductShowcase products={products} />
      <WhyChoose />
      <BuyingBenefits />
      <Testimonials testimonials={testimonials} />
      <BrandShowcase />
      <CustomerTrustGallery />
      <NewsletterStrip />
      <FaqSection />
      <Footer />
      <MobileBottomTabs />
    </main>
  );
}
