import Image from "next/image";

const trustImages = [
  {
    title: "Pure water for every family",
    image: "/images/trust/family-clean-water.png",
  },
  {
    title: "Fresh drinking water at home",
    image: "/images/trust/woman-drinking-water.png",
  },
  {
    title: "Trusted for children and elders",
    image: "/images/trust/parent-child-water.png",
  },
  {
    title: "Reliable service support",
    image: "/images/trust/service-trust-water.png",
  },
];

export function CustomerTrustGallery() {
  return (
    <section className="bg-[#F8F3EC] px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B68A45]">Customer Trust</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#1D2D2E] md:text-4xl">
            Clean water confidence in every home
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trustImages.map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-lg border border-[#DEC393]/55 bg-white shadow-[0_18px_44px_rgba(107,84,43,0.10)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F5E9D8]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-black leading-snug text-[#1D2D2E]">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
