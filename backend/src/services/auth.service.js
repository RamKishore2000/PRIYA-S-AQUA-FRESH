const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const refreshTokenRepository = require("../repositories/refreshToken.repository");
const { toSafeUser } = require("../models/user.model");
const tokenService = require("./token.service");
const { ApiError } = require("../utils/apiError");

async function registerCustomer(input) {
  const fullName = input.fullName.trim().replace(/\s+/g, " ");
  const mobile = input.mobile.trim();
  const email = input.email.trim().toLowerCase();

  const existingMobile = await userRepository.findByMobile(mobile);
  if (existingMobile) {
    throw new ApiError(409, "Mobile number is already registered.", {
      mobile: "Mobile number is already registered.",
    });
  }

  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) {
    throw new ApiError(409, "Email is already registered.", {
      email: "Email is already registered.",
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const createdUser = await userRepository.createCustomerUser({
    fullName,
    mobile,
    email,
    passwordHash,
  });

  return toSafeUser(createdUser);
}

async function login(input) {
  const identifier = input.email.trim().toLowerCase();
  const user = /^[6-9]\d{9}$/.test(identifier)
    ? await userRepository.findByMobile(identifier)
    : await userRepository.findByEmail(identifier);
  if (!user) {
    throw new ApiError(401, "Invalid email/mobile or password.");
  }
  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "Your account is not active.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email/mobile or password.");
  }

  const safeUser = toSafeUser(user);
  const tokens = await tokenService.issueTokenPair(safeUser, { rememberMe: Boolean(input.rememberMe) });
  return { user: safeUser, tokens };
}

async function refresh(input) {
  const tokenHash = tokenService.hashToken(input.refreshToken);
  const storedToken = await refreshTokenRepository.findActiveByHash(tokenHash);
  if (!storedToken) {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  const user = await userRepository.findById(storedToken.user_id);
  if (!user || user.status !== "ACTIVE") {
    throw new ApiError(401, "Invalid refresh token.");
  }

  await refreshTokenRepository.revokeByHash(tokenHash);
  const safeUser = toSafeUser(user);
  const tokens = await tokenService.issueTokenPair(safeUser);
  return { user: safeUser, tokens };
}

async function logout(input) {
  if (input.refreshToken) {
    await refreshTokenRepository.revokeByHash(tokenService.hashToken(input.refreshToken));
  }
}

module.exports = {
  registerCustomer,
  login,
  refresh,
  logout,
};
