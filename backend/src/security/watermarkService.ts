import crypto from "node:crypto";

import { config } from "../config/index.js";
import { hashValue } from "./encryptionService.js";
import type { DigitalWatermark } from "./types.js";

const WATERMARK_VERSION = "1.0.0";

const signPayload = (payload: Record<string, unknown>): string =>
  crypto
    .createHmac("sha256", config.jwt.secret)
    .update(JSON.stringify(payload))
    .digest("hex");

export const buildDigitalWatermark = (input: {
  userId?: string | null;
  tenantId?: string | null;
  workspaceId?: string | null;
  contentType: string;
}): DigitalWatermark => {
  const documentId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const base = {
    documentId,
    timestamp,
    version: WATERMARK_VERSION,
    workspaceId: input.workspaceId ?? null,
    userId: input.userId ?? null,
    tenantId: input.tenantId ?? null,
    contentType: input.contentType,
  };

  const integrityHash = hashValue(JSON.stringify(base));
  const digitalSignature = signPayload({ ...base, integrityHash });

  return {
    ...base,
    integrityHash,
    digitalSignature,
    invisibleMetadata: {
      engine: "ESIPF",
      platform: "sarathi-ai",
      watermarkVersion: WATERMARK_VERSION,
    },
  };
};

export const attachWatermark = <T extends Record<string, unknown>>(
  payload: T,
  watermark: DigitalWatermark
): T & { watermark: DigitalWatermark } => ({
  ...payload,
  watermark,
});

export const verifyWatermark = (watermark: DigitalWatermark): boolean => {
  const { digitalSignature, invisibleMetadata: _meta, ...base } = watermark;
  const integrityHash = hashValue(JSON.stringify(base));
  if (integrityHash !== watermark.integrityHash) {
    return false;
  }
  return digitalSignature === signPayload({ ...base, integrityHash });
};
