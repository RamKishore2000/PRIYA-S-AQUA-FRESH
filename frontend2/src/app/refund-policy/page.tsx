import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function RefundPolicyPage() {
  return (
    <SimpleContentPage
      eyebrow="Policy"
      title="Refund Policy"
      description="Refund and return guidance for eligible purchases made through Priya's Aqua Fresh."
      sections={[
        {
          title: "Return eligibility",
          body: "Customers may request return or replacement support within 7 days of delivery if the product received is damaged, defective, incorrect or materially different from the confirmed order.",
        },
        {
          title: "Non-returnable cases",
          body: "Products that are installed, used, altered, physically damaged after delivery or missing original accessories may not be eligible for return unless the issue is verified as a product defect.",
        },
        {
          title: "Refund process",
          body: "Approved refunds are processed to the original payment method after the request is reviewed and the product condition is verified where required. Bank or payment gateway timelines may apply.",
        },
        {
          title: "Support",
          body: "To request a return, replacement or refund, contact support with the order number, registered mobile number and clear details of the issue.",
        },
      ]}
    />
  );
}
