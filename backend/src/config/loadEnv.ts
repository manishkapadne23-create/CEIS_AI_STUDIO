import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

/** Resolve backend package root (…/backend), regardless of process.cwd(). */
export const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

export const envPath = path.join(backendRoot, ".env");

export const maskDatabaseUrl = (url: string): string =>
  url.replace(/:([^:@/]+)@/, ":***@");

const stripQuotes = (value: string): string =>
  value.trim().replace(/^["']|["']$/g, "");

let envLoaded = false;

/**
 * Load backend/.env before any module reads process.env or Prisma connects.
 * Idempotent — safe to call from preload, server bootstrap, and connectDatabase().
 * override: true ensures backend/.env wins over tsx/dotenv preloads or shell stubs.
 */
export const ensureEnvLoaded = (): void => {
  if (envLoaded) {
    return;
  }

  const result = dotenv.config({ path: envPath, override: true });

  if (result.error) {
    console.warn(`[env] Could not read ${envPath}: ${result.error.message}`);
  } else if (result.parsed) {
    console.log(`[env] Loaded ${envPath}`);
  }

  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = stripQuotes(process.env.DATABASE_URL);
    console.log(
      `[env] process.env.DATABASE_URL=${maskDatabaseUrl(process.env.DATABASE_URL)}`
    );
  } else {
    console.warn(
      `[env] process.env.DATABASE_URL is not set (cwd=${process.cwd()}, env file=${envPath})`
    );
  }

  envLoaded = true;
};

// Side-effect for direct imports and tsx --import preload.
ensureEnvLoaded();
