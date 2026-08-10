import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/common/contact-form";
import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";

export default function ContactPage() {
  const items = [
    { icon: Phone, title: "Phone", text: "Contact our product experts" },
    { icon: Mail, title: "Email", text: "support@priyasaquafresh.com" },
    { icon: Clock, title: "Business Hours", text: "Monday to Saturday, 10:00 AM - 7:00 PM" },
    { icon: MapPin, title: "Address", text: "India" },
  ];

  return (
    <SitePage>
      <PageHeader
        eyebrow="Contact"
        title="Contact Us"
        description="Reach Priya's Aqua Fresh for product guidance, service support, and business enquiries."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {items.map((item) => (
            <div key={item.title} className="rounded-lg border border-white/10 bg-[#111418] p-5 shadow-sm">
              <item.icon className="h-5 w-5 text-[#12a8e6]" />
              <h2 className="mt-3 font-bold text-white">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
        <ContactForm />
      </section>
    </SitePage>
  );
}
