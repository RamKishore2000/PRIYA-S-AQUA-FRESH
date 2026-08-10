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
  },
};

module.exports = env;
