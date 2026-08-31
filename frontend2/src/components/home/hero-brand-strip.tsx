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
    <section className="relative z-20 overflow-hidden bg-[#F3FAFF] py-5 md:py-7">
      <div className="brand-cert-window">
        <div className="brand-cert-track">
          {[...brandItems, ...brandItems].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex h-20 w-44 shrink-0 items-center justify-center rounded-lg border border-[#DEC393]/55 bg-white/88 px-3 py-2 shadow-[0_14px_34px_rgba(107,84,43,0.10)] md:h-24 md:w-56"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={360}
                height={144}
                className="max-h-16 w-full object-contain md:max-h-20"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
