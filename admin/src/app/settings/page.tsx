"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { Icon } from "@/components/admin/icon";
import { PageHeader } from "@/components/admin/page-header";
import { adminApi } from "@/services/api";
import type { SiteSettings } from "@/types/admin";

type ThemeMode = "light" | "dark";

const defaultSettings: SiteSettings = {
  phone: "+919951078699",
  whatsapp: "919121043483",
  email: "priyasaquafreshsales@gmail.com",
  address: "India",
  facebook: "https://www.facebook.com/priyasaquafresh",
  instagram: "https://www.instagram.com/priyasaquafresh",
  youtube: "https://www.youtube.com/@priyasaquafresh",
  linkedin: "https://www.linkedin.com/company/priyas-aqua-fresh",
  x: "https://x.com/priyasaquafresh",
  trainingAmount: 4999,
  orderAdvanceAmount: 500,
};

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("admin-dark", theme === "dark");
  localStorage.setItem("priyas-admin-theme", theme);
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("priyas-admin-theme") === "dark" ? "dark" : "light";
  });
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminApi.getSiteSettings()
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load website settings."))
      .finally(() => setLoading(false));
  }, []);

  function updateTheme(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    setMessage(`${nextTheme === "dark" ? "Dark" : "Light"} mode enabled.`);
  }

  function updateField<K extends keyof SiteSettings>(field: K, value: SiteSettings[K]) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    try {
      const saved = await adminApi.updateSiteSettings(settings);
      setSettings({ ...defaultSettings, ...saved });
      setMessage("Website settings updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update website settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <AdminToast message={message} />
      <PageHeader title="Settings" description="Manage storefront contact details, social links, payment amounts and admin display preferences." />

      <div className="grid gap-6">
        <SettingsCard title="Website Contact Details" description="These values appear on the storefront header strip and footer.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Phone Number" value={settings.phone} onChange={(value) => updateField("phone", value)} />
            <Field label="WhatsApp Number" value={settings.whatsapp} onChange={(value) => updateField("whatsapp", value)} />
            <Field label="Email" value={settings.email} onChange={(value) => updateField("email", value)} />
            <Field label="Address" value={settings.address} onChange={(value) => updateField("address", value)} />
          </div>
        </SettingsCard>

        <SettingsCard title="Website Social Media Links" description="Update social links used in the storefront header strip and footer.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Facebook URL" value={settings.facebook} onChange={(value) => updateField("facebook", value)} />
            <Field label="Instagram URL" value={settings.instagram} onChange={(value) => updateField("instagram", value)} />
            <Field label="YouTube URL" value={settings.youtube} onChange={(value) => updateField("youtube", value)} />
            <Field label="LinkedIn URL" value={settings.linkedin} onChange={(value) => updateField("linkedin", value)} />
            <Field label="X URL" value={settings.x} onChange={(value) => updateField("x", value)} className="md:col-span-2" />
          </div>
        </SettingsCard>

                <SettingsCard title="Payment Amount Settings" description="Control advance booking amount for product checkout and payment amount for RO Training.">
          <div className="grid gap-4 md:grid-cols-2">
            <NumberField label="Order Advance Booking Amount" value={settings.orderAdvanceAmount} onChange={(value) => updateField("orderAdvanceAmount", value)} />
            <NumberField label="RO Training Payment Amount" value={settings.trainingAmount} onChange={(value) => updateField("trainingAmount", value)} />
          </div>
        </SettingsCard>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            disabled={saving || loading}
            className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : loading ? "Loading..." : "Save Settings"}
          </button>
        </div>

        <SettingsCard title="Appearance" description="Choose how the admin panel should look on this browser.">
          <div className="grid gap-4 md:grid-cols-2">
            <ThemeButton active={theme === "light"} icon="sun" title="Light Mode" text="Bright background for daytime admin work." onClick={() => updateTheme("light")} />
            <ThemeButton active={theme === "dark"} icon="moon" title="Dark Mode" text="Low-glare admin interface for night usage." onClick={() => updateTheme("dark")} darkIcon />
          </div>
        </SettingsCard>
      </div>
    </AdminShell>
  );
}

function SettingsCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-5">
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Math.max(1, Number(event.target.value || 0)))}
        className="h-11 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
}

function ThemeButton({ active, icon, title, text, onClick, darkIcon = false }: { active: boolean; icon: string; title: string; text: string; onClick: () => void; darkIcon?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-5 text-left transition ${active ? "border-teal-500 bg-teal-50 ring-2 ring-teal-100" : "border-slate-200 bg-white hover:border-slate-300"}`}
    >
      <span className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-md shadow-sm ${darkIcon ? "bg-slate-950 text-slate-100" : "bg-white text-amber-500"}`}>
          <Icon name={icon} />
        </span>
        <span>
          <span className="block font-bold text-slate-950">{title}</span>
          <span className="mt-1 block text-sm text-slate-500">{text}</span>
        </span>
      </span>
    </button>
  );
}