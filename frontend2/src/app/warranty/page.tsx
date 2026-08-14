import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function WarrantyPage() {
  return <SimpleContentPage eyebrow="Support" title="Warranty" description="Warranty support information for eligible products." sections={[{ title: "Coverage", body: "Warranty coverage depends on the specific product and purchase terms." }, { title: "Assistance", body: "Keep order details available when requesting warranty support." }]} />;
}
