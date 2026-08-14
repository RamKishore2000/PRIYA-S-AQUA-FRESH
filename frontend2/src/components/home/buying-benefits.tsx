const benefits = [
  {
    title: "Genuine product range",
    description: "Choose from RO, alkaline, commercial systems, electronics and spare parts with clear product information.",
  },
  {
    title: "Support after purchase",
    description: "Get help for installation, product guidance and maintenance needs after your order.",
  },
  {
    title: "Value-focused pricing",
    description: "Compare original and selling prices clearly before choosing the right purifier for your need.",
  },
  {
    title: "Easy online shopping",
    description: "Browse categories, save wishlist items and move products to cart without confusion.",
  },
];

export function BuyingBenefits() {
  return (
    <section data-home-reveal className="relative overflow-hidden bg-[#FFF8EF] px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div data-reveal-item className="grid gap-8 rounded-[1.1rem] border border-[#E5D8C7] bg-[#FFF9F1] p-6 shadow-[0_8px_24px_rgba(84,61,35,0.07)] lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">Why Choose Priya&apos;s Aqua Fresh</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#243E3F] md:text-5xl">
              A cleaner way to choose your next water solution.
            </h2>
          </div>

          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} data-reveal-item className="rounded-xl border border-[#E8DCCB] bg-[#F8EFE5] p-5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FFF9F1] text-sm font-black text-[#2B6260]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-black text-[#243E3F]">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#687271]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
