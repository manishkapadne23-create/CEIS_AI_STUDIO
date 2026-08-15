import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "config");

const readJson = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(configDir, fileName), "utf-8")) as T;

export const loadLicenseTiers = () =>
  readJson<{
    tiers: Array<{ id: string; label: string; features: string[] }>;
    offlineLicense: { enabled: boolean; futureReady: boolean };
  }>("licenseTiers.json");

export const loadAuditEvents = () =>
  readJson<{
    events: Array<{ type: string; category: string; label: string }>;
  }>("auditEvents.json");

export const loadFeatureFlags = () =>
  readJson<{
    features: Record<string, { label: string; minTier: string }>;
  }>("featureFlags.json");

export const loadComplianceFrameworks = () =>
  readJson<{
    frameworks: Array<{ id: string; label: string; status: string }>;
    protectedAssets: string[];
  }>("complianceFrameworks.json");

export const getEsipfPublicConfig = () => ({
  engine: "Enterprise Security, IP Protection & Anti-Reverse Engineering Framework",
  version: "1.0.0",
  licenseTiers: loadLicenseTiers().tiers,
  auditEvents: loadAuditEvents().events,
  featureFlags: loadFeatureFlags().features,
  complianceFrameworks: loadComplianceFrameworks().frameworks,
  protectedAssets: loadComplianceFrameworks().protectedAssets,
  capabilities: {
    encryption: true,
    refreshTokens: true,
    requestSigning: process.env.ESIPF_REQUEST_SIGNING === "true",
    responseSigning: process.env.ESIPF_RESPONSE_SIGNING === "true",
    watermarking: true,
    licenseValidation: true,
    auditLogging: true,
    securityMonitoring: true,
    encryptedBackup: process.env.ESIPF_ENCRYPTED_BACKUP !== "false",
  },
});
