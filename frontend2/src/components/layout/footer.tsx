"use client";

import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useShop } from "@/context/shop-context";

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.48 0 .12 5.36.12 11.96c0 2.1.55 4.16 1.6 5.97L0 24l6.22-1.63a11.95 11.95 0 0 0 5.86 1.5h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.53-8.43ZM12.09 21.85h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.69.97.99-3.6-.23-.37a9.86 9.86 0 0 1-1.51-5.3c0-5.45 4.44-9.89 9.9-9.89a9.84 9.84 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 6.99c-.01 5.45-4.45 9.89-9.94 9.89Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.8-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.52 3.58 12 3.58 12 3.58s-7.52 0-9.39.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12c1.87.5 9.39.5 9.39.5s7.52 0 9.39-.5a3 3 0 0 0 2.11-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.23H4.29l13.32 17.42Z" />
    </svg>
  );
}

const footerColumns = [
  {
    title: "COMPANY",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Categories", href: "/categories" },
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

const socialLinks = [
  { label: "WhatsApp", href: "https://wa.me/919121043483", icon: WhatsAppIcon, colorClass: "text-[#25d366]" },
  { label: "Facebook", href: "https://www.facebook.com/priyasaquafresh", icon: FacebookIcon, colorClass: "text-[#1877f2]" },
  { label: "YouTube", href: "https://www.youtube.com/@priyasaquafresh", icon: YouTubeIcon, colorClass: "text-[#ff0000]" },
  { label: "Instagram", href: "https://www.instagram.com/priyasaquafresh", icon: InstagramIcon, colorClass: "text-[#e4405f]" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/priyas-aqua-fresh", icon: LinkedInIcon, colorClass: "text-[#0a66c2]" },
  { label: "X", href: "https://x.com/priyasaquafresh", icon: XIcon, colorClass: "text-[#1D2D2E]" },
];

export function Footer() {
  const { user } = useShop();
  const isDealer = user?.role === "DEALER";
  const visibleFooterColumns = footerColumns.map((column) => ({
    ...column,
    links: isDealer ? column.links.filter((link) => link.href !== "/services") : column.links,
  }));

  return (
    <footer className="relative z-20 border-t border-[#DFCEB9] bg-[linear-gradient(180deg,#F7EFE5,#EFE2D2)] text-[#243A3B] shadow-[0_-18px_60px_rgba(84,61,35,0.08)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(182,138,69,0.16),transparent_42%)]" />
      <div className="relative mx-auto max-w-[96rem] overflow-hidden px-5 pt-10 md:px-8">
        <p className="footer-video-text select-none text-center font-serif text-[clamp(3rem,10vw,9.5rem)] font-black uppercase leading-none tracking-[0.04em] lg:whitespace-nowrap lg:text-[clamp(4.6rem,7.4vw,8.6rem)] lg:tracking-[0.015em]">
          Priya&apos;s Aqua Fresh
        </p>
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1.4fr] md:px-8">
        <div>
          <Link href="/" className="inline-flex" aria-label="Priya's Aqua Fresh home">
            <Image src="/logo-header.png" alt="Priya's Aquafresh" width={486} height={191} className="h-auto w-[180px] object-contain" />
          </Link>
          <p className="mt-5 max-w-sm text-sm font-semibold leading-6 text-[#5D6766]">
            Premium water purification solutions for homes, businesses, and everyday healthy living.
          </p>
          <div className="mt-5 space-y-2 text-sm font-semibold text-[#5D6766]">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#B68A45]" /> +919951078699</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#B68A45]" /> priyasaquafreshsales@gmail.com</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#B68A45]" /> India</p>
          </div>
          <div className="mt-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B68A45]">Follow Us</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[#DFCEB9] bg-white text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B68A45] hover:bg-white hover:shadow-md"
                >
                  <social.icon className={`h-5 w-5 ${social.colorClass}`} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {visibleFooterColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-black tracking-[0.16em] text-[#B68A45]">{column.title}</h3>
              <div className="mt-4 grid gap-3">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm font-semibold text-[#5D6766] transition hover:text-[#0A3A38]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[#DFCEB9] px-5 py-5 text-center text-sm font-semibold text-[#7D7B75]">
        Copyright 2026 Priya&apos;s Aqua Fresh. All rights reserved.
      </div>
    </footer>
  );
}
