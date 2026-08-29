import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function WarrantyPage() {
  return (
    <SimpleContentPage
      eyebrow="Support"
      title="Warranty"
      description="Warranty support information for eligible Priya's Aqua Fresh products."
      sections={[
        {
          title: "Coverage",
          body: "Warranty coverage depends on the specific product model, manufacturer terms and purchase details. Eligible warranty support generally applies to verified manufacturing defects during the applicable warranty period.",
        },
        {
          title: "Exclusions",
          body: "Warranty may not cover physical damage, misuse, unauthorized repairs, voltage issues, consumable filters, normal wear and tear or damage caused by improper handling unless specifically covered for that product.",
        },
        {
          title: "Proof of purchase",
          body: "Customers should keep the invoice, order confirmation and product details available when requesting warranty support.",
        },
        {
          title: "Assistance",
          body: "For warranty support, contact Priya's Aqua Fresh with the order details and a clear description of the issue so the support team can guide the next steps.",
        },
      ]}
    />
  );
}
