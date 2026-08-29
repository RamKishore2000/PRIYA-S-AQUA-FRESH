import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function ShippingPolicyPage() {
  return (
    <SimpleContentPage
      eyebrow="Policy"
      title="Shipping Policy"
      description="Shipping and delivery information for orders placed with Priya's Aqua Fresh."
      sections={[
        {
          title: "Delivery timelines",
          body: "Orders are processed after confirmation and successful payment. Delivery timelines may vary based on product availability, delivery address, installation requirements and local service coverage.",
        },
        {
          title: "Delivery coordination",
          body: "For water purifier products, our team may contact the customer to confirm the address, preferred delivery time and installation support where applicable.",
        },
        {
          title: "Order updates",
          body: "Customers can check order status from their account or contact support with the order details for delivery updates.",
        },
        {
          title: "Delays",
          body: "Delivery may be delayed due to stock availability, weather, transport restrictions, incorrect address details or other circumstances outside normal control. Customers will be informed when support has an update.",
        },
      ]}
    />
  );
}
