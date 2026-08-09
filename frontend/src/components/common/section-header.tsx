type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">{eyebrow}</p> : null}
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-base leading-7 text-slate-600">{subtitle}</p> : null}
    </div>
  );
}
