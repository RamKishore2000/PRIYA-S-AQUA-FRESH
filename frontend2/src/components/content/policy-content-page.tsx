"use client";

import { useEffect, useState } from "react";
import { SimpleContentPage } from "@/components/content/simple-content-page";
import { fetchPolicyPage, type PolicyPageContent } from "@/services/policy-service";

export function PolicyContentPage({ slug }: { slug: string }) {
  const [policy, setPolicy] = useState<PolicyPageContent | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setPolicy(null);
    setError("");

    fetchPolicyPage(slug)
      .then((nextPolicy) => {
        if (active) setPolicy(nextPolicy);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load policy page from API.");
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (error) {
    return (
      <SimpleContentPage
        eyebrow="Policy"
        title="Policy page unavailable"
        description="Unable to load this page from the API. Please try again later."
        sections={[{ title: "API Error", body: error }]}
      />
    );
  }

  if (!policy) {
    return <SimpleContentPage eyebrow="Policy" title="Loading policy page..." description="" sections={[]} />;
  }

  return <SimpleContentPage eyebrow={policy.eyebrow} title={policy.title} description={policy.description} sections={policy.sections} />;
}