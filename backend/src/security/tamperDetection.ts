import { isProduction } from "../config/env.js";

const BLOCKED_DEBUG_HEADERS = ["x-debug", "x-bypass-auth", "x-admin-override"];

export const verifyEnvironment = (): boolean => {
  if (!isProduction) {
    return true;
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes("change_me")) {
    return false;
  }

  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  return true;
};

export const detectTamperHeaders = (headers: Record<string, unknown>): boolean =>
  BLOCKED_DEBUG_HEADERS.some((header) => Boolean(headers[header]));

export const detectDebugMode = (): boolean =>
  process.env.ESIPF_DEBUG_ALLOWED === "true" || process.env.NODE_ENV !== "production";
