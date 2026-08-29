const fs = require("fs");
const path = require("path");
const sharp = require("../node_modules/sharp");

const root = path.resolve(__dirname, "..");
const resRoot = path.join(root, "android", "app", "src", "main", "res");
const logoSource = path.join(root, "public", "images", "brand", "priyas-aqua-fresh-logo-cropped.png");

async function ensureDir(filePath) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
}

async function logoBuffer(width, height = null) {
  return sharp(logoSource)
    .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}


async function splashLogoBuffer(width, height = null) {
  const image = sharp(logoSource)
    .trim({ background: "#ffffff", threshold: 16 })
    .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 238 && g > 238 && b > 238) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, { raw: info }).png().toBuffer();
}
async function makeIcon(dir, size) {
  const outDir = path.join(resRoot, dir);
  await fs.promises.mkdir(outDir, { recursive: true });
  const logo = await logoBuffer(Math.round(size * 0.68), Math.round(size * 0.68));
  const base = sharp({ create: { width: size, height: size, channels: 4, background: "#FFFFFF" } })
    .composite([{ input: logo, gravity: "center" }])
    .png();

  await Promise.all([
    base.clone().toFile(path.join(outDir, "ic_launcher.png")),
    base.clone().toFile(path.join(outDir, "ic_launcher_foreground.png")),
    base.clone().toFile(path.join(outDir, "ic_launcher_round.png")),
  ]);
}

async function makeSplashLogo() {
  const size = 432;
  const logo = await splashLogoBuffer(205, 118);
  const svg = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g" cx="50%" cy="46%" r="58%"><stop stop-color="#e9fbff" offset="0"/><stop stop-color="#dcf8ff" offset="0.72"/><stop stop-color="#cef2fb" offset="1"/></radialGradient></defs><rect width="100%" height="100%" fill="none"/><circle cx="${size / 2}" cy="${size / 2}" r="102" fill="url(#g)" stroke="#b7edf8" stroke-width="5"/><circle cx="${size / 2}" cy="${size / 2}" r="126" fill="none" stroke="#83dff1" stroke-width="5" opacity="0.9"/></svg>`);
  const output = path.join(resRoot, "drawable", "splash_logo.png");
  await ensureDir(output);
  await sharp(svg).composite([{ input: logo, gravity: "center" }]).png().toFile(output);
}

async function makeSplash(file) {
  const output = path.join(resRoot, file);
  const meta = await sharp(output).metadata().catch(() => ({ width: 1080, height: 1920 }));
  const width = meta.width || 1080;
  const height = meta.height || 1920;
  const markSize = Math.round(Math.min(width, height) * (width > height ? 0.34 : 0.42));
  const logoWidth = Math.round(markSize * 0.58);
  const logoHeight = Math.round(markSize * 0.42);
  const logo = await splashLogoBuffer(logoWidth, logoHeight);
  const centerY = Math.round(height * 0.46);
  const textY = centerY + Math.round(markSize * 0.68);
  const svg = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="bg" cx="50%" cy="45%" r="62%"><stop stop-color="#e9fbff" offset="0"/><stop stop-color="#f8f3ec" offset="0.58"/><stop stop-color="#fff9f1" offset="1"/></radialGradient><radialGradient id="mark" cx="50%" cy="45%" r="62%"><stop stop-color="#e9fbff" offset="0"/><stop stop-color="#dcf8ff" offset="0.72"/><stop stop-color="#cef2fb" offset="1"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#bg)"/><circle cx="${width / 2}" cy="${centerY}" r="${Math.round(markSize * 0.5)}" fill="url(#mark)" stroke="#b7edf8" stroke-width="${Math.max(3, Math.round(width * 0.004))}"/><circle cx="${width / 2}" cy="${centerY}" r="${Math.round(markSize * 0.6)}" fill="none" stroke="#83dff1" stroke-width="${Math.max(4, Math.round(width * 0.005))}" opacity="0.72"/><text x="50%" y="${textY}" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.034)}" font-weight="700" letter-spacing="${Math.round(width * 0.007)}" fill="#526161">PURE WATER, TRUSTED SERVICE</text></svg>`);
  await ensureDir(output);
  await sharp(svg)
    .composite([{ input: logo, left: Math.round((width - logoWidth) / 2), top: Math.round(centerY - logoHeight / 2) }])
    .png()
    .toFile(output);
}

(async () => {
  await Promise.all([
    makeIcon("mipmap-mdpi", 48),
    makeIcon("mipmap-hdpi", 72),
    makeIcon("mipmap-xhdpi", 96),
    makeIcon("mipmap-xxhdpi", 144),
    makeIcon("mipmap-xxxhdpi", 192),
    makeSplashLogo(),
  ]);

  const splashFiles = [
    "drawable/splash.png",
    "drawable-port-mdpi/splash.png",
    "drawable-port-hdpi/splash.png",
    "drawable-port-xhdpi/splash.png",
    "drawable-port-xxhdpi/splash.png",
    "drawable-port-xxxhdpi/splash.png",
    "drawable-land-mdpi/splash.png",
    "drawable-land-hdpi/splash.png",
    "drawable-land-xhdpi/splash.png",
    "drawable-land-xxhdpi/splash.png",
    "drawable-land-xxxhdpi/splash.png",
  ];
  for (const file of splashFiles) await makeSplash(file);

  const colorPath = path.join(resRoot, "values", "ic_launcher_background.xml");
  await fs.promises.writeFile(colorPath, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#FFFFFF</color>\n</resources>\n`);
})();