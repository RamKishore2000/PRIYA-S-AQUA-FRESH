import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function TermsPage() {
  return <SimpleContentPage eyebrow="Policy" title="Terms & Conditions" description="Basic terms for using the Priya's Aqua Fresh storefront." sections={[{ title: "Use of site", body: "Product information, prices and availability may be updated as business needs change." }, { title: "Orders", body: "Orders are subject to confirmation, payment status and product availability." }]} />;
}
