import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Droplets, ShieldCheck, Sparkles } from "lucide-react";
import { AboutGsapAnimations } from "@/components/about/about-gsap-animations";
import { SitePage } from "@/components/common/site-page";

const headingLines = ["Pure Water.", "Trusted Care.", "Built on Innovation."];

const trustHighlights = [
  {
    value: "Review",
    label: "Customer",
    detail: "4.9+ trust score",
  },
  {
    value: "A+",
    label: "Business Class",
    detail: "Quality support",
  },
  {
    value: "No. 1",
    label: "Purifiers Company In India",
    detail: "Brand positioning",
  },
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
    <SitePage>
      <AboutGsapAnimations />

      <section className="relative overflow-hidden px-4 py-12 md:px-8 md:py-16">
        <div className="about-water-soft-bg" />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div data-about-reveal className="inline-flex items-center gap-2 rounded-full border border-[#12a8e6]/25 bg-[#12a8e6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#12a8e6]">
              <Droplets className="h-4 w-4" />
              About Priya&apos;s Aqua Fresh
            </div>
            <h1 className="mt-5 max-w-3xl overflow-hidden font-serif text-4xl font-medium leading-[0.98] tracking-normal text-white sm:text-5xl md:text-[3.45rem]">
              {headingLines.map((line, index) => (
                <span key={line} className="block overflow-hidden">
                  <span data-about-word className={index === 1 ? "inline-block text-[#12a8e6]" : "inline-block"}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p data-about-reveal className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Priya&apos;s Aqua Fresh is committed to healthier living through advanced technology, trusted quality, customer care, clean water, reliability and peace of mind.
            </p>
            <div data-about-reveal className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[#12a8e6] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0871cf]">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#12a8e6]/35 bg-[#12a8e6]/10 px-6 py-3 text-sm font-bold text-white transition hover:border-[#12a8e6] hover:bg-[#12a8e6]">
                Contact Us
              </Link>
            </div>
          </div>

          <div data-about-mask className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm md:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#12a8e6]/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#00BFA6]/10 blur-3xl" />
            <div className="relative grid gap-4 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
              <div className="relative mx-auto aspect-square w-full max-w-[260px]">
                <span className="absolute inset-x-8 bottom-5 h-12 rounded-full bg-black/50 blur-2xl" />
                <Image
                  src="/Untitled-design-10-2048x2048.png"
                  alt="Priya's Aqua Fresh purifier"
                  fill
                  sizes="260px"
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#12a8e6]/12 text-[#12a8e6]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-2xl font-black leading-tight text-white md:text-3xl">
                  Trusted purification for every space.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Built around cleaner water, reliable products, practical support and long-term customer confidence.
                </p>
              </div>
            </div>
            <div data-about-reveal className="relative mt-5 grid gap-3 sm:grid-cols-3">
              {trustHighlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-[#07120f]/72 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12a8e6]/12 text-[#12a8e6]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="mt-3 block text-xl font-black text-[#12a8e6]">{item.value}</span>
                  <span className="mt-1 block text-sm font-bold text-white">{item.label}</span>
                  <span className="mt-1 block text-xs font-semibold text-slate-400">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div data-about-mask className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#596a6e] shadow-sm">
          <div className="about-no1-badge" aria-label="India number one purifier badge">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">India</span>
            <span className="text-3xl font-black leading-none text-slate-950">No. 1</span>
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">Purifiers</span>
          </div>
          <Image
            src="/Untitled-design-10-2048x2048.png"
            alt="Priya's Aqua Fresh purifier"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-contain"
            priority
          />
        </div>
        <div data-about-reveal>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#12a8e6]">Who We Are</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Driven by Purpose, Powered by Innovation</h2>
          <p className="mt-5 leading-8 text-slate-300">
            Priya&apos;s Aqua Fresh provides high-quality water purifiers and home electronics built around performance, reliability, innovation and customer well-being.
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            The brand positioning as <strong>No. 1 Purifiers Company In India</strong> reflects its focus on advanced purification, trusted quality and dependable customer care.
          </p>
          <div className="mt-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#12a8e6]">Why We Are</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="about-rating-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-4xl font-black text-white">4.9<span className="text-[#12a8e6]">+</span></span>
                  <span className="text-sm font-bold text-amber-500">★★★★★ <span className="text-slate-400">4.7/5</span></span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Review Customer</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-300">&quot;Excellent products, exceptional service!&quot;</p>
              </div>
              <div className="about-rating-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-4xl font-black text-white">A<span className="text-[#12a8e6]">+</span></span>
                  <span className="text-sm font-bold text-amber-500">★★★★★ <span className="text-slate-400">4.7/5</span></span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Business Class</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-300">&quot;Exceptional service, highly recommended!&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-about-vision className="border-y border-white/10 bg-[#111418] px-4 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-about-reveal className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#12a8e6]">Vision</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Vision That Flows Beyond Purity</h2>
          </div>
          <div className="relative mt-9 grid gap-5 md:grid-cols-5">
            <span data-about-line className="absolute left-4 top-0 hidden h-full w-[3px] rounded-full bg-[#12a8e6] md:left-1/2 md:block" />
            {visionPoints.map((point, index) => (
              <article key={point} data-about-reveal className="about-flow-point">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#12a8e6] text-sm font-black text-white">{index + 1}</span>
                <h3 className="mt-4 text-base font-bold text-white">{point}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div data-about-reveal className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#12a8e6]">Mission</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Our Mission: Safe Water for Every Home</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {missionPoints.map((point, index) => (
            <article key={point} data-about-reveal className="about-number-row">
              <span className="text-5xl font-black text-[#12a8e6]/25">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{point}</h3>
                <p className="mt-2 leading-7 text-slate-300">
                  A focused mission point guiding product quality, customer care and healthier water choices.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-14 md:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/10 bg-[#111418] p-6 md:p-8">
          <div data-about-reveal className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#12a8e6]">Leadership</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">The Mind Behind the Mission</h2>
            <h3 className="mt-4 text-xl font-bold text-[#12a8e6]">Mr. K Anand & Mrs. K Priya</h3>
            <p className="mt-5 leading-8 text-slate-300">
              Mr. K Anand, Managing Director of Priya&apos;s Aqua Fresh, is associated with the company&apos;s growth across water purification and home electronics by understanding customer needs and driving innovation.
            </p>
            <p className="mt-4 leading-8 text-slate-300">
              His work spans alkaline and RO water purifiers, water softeners, geysers, home electronics, and active participation in seminars, conferences and industry forums.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-lg bg-gradient-to-br from-teal-900 to-slate-950 p-6 text-white md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-about-mask className="relative min-h-[420px] overflow-hidden rounded-lg bg-white/8 shadow-2xl md:min-h-[520px]">
            <Image
              src="/images/about/award-excellence.jpg"
              alt="Priya's Aqua Fresh excellence award with Telugu Film Actor Ali Garu"
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
            />
          </div>
          <div data-about-reveal>
            <Award className="h-10 w-10 text-cyan-200" />
            <h2 className="mt-5 text-3xl font-bold md:text-4xl">Honored with Excellence Award by Telugu Film Actor Ali Garu</h2>
            <p className="mt-5 leading-8 text-cyan-50">
              This recognition celebrates Priya&apos;s Aqua Fresh commitment to water purification, product quality and customer trust.
            </p>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
