import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { SitePage } from "@/components/layout/site-page";

const contactItems = [
  { icon: Phone, title: "Phone", text: "+919951078699" },
  { icon: Mail, title: "Email", text: "priyasaquafreshsales@gmail.com" },
  { icon: Clock, title: "Business Hours", text: "Monday to Saturday, 10:00 AM - 7:00 PM" },
  { icon: MapPin, title: "Address", text: "2-4-1082, NO.102, OM SRI SAI NILAYAM, NIMBOLIADDA, KACHIGUDA." },
];

export default function ContactPage() {
  return (
    <SitePage eyebrow="Contact" title="Contact Us" description="Reach Priya's Aqua Fresh for product guidance, service support, and business enquiries.">
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contactItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-5 shadow-[0_10px_30px_rgba(84,61,35,0.06)] transition hover:-translate-y-1 hover:border-[#D6B47A]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A3A38]/10 text-[#0A3A38]">
                  <item.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-3 text-lg font-black text-[#1D2D2E]">{item.title}</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#5A6362]">{item.text}</p>
              </div>
            ))}
          </div>
          <ContactForm />
        </div>
      </section>
    </SitePage>
  );
}
