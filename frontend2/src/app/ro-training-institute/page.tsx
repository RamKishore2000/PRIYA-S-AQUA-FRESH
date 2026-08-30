"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { Award, CheckCircle2, Clock, MessageCircle, Phone, PlayCircle, ShieldCheck, Users } from "lucide-react";
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
const supportCall = "8412255015";

const fallbackTrainingImages = [
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.34 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.35 PM (1).jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.35 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.36 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.37 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.40 PM (1).jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.40 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.44 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.48 PM.jpeg",
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
  const trainingImages = (settings.trainingImages?.length ? settings.trainingImages : fallbackTrainingImages).filter(Boolean).slice(0, 5);
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
        prefill: {
          name: form.fullName,
          contact: form.mobile,
        },
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
        <section className="app-training-hero relative min-h-[calc(100vh-7rem)] overflow-hidden bg-[#0A2426] text-white">
          <Image src={trainingImages[0]} alt="RO training practical class" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,36,38,0.96),rgba(10,36,38,0.78),rgba(10,36,38,0.36))]" />
          <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-4 py-16 md:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[#D8B879]">RO Training Institute</p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">Learn water purifier service work with practical RO training.</h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#F7EFE5] md:text-lg">
                Hands-on RO installation, service, filter replacement, fault checking, customer handling and field-ready maintenance training for learners who want practical skills.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#training-form" className="inline-flex h-12 items-center justify-center rounded-full bg-[#D8B879] px-6 text-sm font-black text-[#0A2426] transition hover:bg-white">Join Training</a>
                <a href={`tel:${supportCall}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 px-6 text-sm font-black text-white transition hover:bg-white/10">
                  <Phone className="h-4 w-4" /> Call Support
                </a>
              </div>
              <div className="mt-8 grid max-w-2xl gap-3 text-sm font-black sm:grid-cols-3">
                <div className="border-l-2 border-[#D8B879] pl-4">Real RO machines</div>
                <div className="border-l-2 border-[#D8B879] pl-4">Field service practice</div>
                <div className="border-l-2 border-[#D8B879] pl-4">Payment support</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F8F3EC] px-4 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">Training Gallery</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-[#1D2D2E] md:text-5xl">See the practical training setup.</h2>
              </div>
              <p className="max-w-md text-sm font-semibold leading-6 text-[#5A6362]">Five editable images from admin settings appear here. Use 1200 x 900 images for the best crop.</p>
            </div>
            <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-4 md:grid-rows-2 md:overflow-visible md:pb-0">
              {trainingImages.map((image, index) => (
                <figure key={`${image}-${index}`} className={`relative min-w-[82vw] snap-start overflow-hidden rounded-xl bg-[#EDE2D3] shadow-[0_16px_42px_rgba(84,61,35,0.12)] sm:min-w-[46vw] md:min-w-0 ${index === 0 ? "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto" : "aspect-[4/3]"}`}>
                  <Image src={image} alt={`RO training image ${index + 1}`} fill sizes={index === 0 ? "(max-width: 767px) 82vw, 50vw" : "(max-width: 767px) 82vw, 25vw"} className="object-cover" />
                  {index === 0 ? <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-4 text-sm font-black text-white">Hands-on training environment</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
        <section className="app-training-highlights px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { icon: Users, title: "Practical Classes", text: "Learn with real machines and service tools." },
                { icon: ShieldCheck, title: "Service Skills", text: "Installation, maintenance and complaint checking." },
                { icon: Clock, title: "Field Ready", text: "Focused training for day-to-day RO service work." },
                { icon: Award, title: "Career Support", text: "Guidance for service calls and customer communication." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
                  <item.icon className="h-7 w-7 text-[#0A3A38]" />
                  <h2 className="mt-4 text-lg font-black">{item.title}</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#5A6362]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="app-training-learn bg-white px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">What You Learn</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">Training made for practical RO service work.</h2>
              <div className="mt-6 grid gap-3 text-sm font-bold text-[#526161]">
                {[
                  "RO purifier installation and basic plumbing connection",
                  "Filter, membrane and pump replacement process",
                  "TDS checking, leakage checking and water flow diagnosis",
                  "Common service complaints and fault finding",
                  "Customer visit preparation and support communication",
                ].map((item) => (
                  <p key={item} className="flex gap-3 rounded-xl bg-[#F8F3EC] px-4 py-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#0A3A38]" /> {item}</p>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Live purifier service practice",
                "Installation and fitting guidance",
                "Filter, membrane and pump handling",
                "Fault checking with real tools",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-[#E5D8C7] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)]">
                  <CheckCircle2 className="h-6 w-6 text-[#0A3A38]" />
                  <p className="mt-4 text-base font-black text-[#1D2D2E]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {videos.length ? (
        <section className="app-training-videos px-4 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B68A45]">Training Videos</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">Watch recent training moments.</h2>
              </div>
              <Link href="https://www.youtube.com/@priyasaquafresh" target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#C59A55] px-5 text-sm font-black text-[#9B7137] hover:bg-[#F5E9D8]">
                <PlayCircle className="h-4 w-4" /> YouTube Channel
              </Link>
            </div>
            <div data-training-video-row className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {videos.map((video) => (
                <div key={video} className="overflow-hidden rounded-xl border border-[#E5D8C7] bg-black shadow-[0_14px_34px_rgba(84,61,35,0.08)]">
                  <iframe
                    title={`RO training video ${video}`}
                    src={`https://www.youtube.com/embed/${video}`}
                    className="aspect-[9/16] w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        ) : null}

        <section id="training-form" className="app-training-form bg-[#0A2426] px-4 py-16 text-white md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D8B879]">Join Now</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">Send your details for RO training.</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-[#F7EFE5]">
                Choose Interested to send your details first, or Pay Now to complete the training payment. After either option, share your details on WhatsApp to {whatsappDisplay}. For support call {supportCall}.
              </p>
              <div className="mt-6 grid gap-3 text-sm font-black">
                <a href={`https://wa.me/${whatsappLink}`} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-white"><MessageCircle className="h-5 w-5" /> WhatsApp {whatsappDisplay}</a>
                <a href={`tel:${supportCall}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-5 text-white"><Phone className="h-5 w-5" /> Support Call {supportCall}</a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/14 bg-[#FFF9F1] p-5 text-[#1D2D2E] shadow-[0_24px_70px_rgba(0,0,0,0.22)] md:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input className={fieldClass} placeholder="Full name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
                <input className={fieldClass} placeholder="Mobile number" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} />
                <input className={fieldClass} placeholder="City" value={form.city} onChange={(event) => updateField("city", event.target.value)} />
                <div className="flex h-12 items-center rounded-xl border border-[#D9C5AB] bg-white px-4 text-sm font-black text-[#0A3A38]">Fee: Rs. {trainingAmount.toLocaleString("en-IN")}</div>
                <textarea className={`${fieldClass} h-28 py-3 md:col-span-2`} placeholder="Message or preferred batch details" value={form.message} onChange={(event) => updateField("message", event.target.value)} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={submitInterest} disabled={Boolean(saving)} className="h-12 rounded-full border border-[#C59A55] px-5 text-sm font-black text-[#9B7137] transition hover:bg-[#F5E9D8] disabled:opacity-60">
                  {saving === "INTERESTED" ? "Saving..." : "I am Interested"}
                </button>
                <button type="button" onClick={submitPayment} disabled={Boolean(saving)} className="h-12 rounded-full bg-[#0A3A38] px-5 text-sm font-black text-white transition hover:bg-[#12383A] disabled:opacity-60">
                  {saving === "PAYMENT" ? "Processing..." : "Pay Now"}
                </button>
              </div>
              {message ? <p className="mt-4 rounded-lg bg-[#F5E9D8] px-3 py-2 text-sm font-semibold text-[#8A5F23]">{message}</p> : null}
            </div>
          </div>
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



