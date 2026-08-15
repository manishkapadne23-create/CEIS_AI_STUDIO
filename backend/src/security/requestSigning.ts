import crypto from "node:crypto";
import type { Request } from "express";

import { config } from "../config/index.js";
import { hashValue } from "./encryptionService.js";

const SIGNATURE_HEADER = "x-sarathi-signature";
const TIMESTAMP_HEADER = "x-sarathi-timestamp";
const CHECKSUM_HEADER = "x-sarathi-checksum";

export const isRequestSigningEnabled = (): boolean =>
  process.env.ESIPF_REQUEST_SIGNING === "true";

export const isResponseSigningEnabled = (): boolean =>
  process.env.ESIPF_RESPONSE_SIGNING === "true";

const buildCanonicalString = (
  req: Request,
  timestamp: string,
  bodyHash: string
): string => `${timestamp}:${req.method.toUpperCase()}:${req.originalUrl}:${bodyHash}`;

export const computeBodyHash = (body: unknown): string =>
  hashValue(typeof body === "string" ? body : JSON.stringify(body ?? ""));

export const signRequest = (
  req: Request,
  body: unknown,
  timestamp = Date.now().toString()
): { signature: string; timestamp: string; checksum: string } => {
  const bodyHash = computeBodyHash(body);
  const canonical = buildCanonicalString(req, timestamp, bodyHash);
  const signature = crypto
    .createHmac("sha256", config.jwt.secret)
    .update(canonical)
    .digest("hex");

  return { signature, timestamp, checksum: bodyHash };
};

export const verifyRequestSignature = (req: Request): boolean => {
  if (!isRequestSigningEnabled()) {
    return true;
  }

  const signature = req.header(SIGNATURE_HEADER);
  const timestamp = req.header(TIMESTAMP_HEADER);
  const checksum = req.header(CHECKSUM_HEADER);

  if (!signature || !timestamp || !checksum) {
    return false;
  }

  const ageMs = Math.abs(Date.now() - Number(timestamp));
  if (Number.isNaN(ageMs) || ageMs > 5 * 60_000) {
    return false;
  }

  const canonical = buildCanonicalString(req, timestamp, checksum);
  const expected = crypto
    .createHmac("sha256", config.jwt.secret)
    .update(canonical)
    .digest("hex");

  if (signature.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
};

export const signResponsePayload = (payload: unknown): string => {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHmac("sha256", config.jwt.secret).update(body).digest("hex");
};

export const getSigningHeaders = (
  req: Request,
  body: unknown
): Record<string, string> => {
  const signed = signRequest(req, body);
  return {
    [SIGNATURE_HEADER]: signed.signature,
    [TIMESTAMP_HEADER]: signed.timestamp,
    [CHECKSUM_HEADER]: signed.checksum,
  };
};
