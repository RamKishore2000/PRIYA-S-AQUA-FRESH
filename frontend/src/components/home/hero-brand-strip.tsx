import Image from "next/image";

const brandItems = [
  { name: "Make in India", image: "/images/certifications/make-in-india.png" },
  { name: "MSME", image: "/images/certifications/msme.png" },
  { name: "Startup India", image: "/images/certifications/startup-india.png" },
  { name: "ISO 9001:2015", image: "/images/certifications/iso-9001-2015.png" },
  { name: "India Water Quality Association", image: "/images/certifications/india-water-quality-association.png" },
];

export function HeroBrandStrip() {
  return (
    <section className="relative z-20 bg-[#F8F3EC] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {brandItems.map((item) => (
            <div
              key={item.name}
              className="flex h-24 items-center justify-center rounded-lg border border-[#DEC393]/55 bg-white/90 px-2 py-2 shadow-[0_14px_34px_rgba(107,84,43,0.10)]"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={360}
                height={144}
                className="max-h-20 w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
