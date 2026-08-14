"use client";

import Link from "next/link";
import { useState } from "react";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Which water purifier is best for home use?",
    answer:
      "For most homes, RO or alkaline water purifiers are suitable depending on water quality, taste preference and daily usage. Priya's Aqua Fresh can help you choose based on your location and requirement.",
  },
  {
    question: "Do you provide installation support?",
    answer:
      "Yes. Installation support is available for eligible purifier models, including home and commercial RO systems.",
  },
  {
    question: "Can registered partners see special pricing?",
    answer:
      "Yes. Approved business accounts can log in and view special pricing where products have that pricing configured.",
  },
  {
    question: "Do you sell spare parts and filters?",
    answer:
      "Yes. Spare parts, filters and purifier accessories are available through the shop and can be ordered like regular products.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can call +919951078699 or email priyasaquafreshsales@gmail.com for product, service, installation or order support.",
  },
];

export function FaqsSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-transparent px-4 py-14 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-none border-y border-white/10 bg-white/[0.035] px-0 py-10 backdrop-blur-sm md:grid-cols-[0.75fr_1.25fr] md:px-8">
        <div className="px-4 md:px-0">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#12a8e6]/15 text-[#12a8e6]">
            <HelpCircle className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#12a8e6]">
            Support
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
            Quick answers for water purifiers, special pricing, installation, spare parts and customer support.
          </p>
          <Link
            href="/faqs"
            className="mt-6 inline-flex rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#12a8e6] hover:text-[#12a8e6]"
          >
            View All FAQs
          </Link>
        </div>

        <div className="divide-y divide-white/10 px-4 md:px-0">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="py-4">
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-base font-bold text-white"
                onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-[#12a8e6] transition ${openIndex === index ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {openIndex === index ? (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{faq.answer}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
