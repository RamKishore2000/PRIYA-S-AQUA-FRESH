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
            <article key={section.title} className="grid gap-5 rounded-2xl border border-[#D8EAF8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(0,87,200,0.07)] md:grid-cols-[5rem_1fr]">
              <span className="text-3xl font-black text-[#0057C8]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-2xl font-black text-[#102033]">{section.title}</h2>
                <p className="mt-3 font-semibold leading-8 text-[#40576C]">{section.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
