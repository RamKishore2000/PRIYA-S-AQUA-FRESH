import { FaqSection } from "@/components/home/faq-section";
import { SitePage } from "@/components/layout/site-page";

export default function FaqsPage() {
  return (
    <SitePage eyebrow="FAQs" title="Frequently Asked Questions" description="Quick answers about products, orders and service support.">
      <FaqSection />
    </SitePage>
  );
}
