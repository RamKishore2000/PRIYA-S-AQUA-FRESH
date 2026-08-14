import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function RefundPolicyPage() {
  return <SimpleContentPage eyebrow="Policy" title="Refund Policy" description="Refund and return guidance for eligible purchases." sections={[{ title: "Eligibility", body: "Refund eligibility depends on product condition, order status and the applicable purchase policy." }, { title: "Support", body: "Contact support with your order details for refund or return assistance." }]} />;
}
