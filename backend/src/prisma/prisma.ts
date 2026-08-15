import { PrismaClient } from "@prisma/client";

import { isDevelopment } from "../config/env.js";
import { ensureEnvLoaded, maskDatabaseUrl } from "../config/loadEnv.js";
import { appLogger } from "../infrastructure/logger/index.js";

/** Prefer IPv4 on Windows where localhost may resolve to ::1 while Postgres listens on 127.0.0.1. */
const normalizeDatabaseUrl = (url: string): string =>
  url
    .replace(/@localhost:/gi, "@127.0.0.1:")
    .replace(/\/\/localhost:/gi, "//127.0.0.1:");

const stripQuotes = (value: string): string =>
  value.trim().replace(/^["']|["']$/g, "");

const readDatabaseUrl = (): string => {
  ensureEnvLoaded();
  const raw = process.env.DATABASE_URL;
  if (!raw?.trim()) {
    throw new Error(
      "DATABASE_URL is not set. Ensure backend/.env exists and loadEnv runs before Prisma connects."
    );
  }
  return stripQuotes(raw);
};

const buildDatabaseUrl = (): string => {
  const url = normalizeDatabaseUrl(readDatabaseUrl());
  if (url.includes("connection_limit")) {
    return url;
  }
  const poolMax = Number(process.env.DB_POOL_MAX ?? 10);
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}connection_limit=${poolMax}&pool_timeout=30&connect_timeout=10`;
};

let prismaClient: PrismaClient | null = null;

const getPrismaClient = (): PrismaClient => {
  if (!prismaClient) {
    throw new Error(
      "Prisma client is not initialized. connectDatabase() must run before database access."
    );
  }
  return prismaClient;
};

/** Lazy proxy — no TCP connection until connectDatabase() runs. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, receiver);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

const resetPrismaClient = async (): Promise<void> => {
  if (!prismaClient) {
    return;
  }
  try {
    await prismaClient.$disconnect();
  } catch {
    // ignore disconnect errors during reset
  }
  prismaClient = null;
};

export const connectDatabase = async (): Promise<void> => {
  ensureEnvLoaded();

  const url = buildDatabaseUrl();
  process.env.DATABASE_URL = url;

  console.log(`[prisma] DATABASE_URL=${maskDatabaseUrl(url)}`);

  await resetPrismaClient();

  prismaClient = new PrismaClient({
    datasources: {
      db: { url },
    },
    log: isDevelopment ? ["warn", "error"] : ["error"],
  });

  try {
    await prismaClient.$connect();
  } catch (error) {
    await resetPrismaClient();
    throw error;
  }

  appLogger.info("Database connected", {
    poolMax: Number(process.env.DB_POOL_MAX ?? 10),
  });
};

export const disconnectDatabase = async (): Promise<void> => {
  await resetPrismaClient();
  appLogger.info("Database disconnected");
};
