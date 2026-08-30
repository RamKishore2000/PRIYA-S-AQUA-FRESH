const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type SiteSettings = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  x: string;
  trainingAmount: number;
  orderAdvanceAmount: number;
  trainingImages: string[];
  trainingVideos: string[];
};

export const defaultSiteSettings: SiteSettings = {
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
  trainingImages: [
    "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.34 PM.jpeg",
    "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.35 PM (1).jpeg",
    "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.35 PM.jpeg",
    "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.36 PM.jpeg",
    "/images/ro training institue/WhatsApp Image 2026-08-26 at 6.57.37 PM.jpeg",
  ],
  trainingVideos: [],
};

export async function fetchSiteSettings() {
  const response = await fetch(`${API_BASE_URL}/api/settings/site`, { cache: "no-store" });
  const result = await response.json() as { success: boolean; data?: { settings?: Partial<SiteSettings> } };
  if (!response.ok || !result.success) return defaultSiteSettings;
  return { ...defaultSiteSettings, ...(result.data?.settings || {}) };
}

export function getWhatsAppHref(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits.startsWith("91") ? digits : `91${digits}`}`;
}
