import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type SitePageProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function SitePage({ eyebrow, title, description, children }: SitePageProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#FFF9F1_0%,#F8F3EC_52%,#F1E5D6_100%)] text-[#1D2D2E]">
      <section className="relative overflow-hidden px-5 pb-8 pt-12 md:px-8 md:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(10,58,56,0.10),transparent_28%),radial-gradient(circle_at_12%_12%,rgba(182,138,69,0.12),transparent_26%)]" />
        <div className="mx-auto max-w-7xl">
          {eyebrow ? <p className="relative text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">{eyebrow}</p> : null}
          <h1 className="relative mt-3 font-serif text-4xl font-semibold leading-tight text-[#1D2D2E] md:text-6xl">{title}</h1>
          {description ? <p className="relative mt-5 max-w-3xl text-lg font-semibold leading-8 text-[#5A6362]">{description}</p> : null}
        </div>
      </section>
      {children}
      <Footer />
      </main>
    </>
  );
}
