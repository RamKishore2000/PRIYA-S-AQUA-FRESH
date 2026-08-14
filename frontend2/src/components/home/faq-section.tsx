"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Which purifier is best for home use?",
    answer: "RO and alkaline models are commonly selected for homes. The right choice depends on your water quality, family size and installation space.",
  },
  {
    question: "Do you provide installation support?",
    answer: "Yes. Priya's Aqua Fresh can help with installation support and service guidance for eligible purifier models.",
  },
  {
    question: "Can I buy filters and spare parts?",
    answer: "Yes. The product range includes service filters, purifier spares and care essentials to keep your system performing well.",
  },
  {
    question: "Do you support commercial purification?",
    answer: "Yes. Commercial RO and high-capacity purification options are available for offices, hotels, schools, hospitals and similar spaces.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section data-home-reveal className="bg-[#F8F3EC] px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <div data-reveal-item>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">FAQ</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#1D2D2E] md:text-5xl">Frequently Asked Questions</h2>
          <p className="mt-5 text-lg leading-8 text-[#5A6362]">Clear answers for product selection, service and support.</p>
        </div>
        <div className="grid gap-3">
          {faqs.map((faq, index) => (
            <div key={faq.question} data-reveal-item className="overflow-hidden rounded-[0.85rem] border border-[#E6DACB] bg-[#FFF9F1] shadow-[0_8px_24px_rgba(84,61,35,0.05)]">
              <button onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-lg font-black text-[#344344] transition hover:bg-[#F5EBDD]">
                {faq.question}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F4EADF] text-[#0A3A38]">{open === index ? "-" : "+"}</span>
              </button>
              <div className={`grid transition-all duration-500 ${open === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 leading-7 text-[#5A6362]">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
