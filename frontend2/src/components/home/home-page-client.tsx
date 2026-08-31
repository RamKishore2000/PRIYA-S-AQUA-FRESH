"use client";

import { useEffect, useState } from "react";
import { BrandShowcase } from "@/components/home/brand-showcase";
import { BuyingBenefits } from "@/components/home/buying-benefits";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { CouponOffersSection } from "@/components/home/coupon-offers-section";
import { CustomerTrustGallery } from "@/components/home/customer-trust-gallery";
import { FaqSection } from "@/components/home/faq-section";
import { Hero } from "@/components/home/hero";
import { HeroBrandStrip } from "@/components/home/hero-brand-strip";
import { HomeAnimations } from "@/components/home/home-animations";
import { HomeCategorySkeleton, HomeHeroSkeleton, HomeProductSkeleton } from "@/components/home/home-skeletons";
import { NewsletterStrip } from "@/components/home/newsletter-strip";
import { ProductShowcase } from "@/components/home/product-showcase";
import { Testimonials } from "@/components/home/testimonials";
import { WhyChoose } from "@/components/home/why-choose";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomTabs } from "@/components/layout/mobile-bottom-tabs";
import { getHomeData } from "@/services/home-data";

type HomeData = Awaited<ReturnType<typeof getHomeData>>;

const emptyHomeData: HomeData = {
  categories: [],
  banners: [],
  products: [],
  trendingProducts: [],
  newProducts: [],
  categoryProductSections: [],
  couponOffers: [],
  testimonials: [],
};

export function HomePageClient() {
  const [data, setData] = useState<HomeData>(emptyHomeData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getHomeData()
      .then((nextData) => {
        if (active) setData(nextData);
      })
      .catch(() => {
        if (active) setData(emptyHomeData);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8F3EC] pb-20 text-[#1D2D2E] lg:pb-0">
      <HomeAnimations />
      <Header overlay />
      {loading ? <HomeHeroSkeleton /> : <Hero banners={data.banners} categories={data.categories} />}
      {loading ? <HomeCategorySkeleton /> : <CategoryShowcase categories={data.categories} />}
      <CouponOffersSection offers={data.couponOffers} />
      {loading ? (
        <>
          <HomeProductSkeleton />
          <HomeProductSkeleton />
          <HomeProductSkeleton />
        </>
      ) : (
        data.categoryProductSections.map((section) => (
          <ProductShowcase
            key={section.id}
            products={section.products}
            title={section.title}
            eyebrow={section.eyebrow}
            tone={section.tone}
            viewAllHref={section.viewAllHref}
          />
        ))
      )}
      <div className="native-app-hidden"><WhyChoose /></div>
      <div className="native-app-hidden"><BuyingBenefits /></div>
      <div className="native-app-hidden"><Testimonials testimonials={data.testimonials} /></div>
      <div className="native-app-hidden"><HeroBrandStrip /></div>
      <div className="native-app-hidden"><BrandShowcase /></div>
      <div className="native-app-hidden"><CustomerTrustGallery /></div>
      <div className="native-app-hidden"><NewsletterStrip /></div>
      <div className="native-app-hidden"><FaqSection /></div>
      <Footer />
      <MobileBottomTabs />
    </main>
  );
}


