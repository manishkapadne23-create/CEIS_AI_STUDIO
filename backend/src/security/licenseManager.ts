import type { LicenseTier } from "@prisma/client";

import { prisma } from "../prisma/prisma.js";
import { loadFeatureFlags, loadLicenseTiers } from "./loadSecurityConfig.js";
import type { LicenseTierId, LicenseValidationResult } from "./types.js";

const TIER_ORDER: LicenseTierId[] = [
  "FREE",
  "STANDARD",
  "PRO",
  "PRO_PLUS",
  "INSTITUTION",
  "ENTERPRISE",
];

const tierRank = (tier: LicenseTierId): number => TIER_ORDER.indexOf(tier);

export const getTierFeatures = (tier: LicenseTierId): string[] => {
  const entry = loadLicenseTiers().tiers.find((item) => item.id === tier);
  return entry?.features ?? ["ai-chat-basic"];
};

export const ensureUserLicense = async (userId: string, tenantId?: string | null) => {
  const existing = await prisma.userLicense.findUnique({ where: { userId } });
  if (existing) {
    return existing;
  }

  return prisma.userLicense.create({
    data: {
      userId,
      tenantId: tenantId ?? null,
      tier: "FREE",
      features: getTierFeatures("FREE"),
    },
  });
};

export const validateUserLicense = async (
  userId: string
): Promise<LicenseValidationResult> => {
  const license = await ensureUserLicense(userId);
  const tier = license.tier as LicenseTierId;
  const features =
    Array.isArray(license.features) && license.features.length > 0
      ? (license.features as string[])
      : getTierFeatures(tier);

  const valid =
    !license.validUntil || license.validUntil.getTime() > Date.now();

  return {
    valid,
    tier,
    features,
    expiresAt: license.validUntil?.toISOString() ?? null,
  };
};

export const userHasFeature = async (
  userId: string,
  featureId: string
): Promise<boolean> => {
  const license = await validateUserLicense(userId);
  if (!license.valid) {
    return false;
  }

  if (license.features.includes("*")) {
    return true;
  }

  if (license.features.includes(featureId)) {
    return true;
  }

  const flag = loadFeatureFlags().features[featureId];
  if (!flag) {
    return false;
  }

  return tierRank(license.tier) >= tierRank(flag.minTier as LicenseTierId);
};

export const updateUserLicense = async (
  userId: string,
  input: {
    tier?: LicenseTier;
    tenantId?: string | null;
    validUntil?: Date | null;
    metadata?: Record<string, unknown>;
  }
) => {
  const tier = (input.tier ?? "FREE") as LicenseTierId;
  await ensureUserLicense(userId, input.tenantId);

  return prisma.userLicense.update({
    where: { userId },
    data: {
      ...(input.tier !== undefined ? { tier: input.tier } : {}),
      ...(input.tenantId !== undefined ? { tenantId: input.tenantId } : {}),
      ...(input.validUntil !== undefined ? { validUntil: input.validUntil } : {}),
      ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
      features: getTierFeatures(tier),
    },
  });
};

export const validateLicenseKey = async (
  userId: string,
  licenseKey?: string | null
): Promise<LicenseValidationResult> => {
  if (!licenseKey) {
    return validateUserLicense(userId);
  }

  const license = await prisma.userLicense.findUnique({ where: { userId } });
  if (license?.offlineKey && license.offlineKey === licenseKey) {
    return validateUserLicense(userId);
  }

  return { valid: false, tier: "FREE", features: getTierFeatures("FREE"), expiresAt: null };
};
