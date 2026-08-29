const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "priyas_aqua_fresh",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "change-this-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "change-this-refresh-secret",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresInDays: Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS || 7),
    rememberRefreshExpiresInDays: Number(process.env.JWT_REMEMBER_REFRESH_EXPIRES_IN_DAYS || 30),
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  },
  otp: {
    provider: process.env.OTP_PROVIDER || "development",
    authKey: process.env.OTP_AUTH_KEY || "",
    apiKey: process.env.OTP_API_KEY || "",
    apiUrl: process.env.OTP_API_URL || "https://sms.textspeed.in/vb/apikey.php",
    route: process.env.OTP_ROUTE || "",
    senderId: process.env.OTP_SENDER_ID || "",
    templateId: process.env.OTP_TEMPLATE_ID || "",
    templateText: process.env.OTP_TEMPLATE_TEXT || "Your Priya Aqua Fresh login OTP is {OTP}. It is valid for {MINUTES} minutes.",
    expiresInMinutes: Number(process.env.OTP_EXPIRES_IN_MINUTES || 5),
    resendCooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60),
    maxAttempts: Number(process.env.OTP_MAX_ATTEMPTS || 5),
    maxSendsPerWindow: Number(process.env.OTP_MAX_SENDS_PER_WINDOW || 5),
    rateLimitWindowMinutes: Number(process.env.OTP_RATE_LIMIT_WINDOW_MINUTES || 15),
  },
};

module.exports = env;