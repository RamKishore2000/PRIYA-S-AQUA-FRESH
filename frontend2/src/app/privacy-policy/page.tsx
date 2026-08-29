import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function PrivacyPolicyPage() {
  return (
    <SimpleContentPage
      eyebrow="Policy"
      title="Privacy Policy"
      description="How Priya's Aqua Fresh collects, uses and protects customer information."
      sections={[
        {
          title: "Information collected",
          body: "We may collect customer name, mobile number, email address, delivery address, order details and support information when customers use the website, place orders or contact support.",
        },
        {
          title: "Information use",
          body: "Customer information is used for account access, order processing, delivery coordination, installation or service support, payment confirmation and customer communication.",
        },
        {
          title: "Payments",
          body: "Online payments are processed through authorized payment gateway services. Priya's Aqua Fresh does not store full card numbers, UPI PINs or net banking passwords on this website.",
        },
        {
          title: "Data sharing",
          body: "Customer information is not sold. Information may be shared only with service providers needed to complete orders, process payments, provide support or meet legal requirements.",
        },
        {
          title: "Data care",
          body: "Reasonable security practices are used to protect customer information. Customers should keep account login details confidential and contact support if they notice unauthorized activity.",
        },
      ]}
    />
  );
}
