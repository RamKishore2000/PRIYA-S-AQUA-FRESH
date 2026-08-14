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
    <section className="relative bg-transparent px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f4c766]">Customer Trust</p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-white md:text-4xl">
            Clean water confidence in every home
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trustImages.map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#10231c]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold leading-snug text-white">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
