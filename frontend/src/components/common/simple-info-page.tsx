import { PageHeader } from "@/components/common/page-header";
import { SitePage } from "@/components/common/site-page";

export function SimpleInfoPage({ title, description }: { title: string; description: string }) {
  return (
    <SitePage>
      <PageHeader title={title} description={description} />
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 leading-7 text-slate-600 shadow-sm">
          <p>{description}</p>
          <p className="mt-4">
            This page is prepared as frontend placeholder content and can be expanded with final business policy details later.
          </p>
        </div>
      </section>
    </SitePage>
  );
}
