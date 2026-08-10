const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const refreshTokenRepository = require("../repositories/refreshToken.repository");

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      status: user.status,
    },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn },
  );
}

function createRefreshTokenValue() {
  return crypto.randomBytes(48).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getRefreshExpiryDate(rememberMe = false) {
  const days = rememberMe ? env.jwt.rememberRefreshExpiresInDays : env.jwt.refreshExpiresInDays;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

async function issueTokenPair(user, { rememberMe = false } = {}) {
  const accessToken = signAccessToken(user);
  const refreshToken = createRefreshTokenValue();
  const refreshTokenExpiresAt = getRefreshExpiryDate(rememberMe);

  await refreshTokenRepository.createRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshTokenExpiresAt,
  });

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: env.jwt.accessExpiresIn,
    refreshTokenExpiresAt,
  };
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

module.exports = {
  issueTokenPair,
  hashToken,
  verifyAccessToken,
};
