import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function AccountDeletionPage() {
  return (
    <SimpleContentPage
      eyebrow="Support"
      title="Account Deletion"
      description="Priya's Aqua Fresh users can request account and personal data deletion at any time."
      sections={[
        {
          title: "How to request deletion",
          body: "Email priyasaquafreshsales@gmail.com from your registered email address, or mention your registered mobile number in the message. Use the subject line Account Deletion Request so our support team can process it quickly.",
        },
        {
          title: "Information to include",
          body: "Please include your name, registered mobile number, and any order reference if available. This helps us verify the account owner before deleting account data.",
        },
        {
          title: "Data deleted",
          body: "After verification, we delete or anonymize account profile data such as name, phone number, email address, saved addresses, wishlist, cart, and account access records from active systems.",
        },
        {
          title: "Data retained when required",
          body: "Some order, invoice, payment, tax, warranty, service, and dispute records may be retained for legal, accounting, security, or business record requirements. Data that is retained is kept only for the required purpose.",
        },
        {
          title: "Processing time",
          body: "Deletion requests are usually processed within 7 working days after verification. We may contact you if more information is needed to confirm the request.",
        },
      ]}
    />
  );
}