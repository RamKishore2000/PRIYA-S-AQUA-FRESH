import Link from "next/link";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-white/10 bg-[#0d1114]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 lg:py-14">
        <nav className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-400 sm:text-sm lg:mb-4">
          <Link href="/" className="hover:text-[#12a8e6]">
            Home
          </Link>
          <span>/</span>
          <span className="text-white">{title}</span>
        </nav>
        {eyebrow ? (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#12a8e6] sm:text-xs sm:tracking-[0.26em]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7 lg:mt-4">{description}</p> : null}
      </div>
    </div>
  );
}
