"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminToast } from "@/components/admin/admin-toast";
import { Icon } from "@/components/admin/icon";
import { PageHeader } from "@/components/admin/page-header";
import { adminApi, uploadImage } from "@/services/api";
import type { SiteSettings } from "@/types/admin";

type ThemeMode = "light" | "dark";

const defaultTrainingImages = [
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.34 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.35 PM (1).jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.35 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.36 PM.jpeg",
  "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.37 PM.jpeg",
];

const defaultTrainingVideos: string[] = [];

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
  trainingImages: defaultTrainingImages,
  trainingVideos: defaultTrainingVideos,
};

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("admin-dark", theme === "dark");
  localStorage.setItem("priyas-admin-theme", theme);
}

function ensureFive(values: string[], fallback: string[]) {
  return Array.from({ length: 5 }, (_, index) => values[index] || fallback[index] || "");
}

function toAdminYouTubeUrl(value: string) {
  const text = value.trim();
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  return `https://www.youtube.com/watch?v=${text}`;
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
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

  useEffect(() => {
    adminApi.getSiteSettings()
      .then((data) => setSettings({
        ...defaultSettings,
        ...data,
        trainingImages: ensureFive(data.trainingImages || [], defaultTrainingImages),
        trainingVideos: ensureFive(data.trainingVideos || [], defaultTrainingVideos).map(toAdminYouTubeUrl),
      }))
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

  function updateTrainingImage(index: number, value: string) {
    setSettings((current) => {
      const trainingImages = ensureFive(current.trainingImages || [], defaultTrainingImages);
      trainingImages[index] = value;
      return { ...current, trainingImages };
    });
  }

  function updateTrainingVideo(index: number, value: string) {
    setSettings((current) => {
      const trainingVideos = ensureFive(current.trainingVideos || [], defaultTrainingVideos);
      trainingVideos[index] = value;
      return { ...current, trainingVideos };
    });
  }

  async function uploadTrainingImage(index: number, file?: File) {
    if (!file) return;
    setUploadingImageIndex(index);
    setMessage("");
    try {
      const imageUrl = await uploadImage(file, "training", 1200, 900);
      updateTrainingImage(index, imageUrl);
      setMessage(`Training image ${index + 1} uploaded.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Training image upload failed.");
    } finally {
      setUploadingImageIndex(null);
    }
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...settings,
        trainingImages: ensureFive(settings.trainingImages || [], defaultTrainingImages).filter(Boolean).slice(0, 5),
        trainingVideos: ensureFive(settings.trainingVideos || [], defaultTrainingVideos).map((video) => video.trim()).filter(Boolean).slice(0, 5),
      };
      const saved = await adminApi.updateSiteSettings(payload);
      setSettings({ ...defaultSettings, ...saved, trainingVideos: ensureFive(saved.trainingVideos || [], defaultTrainingVideos).map(toAdminYouTubeUrl) });
      setMessage("Website settings updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update website settings.");
    } finally {
      setSaving(false);
    }
  }

  const trainingImages = ensureFive(settings.trainingImages || [], defaultTrainingImages);
  const trainingVideos = ensureFive(settings.trainingVideos || [], defaultTrainingVideos).map(toAdminYouTubeUrl);

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

        <SettingsCard title="RO Training Images" description="Set exactly five images used on the public training page.">
          <p className="mb-4 text-xs font-semibold leading-5 text-slate-500">Recommended size: 1200 x 900 px. Use clear RO training classroom/service images. Upload converts to WebP without cropping.</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {trainingImages.map((imageUrl, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-white">
                  <TrainingImagePreview imageUrl={imageUrl} index={index} />
                </div>
                <input value={imageUrl} onChange={(event) => updateTrainingImage(index, event.target.value)} className="mt-3 h-10 w-full rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500" placeholder={`Training image ${index + 1} URL`} />
                <label className="mt-2 inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                  {uploadingImageIndex === index ? "Uploading..." : "Upload"}
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingImageIndex !== null} onChange={(event) => uploadTrainingImage(index, event.target.files?.[0])} />
                </label>
              </div>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard title="RO Training Videos" description="Set exactly five YouTube videos used on the public training page.">
          <p className="mb-4 text-xs font-semibold leading-5 text-slate-500">Paste the full YouTube video URL. Admin keeps the full URL visible after save.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {trainingVideos.map((videoId, index) => (
              <Field key={index} label={`YouTube Video ${index + 1}`} value={videoId} onChange={(value) => updateTrainingVideo(index, value)} />
            ))}
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


function TrainingImagePreview({ imageUrl, index }: { imageUrl: string; index: number }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  if (!imageUrl || failed) {
    return <span className="grid h-full place-items-center text-xs font-semibold text-slate-400">Image {index + 1}</span>;
  }

  return (
    <img
      key={imageUrl}
      src={imageUrl}
      alt={`RO training image ${index + 1}`}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
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