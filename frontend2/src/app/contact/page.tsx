import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { SitePage } from "@/components/layout/site-page";

const phoneNumber = "+919951078699";
const emailAddress = "priyasaquafreshsales@gmail.com";
const businessAddress = "2-4-1082, No.102, Om Sri Sai Nilayam, Nimboliadda, Kachiguda, Hyderabad, Telangana";
const mapQuery = encodeURIComponent(businessAddress);
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

const contactItems = [
  { icon: Phone, title: "Phone", text: phoneNumber, href: `tel:${phoneNumber}` },
  { icon: Mail, title: "Email", text: emailAddress, href: `mailto:${emailAddress}` },
  { icon: Clock, title: "Business Hours", text: "Monday to Saturday, 10:00 AM - 7:00 PM" },
  { icon: MapPin, title: "Address", text: businessAddress, href: mapUrl },
];

export default function ContactPage() {
  return (
    <SitePage eyebrow="Contact" title="Contact Us" description="Reach Priya's Aqua Fresh for product guidance, service support, and business enquiries.">
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0057C8]/10 text-[#0057C8] transition group-hover:bg-[#0057C8] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-3 text-lg font-black text-[#102033]">{item.title}</h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#40576C]">{item.text}</p>
                </>
              );

              if (item.href) {
                return (
                  <a key={item.title} href={item.href} target={item.title === "Address" ? "_blank" : undefined} rel={item.title === "Address" ? "noreferrer" : undefined} className="group block rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_rgba(0,87,200,0.07)] transition hover:-translate-y-1 hover:border-[#00AEEF]">
                    {content}
                  </a>
                );
              }

              return (
                <div key={item.title} className="rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_rgba(0,87,200,0.07)]">
                  {content}
                </div>
              );
            })}
          </div>
          <ContactForm />
        </div>

        <div className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] shadow-[0_14px_38px_rgba(0,87,200,0.08)]">
          <div className="flex flex-col gap-3 border-b border-[#D8EAF8] px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0057C8]">Visit Us</p>
              <h2 className="mt-1 text-xl font-black text-[#102033]">Find Priya's Aqua Fresh on Map</h2>
            </div>
            <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-full bg-[#0057C8] px-5 text-sm font-black text-white transition hover:bg-[#063B7A]">
              Open in Maps
            </a>
          </div>
          <iframe title="Priya's Aqua Fresh location map" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[320px] w-full border-0 md:h-[430px]" />
        </div>
      </section>
    </SitePage>
  );
}