import Image from "next/image";
import Link from "next/link";
import { Camera, Globe, Mail, MapPin, Phone, PlayCircle } from "lucide-react";

const footerColumns = [
  {
    title: "SHOP",
    links: [
      { label: "Alkaline Purifiers", href: "/products?category=alkaline-water-purifiers" },
      { label: "RO Purifiers", href: "/products?category=ro-water-purifiers" },
      { label: "Commercial Purifiers", href: "/products?category=commercial-water-purifiers" },
      { label: "Water Softeners", href: "/products?category=water-softeners" },
      { label: "Smart TVs", href: "/products?category=smart-tvs-electronics" },
      { label: "Spare Parts", href: "/products?category=spare-parts" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Services", href: "/services" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Shipping", href: "/shipping-policy" },
      { label: "Returns", href: "/refund-policy" },
      { label: "Warranty", href: "/warranty" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_2fr] md:px-8">
        <div>
          <Link href="/" className="inline-flex rounded-md bg-white p-3" aria-label="Priya's Aqua Fresh home">
            <Image
              src="/images/brand/priyas-aqua-fresh-logo-cropped.png"
              alt="Priya's Aquafresh"
              width={1180}
              height={445}
              className="h-auto w-[180px] object-contain"
            />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
            Premium water purification solutions for homes, businesses, and everyday healthy living.
          </p>
          <div className="mt-5 space-y-2 text-sm text-slate-300">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-teal-300" /> Contact our product experts</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-teal-300" /> support@priyasaquafresh.com</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-300" /> India</p>
          </div>
          <div className="mt-6 flex gap-2">
            {[Globe, Camera, PlayCircle].map((Icon, index) => (
              <Link key={index} href="/contact" aria-label="Contact Priya's Aqua Fresh" className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-slate-200 hover:bg-teal-500 hover:text-white">
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold tracking-[0.16em] text-teal-300">{column.title}</h3>
              <div className="mt-4 grid gap-3">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-slate-300 hover:text-white">{link.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-slate-400">
        Copyright 2026 Priya&apos;s Aqua Fresh. All rights reserved.
      </div>
    </footer>
  );
}
