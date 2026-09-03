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
  "",
  "",
  "",
  "",
];

const defaultTrainingVideos: string[] = [];

const trainingImageLabels = [
  "Banner Big Image",
  "Banner Small Image 1",
  "Banner Small Image 2",
  "Banner Small Image 3",
  "Banner Small Image 4",
  "Practical Card Image 1",
  "Practical Card Image 2",
  "Practical Card Image 3",
  "Practical Card Image 4",
];

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
  trainingAmount: 10000,
  orderAdvanceAmount: 500,
  trainingImages: defaultTrainingImages,
  trainingVideos: defaultTrainingVideos,
  aboutImages: [
    "/Untitled-design-10-2048x2048.png",
    "/Untitled-design-10-2048x2048.png",
    "/WhatsApp Image 2026-08-28 at 5.03.19 PM.jpeg",
    "/WhatsApp Image 2026-08-28 at 5.04.41 PM.jpeg",
  ],
};

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("admin-dark", theme === "dark");
  localStorage.setItem("priyas-admin-theme", theme);
}

function ensureSlots(values: string[], fallback: string[], count: number) {
  return Array.from({ length: count }, (_, index) => values[index] || fallback[index] || "");
}


type TrainingImageSize = {
  width: number;
  height: number;
};

function getTrainingImageSize(index: number): TrainingImageSize {
  if (index === 0) return { width: 1600, height: 1000 };
  if (index >= 1 && index <= 4) return { width: 1200, height: 900 };
  return { width: 1600, height: 900 };
}

function validateExactImageSize(file: File, width: number, height: number) {
  return new Promise<void>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (image.naturalWidth !== width || image.naturalHeight !== height) {
        reject(new Error(`Please upload ${width} x ${height} px image. Selected image is ${image.naturalWidth} x ${image.naturalHeight} px.`));
        return;
      }
      resolve();
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read image size."));
    };
    image.src = objectUrl;
  });
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
  const [trainingImageErrors, setTrainingImageErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    adminApi.getSiteSettings()
      .then((data) => setSettings({
        ...defaultSettings,
        ...data,
        trainingImages: ensureSlots(data.trainingImages || [], defaultTrainingImages, 9),
        trainingVideos: ensureSlots(data.trainingVideos || [], defaultTrainingVideos, 5).map(toAdminYouTubeUrl),
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
      const trainingImages = ensureSlots(current.trainingImages || [], defaultTrainingImages, 9);
      trainingImages[index] = value;
      return { ...current, trainingImages };
    });
  }

  function updateTrainingVideo(index: number, value: string) {
    setSettings((current) => {
      const trainingVideos = ensureSlots(current.trainingVideos || [], defaultTrainingVideos, 5);
      trainingVideos[index] = value;
      return { ...current, trainingVideos };
    });
  }

  async function uploadTrainingImage(index: number, file?: File) {
    if (!file) return;
    const size = getTrainingImageSize(index);
    setUploadingImageIndex(index);
    setMessage("");
    setTrainingImageErrors((current) => ({ ...current, [index]: "" }));
    try {
      await validateExactImageSize(file, size.width, size.height);
      const imageUrl = await uploadImage(file, "training", size.width, size.height);
      updateTrainingImage(index, imageUrl);
      setMessage(`Training image ${index + 1} uploaded.`);
    } catch (error) {
      setTrainingImageErrors((current) => ({ ...current, [index]: error instanceof Error ? error.message : "Training image upload failed." }));
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
        trainingImages: ensureSlots(settings.trainingImages || [], defaultTrainingImages, 9).slice(0, 9),
        trainingVideos: ensureSlots(settings.trainingVideos || [], defaultTrainingVideos, 5).map((video) => video.trim()).filter(Boolean).slice(0, 5),
      };
      const saved = await adminApi.updateSiteSettings(payload);
      setSettings({
        ...defaultSettings,
        ...saved,
        trainingImages: ensureSlots(saved.trainingImages || [], defaultTrainingImages, 9),
        trainingVideos: ensureSlots(saved.trainingVideos || [], defaultTrainingVideos, 5).map(toAdminYouTubeUrl),
      });
      setMessage("Website settings updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update website settings.");
    } finally {
      setSaving(false);
    }
  }

  const trainingImages = ensureSlots(settings.trainingImages || [], defaultTrainingImages, 9);
  const trainingVideos = ensureSlots(settings.trainingVideos || [], defaultTrainingVideos, 5).map(toAdminYouTubeUrl);

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

        <SettingsCard title="RO Training Images" description="Text is fixed on the public RO training page. Admin can change only these images.">
          <div className="grid gap-8">
            <div>
              <div className="mb-4 rounded-md border border-blue-100 bg-blue-50 px-4 py-3">
                <h3 className="text-sm font-black text-blue-950">Banner Big Image</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-blue-800">Used as the main hero/background image and the big left image in the gallery.</p>
                <p className="mt-1 text-xs font-black leading-5 text-blue-700">Required size: 1600 x 1000 px.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[trainingImages[0]].map((imageUrl) => {
                  const index = 0;
                  const size = getTrainingImageSize(index);
                  return (
                    <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-white">
                        <TrainingImagePreview imageUrl={imageUrl} index={index} />
                      </div>
                      <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{trainingImageLabels[index]}</p>
                      <p className="mt-1 text-xs font-bold text-teal-700">Required: {size.width} x {size.height} px</p>
                      <input value={imageUrl} onChange={(event) => updateTrainingImage(index, event.target.value)} className="mt-3 h-10 w-full rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500" placeholder={`${trainingImageLabels[index]} URL`} />
                      <label className="mt-2 inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                        {uploadingImageIndex === index ? "Uploading..." : "Upload"}
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingImageIndex !== null} onChange={(event) => uploadTrainingImage(index, event.target.files?.[0])} />
                      </label>
                      {trainingImageErrors[index] ? <p className="mt-2 text-xs font-semibold text-red-600">{trainingImageErrors[index]}</p> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-4 rounded-md border border-cyan-100 bg-cyan-50 px-4 py-3">
                <h3 className="text-sm font-black text-cyan-950">Banner Small Images</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-cyan-800">Used as the four small right-side gallery images below the hero section.</p>
                <p className="mt-1 text-xs font-black leading-5 text-cyan-700">Required size: 1200 x 900 px.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {trainingImages.slice(1, 5).map((imageUrl, offset) => {
                  const index = offset + 1;
                  const size = getTrainingImageSize(index);
                  return (
                    <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-white">
                        <TrainingImagePreview imageUrl={imageUrl} index={index} />
                      </div>
                      <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{trainingImageLabels[index]}</p>
                      <p className="mt-1 text-xs font-bold text-teal-700">Required: {size.width} x {size.height} px</p>
                      <input value={imageUrl} onChange={(event) => updateTrainingImage(index, event.target.value)} className="mt-3 h-10 w-full rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500" placeholder={`${trainingImageLabels[index]} URL`} />
                      <label className="mt-2 inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                        {uploadingImageIndex === index ? "Uploading..." : "Upload"}
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingImageIndex !== null} onChange={(event) => uploadTrainingImage(index, event.target.files?.[0])} />
                      </label>
                      {trainingImageErrors[index] ? <p className="mt-2 text-xs font-semibold text-red-600">{trainingImageErrors[index]}</p> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-4 rounded-md border border-amber-100 bg-amber-50 px-4 py-3">
                <h3 className="text-sm font-black text-amber-950">Practical Training Card Images</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-amber-800">Used only inside the four Practical Training Cards. If empty, the frontend shows an upload placeholder instead of reusing banner images.</p>
                <p className="mt-1 text-xs font-black leading-5 text-amber-700">Required size: 1600 x 900 px.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {trainingImages.slice(5, 9).map((imageUrl, offset) => {
                  const index = offset + 5;
                  const size = getTrainingImageSize(index);
                  return (
                    <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-white">
                        <TrainingImagePreview imageUrl={imageUrl} index={index} />
                      </div>
                      <p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{trainingImageLabels[index]}</p>
                      <p className="mt-1 text-xs font-bold text-teal-700">Required: {size.width} x {size.height} px</p>
                      <input value={imageUrl} onChange={(event) => updateTrainingImage(index, event.target.value)} className="mt-3 h-10 w-full rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-900 outline-none focus:border-teal-500" placeholder={`${trainingImageLabels[index]} URL`} />
                      <label className="mt-2 inline-flex cursor-pointer rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                        {uploadingImageIndex === index ? "Uploading..." : "Upload"}
                        <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingImageIndex !== null} onChange={(event) => uploadTrainingImage(index, event.target.files?.[0])} />
                      </label>
                      {trainingImageErrors[index] ? <p className="mt-2 text-xs font-semibold text-red-600">{trainingImageErrors[index]}</p> : null}
                    </div>
                  );
                })}
              </div>
            </div>
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

