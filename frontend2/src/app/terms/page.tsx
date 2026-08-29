import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function TermsPage() {
  return (
    <SimpleContentPage
      eyebrow="Policy"
      title="Terms & Conditions"
      description="Terms for using the Priya's Aqua Fresh website and placing orders."
      sections={[
        {
          title: "Use of site",
          body: "By using this website, customers agree to provide accurate information and use the website only for lawful purchase, account and support activities.",
        },
        {
          title: "Product information",
          body: "Product images, specifications, prices, offers and availability may be updated from time to time. Priya's Aqua Fresh aims to keep information accurate, but minor differences may occur.",
        },
        {
          title: "Orders",
          body: "Orders are subject to confirmation, payment status, serviceability of the delivery address and product availability. Priya's Aqua Fresh may contact the customer to verify order details before processing.",
        },
        {
          title: "Payments",
          body: "Customers are responsible for completing payment using the available payment options. Payment confirmation from the payment gateway is required before an online paid order is processed.",
        },
        {
          title: "Support",
          body: "For order, delivery, warranty, return or refund assistance, customers should contact support with the order number and registered contact details.",
        },
      ]}
    />
  );
}
