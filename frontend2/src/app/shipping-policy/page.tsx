import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function ShippingPolicyPage() {
  return <SimpleContentPage eyebrow="Policy" title="Shipping Policy" description="Shipping and delivery information." sections={[{ title: "Delivery", body: "Delivery timelines can vary based on product availability and location." }, { title: "Order updates", body: "Customers can refer to order history or contact support for delivery updates." }]} />;
}
