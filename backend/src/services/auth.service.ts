import bcrypt from "bcrypt";

import { auditLogger } from "../infrastructure/logger/index.js";
import { prisma } from "../prisma/prisma.js";
import {
  ensureUserLicense,
  logSecurityAudit,
  recordFailedLogin,
} from "../security/index.js";
import { encryptSensitive, generateSecureToken, hashValue } from "../security/encryptionService.js";
import {
  generateAccessToken,
  generateRefreshTokenJwt,
  verifyToken,
} from "../utils/jwt.js";

const REFRESH_TTL_MS = Number(process.env.REFRESH_TOKEN_TTL_MS ?? 30 * 24 * 60 * 60 * 1000);

const storeRefreshToken = async (input: {
  userId: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}) => {
  const tokenHash = hashValue(input.token);
  await prisma.refreshToken.create({
    data: {
      userId: input.userId,
      tokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
    },
  });
  return tokenHash;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  context?: { ipAddress?: string | null; userAgent?: string | null }
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  await ensureUserLicense(user.id);

  await logSecurityAudit({
    category: "AUTH",
    eventType: "auth.register",
    userId: user.id,
    actorId: user.id,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
    metadata: { email: user.email },
  });

  auditLogger.info("auth.register", { userId: user.id, email: user.email });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (
  email: string,
  password: string,
  context?: { ipAddress?: string | null; userAgent?: string | null }
) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    await recordFailedLogin({
      email,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    await recordFailedLogin({
      email,
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
    });
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshTokenJwt({ id: user.id });
  await storeRefreshToken({
    userId: user.id,
    token: refreshToken,
    userAgent: context?.userAgent,
    ipAddress: context?.ipAddress,
  });

  await ensureUserLicense(user.id);

  await logSecurityAudit({
    category: "AUTH",
    eventType: "auth.login",
    userId: user.id,
    actorId: user.id,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
    metadata: { email: user.email },
  });

  auditLogger.info("auth.login", { userId: user.id, email: user.email });

  return {
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshAccessToken = async (
  refreshToken: string,
  context?: { ipAddress?: string | null; userAgent?: string | null }
) => {
  const decoded = verifyToken(refreshToken) as { id: string; type?: string };
  if (decoded.type !== "refresh") {
    throw new Error("Invalid refresh token.");
  }

  const tokenHash = hashValue(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.revokedAt || stored.expiresAt.getTime() < Date.now()) {
    throw new Error("Refresh token expired or revoked.");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    throw new Error("User not found.");
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });

  await logSecurityAudit({
    category: "AUTH",
    eventType: "auth.token_refresh",
    userId: user.id,
    actorId: user.id,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });

  return {
    token: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const logoutUser = async (
  userId: string,
  refreshToken?: string | null,
  context?: { ipAddress?: string | null; userAgent?: string | null }
) => {
  if (refreshToken) {
    const tokenHash = hashValue(refreshToken);
    await prisma.refreshToken.updateMany({
      where: { userId, tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  } else {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  await logSecurityAudit({
    category: "AUTH",
    eventType: "auth.logout",
    userId,
    actorId: userId,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });
};

export const encryptUserSecret = (value: string): string =>
  encryptSensitive(value);

export const createApiKey = (): string => generateSecureToken(32);
