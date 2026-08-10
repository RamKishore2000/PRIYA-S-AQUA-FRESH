type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: "light" | "dark";
};

export function SectionHeader({ eyebrow, title, subtitle, variant = "light" }: SectionHeaderProps) {
  const isDark = variant === "dark";

  return (
    <div className="mb-8 flex flex-col gap-2">
      {isDark ? <span className="h-1 w-14 rounded-full bg-[#12a8e6]" aria-hidden="true" /> : null}
      {eyebrow ? <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#12a8e6]" : "text-slate-600"}`}>{eyebrow}</p> : null}
      <h2 className={`text-2xl font-bold tracking-tight md:text-4xl ${isDark ? "text-white" : "text-slate-950"}`}>{title}</h2>
      {subtitle ? <p className={`max-w-2xl text-base leading-7 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{subtitle}</p> : null}
    </div>
  );
}
