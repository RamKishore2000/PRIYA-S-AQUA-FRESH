"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { Award, BadgeCheck, CheckCircle2, GraduationCap, MessageCircle, Phone, PlayCircle, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { ShareDetailsModal } from "@/components/common/share-details-modal";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomTabs } from "@/components/layout/mobile-bottom-tabs";
import { defaultSiteSettings, fetchSiteSettings, type SiteSettings } from "@/services/settings-service";
import { createTrainingEnquiry, createTrainingRazorpayOrder, markTrainingPaymentFailed, verifyTrainingRazorpayPayment, type TrainingEnquiry } from "@/services/training-service";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const whatsappDisplay = "9666541255";
const whatsappLink = "919666541255";
const supportCall = "8142255015";

const fallbackTrainingImages = [
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.34 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.35 PM (1).jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.35 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.36 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.37 PM.jpeg",
  "",
  "",
  "",
  "",
];

const trainingHighlights = [
  "RO Installation Practical Training",
  "RO Service & Repair",
  "Troubleshooting & Fault Finding",
  "Filter Replacement & Maintenance",
];

const learnPoints = [
  "RO Water Purifier Installation",
  "RO Service & Regular Maintenance",
  "Filter & Membrane Replacement",
  "Pump, SMPS & Electrical Checking",
  "TDS, Water Flow & Leakage Testing",
  "Troubleshooting & Fault Finding",
];

const practiceCards = [
  {
    title: "Live RO Machine Service Practice",
    text: "Get hands-on experience by servicing real RO water purifiers.",
    icon: Wrench,
  },
  {
    title: "RO Installation & Fitting Training",
    text: "Learn complete RO installation, pipe connection, and proper fitting methods.",
    icon: ShieldCheck,
  },
  {
    title: "RO Spare Parts Handling",
    text: "Understand filters, membranes, pumps, SMPS, valves, and other important RO components.",
    icon: Sparkles,
  },
  {
    title: "Troubleshooting with Real Tools",
    text: "Learn fault checking, electrical testing, problem diagnosis, and practical repair methods.",
    icon: BadgeCheck,
  },
];

const topFeatures = [
  { title: "Practical Classes", text: "Hands-on training using real RO machines and equipment.", icon: Wrench },
  { title: "Complete Service Skills", text: "Learn installation, service, repair, and troubleshooting.", icon: ShieldCheck },
  { title: "Certification Provided", text: "Get a training completion certificate and boost your career.", icon: GraduationCap },
  { title: "Career Support", text: "Guidance to start and grow your career as an RO Technician.", icon: Award },
];

const joinReasons = [
  { title: "Practical Training", text: "Learn with real RO machines and practical tools." },
  { title: "Expert Trainers", text: "Get guidance from experienced RO professionals." },
  { title: "Certificate Provided", text: "Receive a training completion certificate." },
  { title: "Career Support", text: "Guidance and support to build your career as an RO Technician." },
];

function getYouTubeVideoId(value: string) {
  const text = value.trim();
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }
  return text;
}

const emptyForm = {
  fullName: "",
  mobile: "",
  city: "",
  message: "",
};

const fieldClass = "h-12 rounded-xl border border-[#D9C5AB] bg-white px-4 text-sm font-bold text-[#1D2D2E] outline-none transition placeholder:text-[#7D7B75] focus:border-[#0A3A38] focus:ring-2 focus:ring-[#0A3A38]/10";

export default function RoTrainingInstitutePage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState<"INTERESTED" | "PAYMENT" | null>(null);
  const [message, setMessage] = useState("");
  const [shareEnquiry, setShareEnquiry] = useState<TrainingEnquiry | null>(null);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => setSettings(defaultSiteSettings));
  }, []);

  const trainingAmount = Math.max(1, Number(settings.trainingAmount || defaultSiteSettings.trainingAmount));
  const trainingImages = Array.from({ length: 9 }, (_, index) => settings.trainingImages?.[index] || fallbackTrainingImages[index] || "");
  const videos = (settings.trainingVideos || []).map(getYouTubeVideoId).filter(Boolean).slice(0, 5);
  const modalDetails = useMemo(() => {
    if (!shareEnquiry) return [];
    return [
      { label: "Enquiry Number", value: shareEnquiry.enquiryNumber },
      { label: "Name", value: shareEnquiry.fullName },
      { label: "Mobile", value: shareEnquiry.mobile },
      { label: "City", value: shareEnquiry.city },
      { label: "Request Type", value: shareEnquiry.actionType === "PAYMENT" ? "Training Payment" : "Training Interest" },
      { label: "Payment Status", value: formatPaymentStatus(shareEnquiry.paymentStatus) },
      { label: "Amount", value: shareEnquiry.amount ? `Rs. ${shareEnquiry.amount.toLocaleString("en-IN")}` : "" },
      { label: "Message", value: shareEnquiry.message },
    ];
  }, [shareEnquiry]);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitInterest() {
    setSaving("INTERESTED");
    setMessage("");
    try {
      const enquiry = await createTrainingEnquiry({ ...form, actionType: "INTERESTED" });
      setShareEnquiry(enquiry);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save your interest.");
    } finally {
      setSaving(null);
    }
  }

  async function submitPayment() {
    if (!window.Razorpay) {
      setMessage("Payment script is still loading. Try again.");
      return;
    }
    setSaving("PAYMENT");
    setMessage("");
    try {
      const enquiry = await createTrainingEnquiry({ ...form, actionType: "PAYMENT" });
      const payment = await createTrainingRazorpayOrder(enquiry.id);
      const razorpay = new window.Razorpay({
        key: payment.keyId,
        amount: payment.razorpayOrder.amount,
        currency: payment.razorpayOrder.currency,
        order_id: payment.razorpayOrder.id,
        name: "Priya's Aqua Fresh",
        description: "RO Training Institute",
        prefill: { name: form.fullName, contact: form.mobile },
        theme: { color: "#0A3A38" },
        modal: {
          ondismiss: async () => {
            try {
              await markTrainingPaymentFailed(enquiry.id);
            } catch {
              // Keep the local message only if the API cannot mark the attempt failed.
            } finally {
              setMessage("Training payment was not completed. You can try again.");
              setSaving(null);
            }
          },
        },
        handler: async (response: RazorpayResponse) => {
          const paid = await verifyTrainingRazorpayPayment({
            enquiryId: enquiry.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          setShareEnquiry(paid);
          setMessage("Training payment completed successfully.");
          setSaving(null);
        },
      });
      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start training payment.");
      setSaving(null);
    }
  }

  return (
    <div data-native-screen="training" className="min-h-screen bg-[#F8F3EC] text-[#1D2D2E]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Header />
      <main className="pb-24 lg:pb-0">
        <section className="relative min-h-[680px] overflow-hidden bg-[#062F33] text-white sm:min-h-[calc(100vh-4rem)]">
          <Image src={trainingImages[0]} alt="RO technician practical training" fill priority sizes="100vw" className="object-cover object-[58%_center] md:object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,38,42,0.12)_0%,rgba(4,38,42,0.50)_38%,rgba(4,38,42,0.98)_100%)] md:bg-[linear-gradient(90deg,rgba(4,38,42,0.98)_0%,rgba(4,38,42,0.84)_43%,rgba(4,38,42,0.18)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#062F33] to-transparent" />
          <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-4 pb-10 pt-28 sm:min-h-[calc(100vh-4rem)] md:items-center md:px-8 md:py-20">
            <div className="max-w-4xl">
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#E7C376] md:text-xs md:tracking-[0.34em]">RO Training Institute</p>
              <h1 className="mt-4 max-w-4xl font-serif text-[2.35rem] font-semibold leading-[1.08] md:mt-5 md:text-6xl md:leading-tight lg:text-7xl">
                Become a Professional <span className="text-[#E7C376]">RO Technician</span> with Practical Training.
              </h1>
              <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-[#F7EFE5] md:mt-6 md:text-lg md:leading-8">
                Hands-on RO Technician Training covering RO installation, service, repair, troubleshooting, filter replacement, and maintenance. Learn with real RO systems and gain practical skills to build your career.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-row md:mt-8">
                <a href="#training-form" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E7C376] px-4 text-xs font-black text-[#062F33] transition hover:bg-white md:h-14 md:px-7 md:text-sm">
                  <GraduationCap className="h-5 w-5" /> Join Training
                </a>
                <a href={`tel:${supportCall}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 text-xs font-black text-white backdrop-blur transition hover:bg-white/15 md:h-14 md:px-7 md:text-sm">
                  <Phone className="h-5 w-5" /> Call Support
                </a>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-2 md:mt-10 md:gap-4 lg:grid-cols-4">
                {trainingHighlights.map((item) => (
                  <div key={item} className="flex min-h-14 items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-[11px] font-black leading-4 text-white backdrop-blur md:gap-3 md:rounded-none md:border-l md:border-r-0 md:border-y-0 md:bg-transparent md:pl-4 md:text-sm md:leading-5 md:backdrop-blur-0">
                    <Wrench className="h-5 w-5 shrink-0 text-[#E7C376] md:h-7 md:w-7" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section data-training-five-image-banner className="bg-[#F8F3EC] px-4 py-8 md:px-8 md:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-3 lg:h-[30rem] lg:grid-cols-[1.15fr_0.85fr] lg:gap-4">
              <figure className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[#DCE9F5] bg-[#EAF6FB] shadow-[0_18px_45px_rgba(36,73,117,0.12)] lg:aspect-auto lg:h-full">
                <Image src={trainingImages[0]} alt="RO training main practical class" fill sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover" />
              </figure>
              <div className="grid grid-cols-2 gap-3 lg:h-full lg:grid-rows-2 lg:gap-4">
                {trainingImages.slice(1, 5).map((image, index) => (
                  <figure key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#DCE9F5] bg-[#EAF6FB] shadow-[0_10px_28px_rgba(36,73,117,0.1)] lg:aspect-auto lg:h-full">
                    <Image src={image} alt={`RO training practical image ${index + 2}`} fill sizes="(max-width: 1023px) 50vw, 21vw" className="object-cover" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F8F3EC] px-4 py-10 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">What You Learn</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight md:text-5xl">Complete RO Technician Training with Hands-On Practical Experience</h2>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#5A6362]">
                Learn RO installation, servicing, repair, troubleshooting, and maintenance with real machines and practical tools.
              </p>
            </div>
            <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-2">
              {learnPoints.map((point) => (
                <div key={point} className="flex items-center justify-between gap-3 rounded-lg border border-[#E8DCCB] bg-white px-3 py-3 shadow-[0_8px_24px_rgba(84,61,35,0.05)] md:gap-4 md:px-4">
                  <span className="flex items-center gap-3 text-sm font-black text-[#274244]"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A60C8]" /> {point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-10 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">Practical Training Cards</p>
                <h2 className="mt-3 max-w-3xl font-serif text-2xl font-semibold leading-tight md:text-5xl">Practice with real RO machines and service tools.</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-8 md:gap-4 lg:grid-cols-4">
              {practiceCards.map((card, index) => {
                const cardImage = trainingImages[index + 5];
                return (
                  <article key={card.title} className="overflow-hidden rounded-xl border border-[#D8E5F5] bg-white shadow-[0_12px_34px_rgba(36,73,117,0.12)]">
                    <div className="relative aspect-video bg-[#EAF6FB]">
                      {cardImage ? (
                        <Image src={cardImage} alt={card.title} fill sizes="(max-width: 767px) 92vw, (max-width: 1023px) 45vw, 25vw" className="scale-125 object-cover object-center" />
                      ) : (
                        <div className="grid h-full place-items-center px-4 text-center text-xs font-black uppercase tracking-[0.14em] text-[#7A98B5]">
                          Upload Practical Card Image {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-[2.5rem_1fr] gap-3 p-3 md:grid-cols-[3rem_1fr] md:p-4">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0A60C8] text-white md:h-11 md:w-11"><card.icon className="h-5 w-5 md:h-6 md:w-6" /></span>
                      <div>
                        <h3 className="text-[15px] font-black leading-5 text-[#0A60C8] md:text-base">{card.title}</h3>
                        <p className="mt-1 text-xs font-bold leading-5 text-[#4D5E6F]">{card.text}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-8 md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {topFeatures.map((feature) => (
                <article key={feature.title} className="rounded-xl border border-[#E7ECF3] bg-white p-4 shadow-[0_12px_32px_rgba(36,73,117,0.08)] md:p-6">
                  <feature.icon className="h-7 w-7 text-[#0A60C8] md:h-9 md:w-9" />
                  <h2 className="mt-3 text-sm font-black leading-5 text-[#0A60C8] md:mt-4 md:text-lg">{feature.title}</h2>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#4D5E6F] md:text-sm md:leading-6">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {videos.length ? (
          <section className="bg-[#F8F3EC] px-4 py-10 md:px-8 md:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">Training Videos</p>
                  <h2 className="mt-3 font-serif text-2xl font-semibold md:text-5xl">Watch recent training moments.</h2>
                </div>
                <a href="https://www.youtube.com/@priyasaquafresh" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#C59A55] px-5 text-sm font-black text-[#9B7137] hover:bg-[#F5E9D8]">
                  <PlayCircle className="h-4 w-4" /> YouTube Channel
                </a>
              </div>
              <div data-training-video-row className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2 md:mt-8 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-5">
                {videos.map((video) => (
                  <a key={video} href={`https://www.youtube.com/watch?v=${video}`} target="_blank" rel="noreferrer" className="group relative block w-[72vw] shrink-0 snap-start overflow-hidden rounded-xl border border-[#E5D8C7] bg-black shadow-[0_14px_34px_rgba(84,61,35,0.08)] sm:w-[44vw] md:w-auto md:shrink">
                    <Image src={`https://img.youtube.com/vi/${video}/hqdefault.jpg`} alt="RO training video" width={480} height={360} unoptimized className="aspect-[9/16] w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#0A60C8] shadow-[0_12px_34px_rgba(0,0,0,0.25)] transition group-hover:scale-110">
                        <PlayCircle className="h-8 w-8" />
                      </span>
                    </span>
                    <span className="absolute bottom-3 left-3 right-3 text-xs font-black uppercase tracking-[0.14em] text-white">Open on YouTube</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="training-form" className="relative overflow-hidden bg-[#062F33] px-4 py-12 text-white md:px-8 md:py-20">
          <Image src={trainingImages[0]} alt="RO training registration" fill sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-[#062F33]/86" />
          <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E7C376]">Join Now</p>
              <h2 className="mt-3 max-w-xl font-serif text-2xl font-semibold leading-tight md:text-5xl">Start Your Career as an RO Technician!</h2>
              <p className="mt-3 text-lg font-black text-[#E7C376] md:mt-4 md:text-xl">Learn. Practice. Become an Expert.</p>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#F7EFE5]">
                Get hands-on RO Technician Training covering installation, servicing, repair, troubleshooting, and maintenance using real RO machines.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {joinReasons.map((reason) => (
                  <div key={reason.title} className="rounded-xl border border-white/14 bg-white/[0.08] p-4 backdrop-blur">
                    <h3 className="text-base font-black text-[#E7C376]">{reason.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/80">{reason.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 grid grid-cols-2 gap-2 text-[11px] font-black sm:gap-3 sm:text-sm">
                <a href={`https://wa.me/${whatsappLink}`} target="_blank" rel="noreferrer" className="inline-flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-2 text-center text-white sm:gap-2 sm:px-5"><MessageCircle className="h-5 w-5" /> WhatsApp: {whatsappDisplay}</a>
                <a href={`tel:${supportCall}`} className="inline-flex h-12 min-w-0 items-center justify-center gap-1.5 rounded-full border border-white/30 px-2 text-center text-white sm:gap-2 sm:px-5"><Phone className="h-5 w-5" /> Call: {supportCall}</a>
              </div>
            </div>

            <div className="rounded-xl border border-white/14 bg-[#FFF9F1] p-4 text-[#1D2D2E] shadow-[0_24px_70px_rgba(0,0,0,0.25)] md:rounded-2xl md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B68A45]">Join RO Training</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold md:text-3xl">Send Your Details Today</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input className={fieldClass} placeholder="Full Name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
                <input className={fieldClass} placeholder="Mobile Number" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} />
                <input className={fieldClass} placeholder="City" value={form.city} onChange={(event) => updateField("city", event.target.value)} />
                <div className="flex h-12 items-center rounded-xl border border-[#D9C5AB] bg-white px-4 text-sm font-black text-[#0A3A38]">Training Fee: Rs. {trainingAmount.toLocaleString("en-IN")}</div>
                <textarea className={`${fieldClass} h-28 py-3 md:col-span-2`} placeholder="Message / Preferred Batch Details" value={form.message} onChange={(event) => updateField("message", event.target.value)} />
              </div>
              <div className="mt-5 grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-black text-[#0A3A38]">I Am Interested</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[#5A6362]">Our team will contact you and share complete training details.</p>
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0A3A38]">Pay Now</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[#5A6362]">Complete your registration and confirm your seat.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={submitInterest} disabled={Boolean(saving)} className="h-12 rounded-full border border-[#C59A55] px-5 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8] disabled:opacity-60">
                  {saving === "INTERESTED" ? "Saving..." : "I Am Interested"}
                </button>
                <button type="button" onClick={submitPayment} disabled={Boolean(saving)} className="h-12 rounded-full bg-[#0A3A38] px-5 text-sm font-black text-white transition hover:bg-[#12383A] disabled:opacity-60">
                  {saving === "PAYMENT" ? "Processing..." : "Pay Now"}
                </button>
              </div>
              {message ? <p className="mt-4 rounded-lg bg-[#F5E9D8] px-3 py-2 text-sm font-semibold text-[#8A5F23]">{message}</p> : null}
            </div>
          </div>
          <div className="relative mx-auto mt-8 max-w-7xl rounded-2xl border border-white/12 bg-white/[0.08] px-4 py-3 text-center text-[11px] font-black uppercase leading-5 tracking-[0.12em] text-[#E7C376] md:mt-10 md:rounded-full md:px-5 md:text-xs md:tracking-[0.16em]">
            Limited Seats | Practical Training | Expert Guidance | Certificate | Career Support
          </div>
          <p className="relative mt-5 text-center font-serif text-xl font-semibold text-white md:text-2xl">Learn Today. Build Your Career Tomorrow!</p>
        </section>
      </main>
      <Footer />
      <MobileBottomTabs />
      <ShareDetailsModal
        open={Boolean(shareEnquiry)}
        title="RO Training Details Submitted"
        description="Your details are ready. Please share them on WhatsApp so the training team can follow up quickly."
        details={modalDetails}
        supportPhoneDisplay={whatsappDisplay}
        supportPhoneLink={whatsappLink}
        supportNote={`Please share these details on WhatsApp to ${whatsappDisplay}. For support call ${supportCall}.`}
        onShared={() => undefined}
        onContinue={() => {
          setShareEnquiry(null);
          setForm(emptyForm);
        }}
        continueLabel="Done"
      />
    </div>
  );
}

function formatPaymentStatus(status: TrainingEnquiry["paymentStatus"]) {
  if (status === "PAID") return "Paid";
  if (status === "PENDING") return "Pending";
  if (status === "FAILED") return "Failed";
  return "Not Required";
}