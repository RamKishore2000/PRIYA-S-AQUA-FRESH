const locations = [
  "Homes",
  "Apartments",
  "Offices",
  "Schools",
  "Hospitals",
  "Hotels",
  "Commercial spaces",
  "Service needs",
];

export function WhereWeAre() {
  return (
    <section data-home-reveal className="bg-[linear-gradient(180deg,#071624_0%,#0b2130_100%)] px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div data-reveal-item>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#12a8e6]">Where We Are</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-white md:text-5xl">Present wherever clean water matters.</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Priya&apos;s Aqua Fresh supports different water-care needs across everyday homes, shared spaces and high-demand commercial environments.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {locations.map((location, index) => (
            <div key={location} data-reveal-item className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_54px_rgba(0,0,0,0.16)]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#12a8e6] text-sm font-black text-white">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-lg font-black text-white">{location}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
