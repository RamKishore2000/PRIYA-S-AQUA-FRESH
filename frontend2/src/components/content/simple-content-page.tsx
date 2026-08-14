import { SitePage } from "@/components/layout/site-page";

type SimpleContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[];
};

export function SimpleContentPage({ eyebrow, title, description, sections }: SimpleContentPageProps) {
  return (
    <SitePage eyebrow={eyebrow} title={title} description={description}>
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto grid max-w-5xl gap-6">
          {sections.map((section, index) => (
            <article key={section.title} className="grid gap-5 rounded-2xl border border-[#E8DCCB] bg-[#FFF9F1] p-6 shadow-[0_10px_30px_rgba(84,61,35,0.06)] md:grid-cols-[5rem_1fr]">
              <span className="text-3xl font-black text-[#B68A45]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-2xl font-black text-[#1D2D2E]">{section.title}</h2>
                <p className="mt-3 font-semibold leading-8 text-[#5A6362]">{section.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
