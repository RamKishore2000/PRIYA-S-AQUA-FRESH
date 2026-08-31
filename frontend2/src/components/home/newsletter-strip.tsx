export function NewsletterStrip() {
  return (
    <section data-home-reveal className="bg-[#F3FAFF] px-5 py-8 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 overflow-hidden rounded-[1.1rem] border border-[#0057C8]/30 bg-[linear-gradient(90deg,#063335,#0A4A47)] p-6 text-white shadow-[0_18px_40px_rgba(3,35,36,0.18)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div data-reveal-item>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#28B463]">Stay Updated</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">Premium offers and service updates</h2>
        </div>
        <form data-reveal-item className="w-full max-w-xl">
          <div className="flex overflow-hidden rounded-lg border border-[#28B463]/40 bg-[#FFFFFF] p-1 shadow-[0_10px_24px_rgba(0,0,0,0.14)]">
            <input type="email" placeholder="Enter your email address" className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm font-semibold text-[#102033] outline-none placeholder:text-[#74879A]" />
            <button className="h-11 shrink-0 rounded-md bg-[linear-gradient(90deg,#B8863E,#D4A55D)] px-5 text-sm font-black text-white transition hover:brightness-105">
            Subscribe Now
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
