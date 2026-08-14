import { SimpleContentPage } from "@/components/content/simple-content-page";

export default function PrivacyPolicyPage() {
  return <SimpleContentPage eyebrow="Policy" title="Privacy Policy" description="How customer information is handled." sections={[{ title: "Information use", body: "Customer information is used for account access, order processing, service support and communication." }, { title: "Data care", body: "Sensitive information should be handled securely and only used for intended business purposes." }]} />;
}
