"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { Icon } from "@/components/admin/icon";
import { PageHeader } from "@/components/admin/page-header";
import { adminApi } from "@/services/api";
import type { PolicyPage } from "@/types/admin";

const policyOrder = ["shipping-policy", "refund-policy", "warranty", "privacy-policy", "terms"];

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyPage[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("shipping-policy");
  const [draft, setDraft] = useState<PolicyPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminApi.listPolicies()
      .then((data) => {
        const ordered = [...data].sort((first, second) => policyOrder.indexOf(first.slug) - policyOrder.indexOf(second.slug));
        setPolicies(ordered);
        setSelectedSlug(ordered[0]?.slug || "shipping-policy");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load policy pages."))
      .finally(() => setLoading(false));
  }, []);

  const selectedPolicy = useMemo(() => policies.find((policy) => policy.slug === selectedSlug) || null, [policies, selectedSlug]);

  useEffect(() => {
    if (selectedPolicy) {
      setDraft({ ...selectedPolicy, sections: selectedPolicy.sections.map((section) => ({ ...section })) });
    }
  }, [selectedPolicy]);

  function updateDraft<K extends keyof PolicyPage>(field: K, value: PolicyPage[K]) {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  }

  function updateSection(index: number, field: "title" | "body", value: string) {
    setDraft((current) => {
      if (!current) return current;
      const sections = current.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, [field]: value } : section);
      return { ...current, sections };
    });
  }

  function addSection() {
    setDraft((current) => current ? { ...current, sections: [...current.sections, { title: "", body: "" }] } : current);
  }

  function removeSection(index: number) {
    setDraft((current) => {
      if (!current) return current;
      const sections = current.sections.filter((_, sectionIndex) => sectionIndex !== index);
      return { ...current, sections: sections.length ? sections : [{ title: "", body: "" }] };
    });
  }

  async function savePolicy() {
    if (!draft) return;
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...draft,
        status: "Active" as PolicyPage["status"],
        sections: draft.sections.map((section) => ({ title: section.title.trim(), body: section.body.trim() })).filter((section) => section.title && section.body),
      };
      const saved = await adminApi.updatePolicy(payload);
      setPolicies((current) => current.map((policy) => policy.slug === saved.slug ? saved : policy));
      setDraft({ ...saved, sections: saved.sections.map((section) => ({ ...section })) });
      setMessage("Policy page updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update policy page.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title="Policy Pages" description="Edit Shipping, Returns, Warranty, Privacy Policy and Terms content shown on the website and APK." />

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="space-y-2">
            {policies.map((policy) => (
              <button
                key={policy.slug}
                type="button"
                onClick={() => setSelectedSlug(policy.slug)}
                className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left transition ${selectedSlug === policy.slug ? "bg-teal-50 text-teal-800 ring-1 ring-teal-100" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span>
                  <span className="block text-sm font-bold">{policy.title}</span>
                  <span className="mt-1 block text-xs font-semibold text-slate-400">/{policy.slug}</span>
                </span>
              </button>
            ))}
            {!policies.length && !loading ? <p className="px-3 py-4 text-sm font-semibold text-slate-500">No policies found.</p> : null}
          </div>
        </aside>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? <p className="text-sm font-semibold text-slate-500">Loading policy pages...</p> : null}
          {!loading && draft ? (
            <div className="grid gap-5">
              <div className="grid gap-4">
                <label className="grid gap-1.5">
                  <span className="text-sm font-bold text-slate-700">Page Title</span>
                  <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-sm font-bold text-slate-700">Page Description</span>
                <textarea value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} rows={3} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
              </label>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <div>
                  <h2 className="text-base font-bold text-slate-950">Policy Points</h2>
                  <p className="mt-1 text-sm text-slate-500">Add each client point with a heading and explanation.</p>
                </div>
                <button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800">
                  Add Point
                </button>
              </div>

              <div className="grid gap-4">
                {draft.sections.map((section, index) => (
                  <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Point {index + 1}</span>
                      <button type="button" onClick={() => removeSection(index)} className="rounded-md px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50">Remove</button>
                    </div>
                    <div className="grid gap-3">
                      <input value={section.title} onChange={(event) => updateSection(index, "title", event.target.value)} placeholder="Point heading" className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
                      <textarea value={section.body} onChange={(event) => updateSection(index, "body", event.target.value)} placeholder="Point details" rows={4} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-5">
                <button type="button" onClick={savePolicy} disabled={saving} className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? "Saving..." : "Save Policy"}
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </AdminShell>
  );
}