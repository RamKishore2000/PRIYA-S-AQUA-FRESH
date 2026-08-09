import Link from "next/link";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <nav className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Link href="/" className="hover:text-teal-700">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-950">{title}</span>
        </nav>
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-teal-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{description}</p> : null}
      </div>
    </div>
  );
}
