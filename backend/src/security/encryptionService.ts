import crypto from "node:crypto";

import { config } from "../config/index.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;

const deriveKey = (override?: string): Buffer => {
  const source =
    override ??
    process.env.ENCRYPTION_KEY ??
    process.env.JWT_SECRET ??
    config.jwt.secret;
  return crypto.createHash("sha256").update(source).digest().subarray(0, KEY_LENGTH);
};

export const hashValue = (value: string): string =>
  crypto.createHash("sha256").update(value).digest("hex");

export const encryptSensitive = (plaintext: string, keyOverride?: string): string => {
  const key = deriveKey(keyOverride);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `esipf:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
};

export const decryptSensitive = (payload: string, keyOverride?: string): string => {
  if (!payload.startsWith("esipf:")) {
    return payload;
  }

  const [, ivB64, tagB64, dataB64] = payload.split(":");
  const key = deriveKey(keyOverride);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivB64, "base64")
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

export const encryptJson = (value: unknown, keyOverride?: string): string =>
  encryptSensitive(JSON.stringify(value), keyOverride);

export const decryptJson = <T>(payload: string, keyOverride?: string): T =>
  JSON.parse(decryptSensitive(payload, keyOverride)) as T;

export const generateSecureToken = (bytes = 48): string =>
  crypto.randomBytes(bytes).toString("base64url");
