const { pool } = require("../config/database");

const SITE_SETTINGS_KEY = "site_settings";

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
  trainingAmount: 4999,
  orderAdvanceAmount: 500,
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
  };
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
