import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomTabs } from "@/components/layout/mobile-bottom-tabs";

type SitePageProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  compactHero?: boolean;
  nativeCleanHero?: boolean;
  children: ReactNode;
};

export function SitePage({ eyebrow, title, description, compactHero = false, nativeCleanHero = false, children }: SitePageProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen overflow-x-clip bg-[linear-gradient(135deg,#FFFFFF_0%,#F3FAFF_52%,#EAF6FF_100%)] pb-20 text-[#102033] lg:pb-0">
        <section data-native-clean-hero={nativeCleanHero ? "true" : undefined} className={`relative overflow-hidden px-5 md:px-8 ${compactHero ? "pb-5 pt-7 md:pb-6 md:pt-8" : "pb-8 pt-12 md:pt-14"}`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(0,174,239,0.12),transparent_28%),radial-gradient(circle_at_12%_12%,rgba(40,180,99,0.10),transparent_26%)]" />
          <div className="mx-auto max-w-7xl">
            {eyebrow ? <p className={`relative font-black uppercase tracking-[0.24em] text-[#0057C8] ${compactHero ? "text-[0.68rem]" : "text-xs"}`}>{eyebrow}</p> : null}
            <h1 className={`relative font-serif font-semibold leading-tight text-[#102033] ${compactHero ? "mt-2 text-2xl md:text-4xl" : "mt-3 text-4xl md:text-6xl"}`}>{title}</h1>
            {description ? <p data-native-hero-description className={`relative max-w-3xl font-semibold text-[#40576C] ${compactHero ? "mt-3 text-sm leading-6" : "mt-5 text-lg leading-8"}`}>{description}</p> : null}
          </div>
        </section>
        {children}
        <Footer />
      </main>
      <MobileBottomTabs />
    </>
  );
}