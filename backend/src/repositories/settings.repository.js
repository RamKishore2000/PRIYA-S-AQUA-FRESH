const { pool } = require("../config/database");

const SITE_SETTINGS_KEY = "site_settings";

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

const defaultSiteSettings = {
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
  trainingVideos: [],
};

function parseSettings(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function normalizeList(value, fallback, limit = 5) {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length: limit }, (_, index) => String(source[index] || fallback[index] || "").trim());
}

function normalizeOptionalList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 5);
}

function normalizeSettings(input = {}) {
  return {
    phone: String(input.phone ?? defaultSiteSettings.phone).trim(),
    whatsapp: String(input.whatsapp ?? defaultSiteSettings.whatsapp).trim(),
    email: String(input.email ?? defaultSiteSettings.email).trim(),
    address: String(input.address ?? defaultSiteSettings.address).trim(),
    facebook: String(input.facebook ?? defaultSiteSettings.facebook).trim(),
    instagram: String(input.instagram ?? defaultSiteSettings.instagram).trim(),
    youtube: String(input.youtube ?? defaultSiteSettings.youtube).trim(),
    linkedin: String(input.linkedin ?? defaultSiteSettings.linkedin).trim(),
    x: String(input.x ?? defaultSiteSettings.x).trim(),
    trainingAmount: Math.max(1, Number(input.trainingAmount ?? defaultSiteSettings.trainingAmount) || defaultSiteSettings.trainingAmount),
    orderAdvanceAmount: Math.max(1, Number(input.orderAdvanceAmount ?? defaultSiteSettings.orderAdvanceAmount) || defaultSiteSettings.orderAdvanceAmount),
    trainingImages: normalizeList(input.trainingImages, defaultTrainingImages, 9),
    trainingVideos: normalizeOptionalList(input.trainingVideos),
  };
}

function extractYouTubeId(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }
  return text;
}

async function getSiteSettings() {
  const [rows] = await pool.execute("SELECT setting_value FROM settings WHERE setting_key = ? LIMIT 1", [SITE_SETTINGS_KEY]);
  return normalizeSettings({ ...defaultSiteSettings, ...parseSettings(rows[0]?.setting_value) });
}

async function updateSiteSettings(settings) {
  const normalized = normalizeSettings(settings);
  await pool.execute(
    `INSERT INTO settings (setting_key, setting_value)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [SITE_SETTINGS_KEY, JSON.stringify(normalized)],
  );
  return normalized;
}

module.exports = {
  getSiteSettings,
  updateSiteSettings,
  defaultSiteSettings,
};