const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const env = require("../config/env");
const { toSafeUser } = require("../models/user.model");
const otpRepository = require("../repositories/otp.repository");
const userRepository = require("../repositories/user.repository");
const { ApiError } = require("../utils/apiError");
const tokenService = require("./token.service");

const LOGIN_PURPOSE = "LOGIN";
const DEFAULT_OTP_TEMPLATE = "Your Priya's Aqua Fresh login OTP is {OTP}. This OTP is valid for 5 minutes. Please do not share it with anyone.";

function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashOtp(mobile, otp) {
  return crypto.createHash("sha256").update(`${mobile}:${otp}:${env.jwt.accessSecret}`).digest("hex");
}

function secondsUntil(dateValue) {
  return Math.max(0, Math.ceil((new Date(dateValue).getTime() - Date.now()) / 1000));
}

function addMinutes(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

function secondsSince(dateValue) {
  return Math.floor((Date.now() - new Date(dateValue).getTime()) / 1000);
}

function buildOtpMessage(otp) {
  const configuredTemplate = String(env.otp.templateText || "").trim();
  const hasPlaceholder = configuredTemplate.includes("{OTP}") || configuredTemplate.includes("{#var#}") || configuredTemplate.includes("{#num#}");
  const template = hasPlaceholder ? configuredTemplate : DEFAULT_OTP_TEMPLATE;

  return template
    .replaceAll("{OTP}", otp)
    .replaceAll("{#var#}", otp)
    .replaceAll("{#num#}", otp)
    .replaceAll("{MINUTES}", String(env.otp.expiresInMinutes));
}

function isTextspeedSuccess(payload) {
  if (!payload || typeof payload !== "object") return false;
  const status = String(payload.status || "").toLowerCase();
  const code = String(payload.code || payload.statuscode || "").toLowerCase();
  const message = String(payload.message || "").toLowerCase();
  return status === "success" || status === "true" || code === "011" || message.includes("submitted successfully");
}

async function sendTextspeedOtp(mobile, otp) {
  const apiKey = env.otp.apiKey || env.otp.authKey;
  if (!env.otp.apiUrl || !apiKey || !env.otp.senderId || !env.otp.templateId) {
    throw new ApiError(503, "OTP provider is not configured.");
  }

  const params = {
    apikey: apiKey,
    senderid: env.otp.senderId,
    templateid: env.otp.templateId,
    number: mobile,
    message: buildOtpMessage(otp),
  };

  if (env.otp.route) params.route = env.otp.route;

  const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  let response;
  try {
    response = await fetch(`${env.otp.apiUrl}?${query}`, {
      method: "GET",
      headers: { Accept: "application/json,text/plain,*/*" },
    });
  } catch {
    throw new ApiError(502, "Unable to connect to OTP provider.");
  }

  const rawBody = await response.text();
  let payload = null;
  try {
    payload = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    payload = { status: response.ok ? "success" : "failed", message: rawBody };
  }

  if (!response.ok || !isTextspeedSuccess(payload)) {
    const providerMessage = payload?.message || payload?.description || rawBody || "OTP provider failed.";
    console.error("[OTP login] Textspeed failed", { mobile, status: response.status, body: rawBody });
    throw new ApiError(502, `Unable to send OTP. ${providerMessage}`.slice(0, 180));
  }

  return { provider: "textspeed", providerResponse: payload };
}

async function sendOtpToProvider(mobile, otp) {
  const provider = String(env.otp.provider || "").toLowerCase();
  if (provider === "textspeed" || provider === "magic_text" || provider === "magic-text") {
    return sendTextspeedOtp(mobile, otp);
  }

  throw new ApiError(503, "Live OTP provider is not configured.");
}

async function getOrCreateOtpUser(mobile) {
  const existingUser = await userRepository.findByMobile(mobile);
  if (existingUser) return existingUser;

  const passwordHash = await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 12);
  return userRepository.createCustomerUser({
    fullName: "Customer",
    mobile,
    email: `${mobile}@customers.priyasaquafresh.local`,
    passwordHash,
  });
}

async function issueLoginOtp(input, { resend = false } = {}) {
  const mobile = input.mobile.trim();
  const user = await getOrCreateOtpUser(mobile);
  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "Your account is not active.");
  }

  const recentSends = await otpRepository.countRecentSends(mobile, LOGIN_PURPOSE, env.otp.rateLimitWindowMinutes);
  if (recentSends >= env.otp.maxSendsPerWindow) {
    throw new ApiError(429, `Too many OTP requests. Please try again after ${env.otp.rateLimitWindowMinutes} minutes.`);
  }

  const latestOtp = await otpRepository.findLatestActive(mobile, LOGIN_PURPOSE);
  if (latestOtp) {
    const elapsed = secondsSince(latestOtp.last_sent_at);
    if (elapsed < env.otp.resendCooldownSeconds) {
      throw new ApiError(429, `Please wait ${env.otp.resendCooldownSeconds - elapsed} seconds before requesting another OTP.`);
    }
  }

  const otp = generateOtp();
  const otpHash = hashOtp(mobile, otp);
  const expiresAt = addMinutes(env.otp.expiresInMinutes);
  const resendCount = resend && latestOtp ? Number(latestOtp.resend_count || 0) + 1 : 0;

  await otpRepository.expireActiveOtps(mobile, LOGIN_PURPOSE);
  await otpRepository.createOtp({ userId: user.id, mobile, purpose: LOGIN_PURPOSE, otpHash, expiresAt, resendCount });
  await sendOtpToProvider(mobile, otp);

  return {
    mobile,
    expiresInSeconds: env.otp.expiresInMinutes * 60,
    resendAfterSeconds: env.otp.resendCooldownSeconds,
  };
}

async function verifyLoginOtp(input) {
  const mobile = input.mobile.trim();
  const otp = input.otp.trim();
  const latestOtp = await otpRepository.findLatestActive(mobile, LOGIN_PURPOSE);
  if (!latestOtp) {
    throw new ApiError(401, "Invalid or expired OTP.");
  }

  if (Number(latestOtp.attempts || 0) >= env.otp.maxAttempts) {
    throw new ApiError(429, "Maximum OTP attempts reached. Please request a new OTP.");
  }

  const expectedHash = hashOtp(mobile, otp);
  if (expectedHash !== latestOtp.otp_hash) {
    await otpRepository.incrementAttempts(latestOtp.id);
    throw new ApiError(401, "Invalid OTP.");
  }

  const user = await userRepository.findById(latestOtp.user_id);
  if (!user || user.status !== "ACTIVE") {
    throw new ApiError(401, "Invalid OTP login request.");
  }

  await otpRepository.markVerified(latestOtp.id);
  const safeUser = toSafeUser(user);
  const tokens = await tokenService.issueTokenPair(safeUser, { rememberMe: Boolean(input.rememberMe) });
  return { user: safeUser, tokens };
}

module.exports = {
  issueLoginOtp,
  verifyLoginOtp,
  secondsUntil,
};