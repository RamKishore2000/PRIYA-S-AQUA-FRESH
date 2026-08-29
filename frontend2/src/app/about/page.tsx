import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Droplets, MapPin, Navigation, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { AboutGsapAnimations } from "@/components/about/about-gsap-animations";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomTabs } from "@/components/layout/mobile-bottom-tabs";

const headingLines = ["Pure Water.", "Trusted Care.", "Built on Innovation."];

const trustHighlights = [
  { value: "Review", label: "Customer", detail: "4.9+ trust score" },
  { value: "A+", label: "Business Class", detail: "Quality support" },
  { value: "No. 1", label: "Purifiers Company In India", detail: "Brand positioning" },
];

const visionPoints = [
  "Ensure Access to Pure Water",
  "Innovate for Health & Sustainability",
  "Build Trust Through Quality",
  "Empower Communities",
  "Lead with Integrity & Excellence",
];

const missionPoints = [
  "Deliver Safe Drinking Water",
  "Innovate with Purpose",
  "Prioritize Customer Satisfaction",
  "Promote Health & Awareness",
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#FFF9F1_0%,#F8F3EC_52%,#F1E5D6_100%)] pb-20 text-[#1D2D2E] lg:pb-0">
        <AboutGsapAnimations />

      <section className="relative overflow-hidden px-5 py-14 md:px-8 md:py-18">
        <div className="about-water-soft-bg" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div data-about-reveal className="inline-flex items-center gap-2 rounded-full border border-[#C59A55]/35 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#9B7137]">
              <Droplets className="h-4 w-4" />
              About Priya&apos;s Aqua Fresh
            </div>
            <h1 className="mt-5 max-w-3xl overflow-hidden font-serif text-4xl font-semibold leading-[0.98] text-[#1D2D2E] sm:text-5xl md:text-[3.45rem]">
              {headingLines.map((line, index) => (
                <span key={line} className="block overflow-hidden">
                  <span data-about-word className={index === 1 ? "inline-block text-[#0A3A38]" : "inline-block"}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p data-about-reveal className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#5A6362] md:text-lg">
              Priya&apos;s Aqua Fresh is committed to healthier living through advanced technology, trusted quality, customer care, clean water, reliability and peace of mind.
            </p>
            <div data-about-reveal className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[#0A3A38] px-6 py-3 text-sm font-black text-white transition hover:bg-[#B68A45]">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#C59A55] bg-white px-6 py-3 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
                Contact Us
              </Link>
            </div>
          </div>

          <div data-about-mask className="relative overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_24px_70px_rgba(84,61,35,0.12)] md:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#B68A45]/20 blur-3xl" />
            <div className="relative grid gap-4 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
              <div className="relative mx-auto aspect-square w-full max-w-[260px]">
                <span className="absolute inset-x-8 bottom-5 h-12 rounded-full bg-[#0A3A38]/20 blur-2xl" />
                <Image src="/Untitled-design-10-2048x2048.png" alt="Priya's Aqua Fresh purifier" fill sizes="260px" className="object-contain" priority />
              </div>
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0A3A38]/10 text-[#0A3A38]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-2xl font-black leading-tight text-[#1D2D2E] md:text-3xl">Trusted purification for every space.</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#5A6362]">
                  Built around cleaner water, reliable products, practical support and long-term customer confidence.
                </p>
              </div>
            </div>
            <div data-about-reveal className="relative mt-5 grid gap-3 sm:grid-cols-3">
              {trustHighlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#E5D8C7] bg-white p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5E9D8] text-[#B68A45]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="mt-3 block text-xl font-black text-[#0A3A38]">{item.value}</span>
                  <span className="mt-1 block text-sm font-bold text-[#1D2D2E]">{item.label}</span>
                  <span className="mt-1 block text-xs font-semibold text-[#7D7B75]">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div data-about-mask className="relative aspect-square overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#F5E9D8] shadow-[0_24px_70px_rgba(84,61,35,0.12)]">
          <div className="about-no1-badge" aria-label="India number one purifier badge">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0A3A38]">India</span>
            <span className="text-3xl font-black leading-none text-[#1D2D2E]">No. 1</span>
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7D7B75]">Purifiers</span>
          </div>
          <Image src="/Untitled-design-10-2048x2048.png" alt="Priya's Aqua Fresh purifier" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-contain" priority />
        </div>
        <div data-about-reveal>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B68A45]">Who We Are</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#1D2D2E] md:text-5xl">Driven by Purpose, Powered by Innovation</h2>
          <p className="mt-5 font-semibold leading-8 text-[#5A6362]">
            Priya&apos;s Aqua Fresh provides high-quality water purifiers and home electronics built around performance, reliability, innovation and customer well-being.
          </p>
          <p className="mt-4 font-semibold leading-8 text-[#5A6362]">
            The brand positioning as <strong>No. 1 Purifiers Company In India</strong> reflects its focus on advanced purification, trusted quality and dependable customer care.
          </p>
          <div className="mt-8">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B68A45]">Why We Are</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="about-rating-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-4xl font-black text-[#1D2D2E]">4.9<span className="text-[#B68A45]">+</span></span>
                  <span className="text-sm font-bold text-[#B68A45]">***** <span className="text-[#7D7B75]">4.7/5</span></span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#1D2D2E]">Review Customer</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#5A6362]">&quot;Excellent products, exceptional service!&quot;</p>
              </div>
              <div className="about-rating-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-4xl font-black text-[#1D2D2E]">A<span className="text-[#B68A45]">+</span></span>
                  <span className="text-sm font-bold text-[#B68A45]">***** <span className="text-[#7D7B75]">4.7/5</span></span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#1D2D2E]">Business Class</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#5A6362]">&quot;Exceptional service, highly recommended!&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-about-vision className="border-y border-[#E5D8C7] bg-[#FFF9F1] px-5 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-about-reveal className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B68A45]">Vision</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#1D2D2E] md:text-5xl">Vision That Flows Beyond Purity</h2>
          </div>
          <div className="relative mt-9 grid gap-5 md:grid-cols-5">
            <span data-about-line className="absolute left-4 top-0 hidden h-full w-[3px] rounded-full bg-[#B68A45] md:left-1/2 md:block" />
            {visionPoints.map((point, index) => (
              <article key={point} data-about-reveal className="about-flow-point">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A3A38] text-sm font-black text-white">{index + 1}</span>
                <h3 className="mt-4 text-base font-bold text-[#1D2D2E]">{point}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div data-about-reveal className="mb-8 max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B68A45]">Mission</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#1D2D2E] md:text-5xl">Our Mission: Safe Water for Every Home</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {missionPoints.map((point, index) => (
            <article key={point} data-about-reveal className="about-number-row">
              <span className="text-5xl font-black text-[#B68A45]/30">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-xl font-bold text-[#1D2D2E]">{point}</h3>
                <p className="mt-2 font-semibold leading-7 text-[#5A6362]">
                  A focused mission point guiding product quality, customer care and healthier water choices.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_18px_60px_rgba(84,61,35,0.08)] md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div data-about-reveal className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B68A45]">Leadership</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#1D2D2E] md:text-5xl">The Mind Behind the Mission</h2>
            <h3 className="mt-4 text-xl font-black text-[#0A3A38]">Mr. K Anand & Mrs. K Priya</h3>
            <p className="mt-5 font-semibold leading-8 text-[#5A6362]">
              Priya&apos;s Aqua Fresh is guided by focused leadership, practical customer understanding and a strong commitment to reliable water purification solutions.
            </p>
            <p className="mt-4 font-semibold leading-8 text-[#5A6362]">
              Their work supports the brand&apos;s growth across alkaline and RO water purifiers, water softeners, geysers, home electronics, service support and customer care.
            </p>
          </div>

          <div data-about-mask className="grid gap-4 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#F5E9D8] shadow-[0_18px_45px_rgba(84,61,35,0.12)]">
              <div className="relative aspect-[4/5]">
                <Image src="/WhatsApp Image 2026-08-28 at 5.03.19 PM.jpeg" alt="Priya's Aqua Fresh leadership" fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw" className="object-cover object-center transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(10,36,38,0.82))] px-4 pb-4 pt-16 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D8B879]">Founder Vision</p>
                <p className="mt-1 text-sm font-bold">Quality products, trusted support.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#F5E9D8] shadow-[0_18px_45px_rgba(84,61,35,0.12)] sm:mt-8">
              <div className="relative aspect-[4/5]">
                <Image src="/WhatsApp Image 2026-08-28 at 5.04.41 PM.jpeg" alt="Priya's Aqua Fresh leadership team" fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw" className="object-cover object-center transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(10,36,38,0.82))] px-4 pb-4 pt-16 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D8B879]">Customer Trust</p>
                <p className="mt-1 text-sm font-bold">Built through care and consistency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-2xl bg-[#0A3A38] p-6 text-white shadow-[0_24px_80px_rgba(10,58,56,0.18)] md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-about-mask className="relative min-h-[420px] overflow-hidden rounded-2xl bg-white/8 shadow-2xl md:min-h-[520px]">
            <Image src="/images/about/award-excellence.jpg" alt="Priya's Aqua Fresh excellence award with Telugu Film Actor Ali Garu" fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
          </div>
          <div data-about-reveal>
            <Award className="h-10 w-10 text-[#D8B879]" />
            <h2 className="mt-5 font-serif text-3xl font-semibold md:text-5xl">Honored with Excellence Award by Telugu Film Actor Ali Garu</h2>
            <p className="mt-5 font-semibold leading-8 text-[#FFF9F1]">
              This recognition celebrates Priya&apos;s Aqua Fresh commitment to water purification, product quality and customer trust.
            </p>
          </div>
        </div>
      </section>


      <section className="px-5 pb-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_18px_60px_rgba(84,61,35,0.08)] md:p-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
          <div data-about-reveal className="flex flex-col justify-center">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#B68A45]">
              <MapPin className="h-4 w-4" /> Company Location
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#1D2D2E] md:text-5xl">Visit Priya&apos;s Aqua Fresh</h2>
            <p className="mt-5 font-semibold leading-8 text-[#5A6362]">
              Reach our team for product enquiries, service support, RO training and water purification solutions.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="https://www.google.com/maps/search/?api=1&query=Priya%27s%20Aqua%20Fresh" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A3A38] px-5 py-3 text-sm font-black text-white transition hover:bg-[#B68A45]">
                <Navigation className="h-4 w-4" /> Open Directions
              </a>
              <a href="tel:9063606360" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C59A55] bg-white px-5 py-3 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8]">
                <Phone className="h-4 w-4" /> Call Support
              </a>
            </div>
          </div>
          <div data-about-mask className="min-h-[320px] overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#F5E9D8] shadow-[0_18px_45px_rgba(84,61,35,0.10)] md:min-h-[420px]">
            <iframe
              title="Priya's Aqua Fresh location map"
              src="https://www.google.com/maps?q=Priya%27s%20Aqua%20Fresh&output=embed"
              className="h-full min-h-[320px] w-full border-0 md:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      <Footer />
      </main>
      <MobileBottomTabs />
    </>
  );
}
