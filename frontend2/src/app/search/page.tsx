import { SitePage } from "@/components/layout/site-page";
import { SearchResultsClient } from "./search-results-client";

export default function SearchPage() {
  return (
    <SitePage eyebrow="Search" title="Search products" description="Find purifiers, electronics and spare parts quickly.">
      <section data-product-listing-section className="px-4 pb-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SearchResultsClient />
        </div>
      </section>
    </SitePage>
  );
}