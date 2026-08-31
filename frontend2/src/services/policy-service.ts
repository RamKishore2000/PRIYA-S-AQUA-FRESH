const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type PolicySection = {
  title: string;
  body: string;
};

export type PolicyPageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: PolicySection[];
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

type ApiPolicyPage = {
  slug: string;
  title: string;
  description: string;
  sections: PolicySection[] | string;
  status: "ACTIVE" | "INACTIVE";
};

const policyEyebrows: Record<string, string> = {
  "shipping-policy": "Policy",
  "refund-policy": "Policy",
  warranty: "Support",
  "privacy-policy": "Policy",
  terms: "Policy",
};

function parseSections(value: ApiPolicyPage["sections"]) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || "[]") as PolicySection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapPolicyPage(policy: ApiPolicyPage): PolicyPageContent {
  const sections = parseSections(policy.sections).filter((section) => section.title && section.body);
  return {
    slug: policy.slug,
    eyebrow: policyEyebrows[policy.slug] || "Policy",
    title: policy.title,
    description: policy.description || "",
    sections,
  };
}

export async function fetchPolicyPage(slug: string) {
  const response = await fetch(`${API_BASE_URL}/api/policies/${slug}`, { cache: "no-store" });
  let result: ApiResponse<{ policy?: ApiPolicyPage }> | null = null;
  try {
    result = await response.json() as ApiResponse<{ policy?: ApiPolicyPage }>;
  } catch {
    throw new Error("Unable to read policy API response.");
  }

  if (!response.ok || !result.success || !result.data?.policy) {
    throw new Error(result.message || "Unable to load policy page from API.");
  }

  return mapPolicyPage(result.data.policy);
}