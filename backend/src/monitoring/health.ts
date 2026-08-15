import axios from "axios";

import { config } from "../config/index.js";
import { prisma } from "../prisma/prisma.js";
import { cache } from "../infrastructure/cache/index.js";

export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export interface ComponentHealth {
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
}

export interface SystemHealth {
  status: HealthStatus;
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
  components: {
    api: ComponentHealth;
    database: ComponentHealth;
    ai: ComponentHealth;
    cache: ComponentHealth;
    storage: ComponentHealth;
  };
}

const checkDatabase = async (): Promise<ComponentHealth> => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Database unreachable",
    };
  }
};

const checkAiProvider = async (): Promise<ComponentHealth> => {
  const start = Date.now();
  try {
    const baseUrl = config.ai.ollamaUrl.replace("/api/generate", "");
    await axios.get(`${baseUrl}/api/tags`, { timeout: 5000 });
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch {
    return {
      status: "degraded",
      message: "AI provider unavailable — fallback responses may be used",
    };
  }
};

const checkCache = async (): Promise<ComponentHealth> => {
  try {
    await cache.set("session", "health-check", "ok", 10);
    const val = await cache.get("session", "health-check");
    return val === "ok"
      ? { status: "healthy" }
      : { status: "degraded", message: "Cache read mismatch" };
  } catch (error) {
    return {
      status: "degraded",
      message: error instanceof Error ? error.message : "Cache error",
    };
  }
};

const aggregateStatus = (
  components: SystemHealth["components"]
): HealthStatus => {
  const statuses = Object.values(components).map((c) => c.status);
  if (statuses.includes("unhealthy")) return "unhealthy";
  if (statuses.includes("degraded")) return "degraded";
  return "healthy";
};

export const getSystemHealth = async (): Promise<SystemHealth> => {
  const [database, ai, cacheHealth] = await Promise.all([
    checkDatabase(),
    checkAiProvider(),
    checkCache(),
  ]);

  const components: SystemHealth["components"] = {
    api: { status: "healthy" },
    database,
    ai,
    cache: cacheHealth,
    storage: { status: "healthy" },
  };

  return {
    status: aggregateStatus(components),
    version: "1.0.0",
    environment: config.env,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    components,
  };
};

export const getLiveness = (): { status: "ok" } => ({ status: "ok" });

export const getReadiness = async (): Promise<{ ready: boolean; reason?: string }> => {
  const db = await checkDatabase();
  if (db.status === "unhealthy") {
    return { ready: false, reason: db.message };
  }
  return { ready: true };
};
