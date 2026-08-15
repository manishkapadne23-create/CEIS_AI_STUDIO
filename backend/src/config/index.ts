import "./loadEnv.js";

import { appEnvironment, isDevelopment, isProduction, isTesting, requireEnv } from "./env.js";

export interface AppConfig {
  env: typeof appEnvironment;
  port: number;
  host: string;
  apiVersion: string;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  database: {
    url: string;
    poolMin: number;
    poolMax: number;
  };
  redis: {
    enabled: boolean;
    url: string;
  };
  cache: {
    sessionTtlSeconds: number;
    knowledgeTtlSeconds: number;
    aiResponseTtlSeconds: number;
  };
  storage: {
    root: string;
    documentsDir: string;
    imagesDir: string;
    reportsDir: string;
    tempDir: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    aiMaxRequests: number;
  };
  ai: {
    ollamaUrl: string;
    model: string;
    timeoutMs: number;
    retryAttempts: number;
  };
  logging: {
    level: string;
    logDir: string;
  };
  jobs: {
    enabled: boolean;
    maintenanceIntervalMs: number;
  };
}

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

export const config: AppConfig = {
  env: appEnvironment,
  port: Number(process.env.PORT ?? 5000),
  host: process.env.HOST ?? "0.0.0.0",
  apiVersion: "v1",
  cors: {
    origin: corsOrigin.includes(",")
      ? corsOrigin.split(",").map((o) => o.trim())
      : corsOrigin,
    credentials: process.env.CORS_CREDENTIALS === "true",
  },
  jwt: {
    secret: requireEnv(
      "JWT_SECRET",
      isProduction ? undefined : "sarathi_dev_secret_change_in_production"
    ),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },
  database: {
    url: requireEnv("DATABASE_URL"),
    poolMin: Number(process.env.DB_POOL_MIN ?? 2),
    poolMax: Number(process.env.DB_POOL_MAX ?? 10),
  },
  redis: {
    enabled: Boolean(process.env.REDIS_URL),
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
  },
  cache: {
    sessionTtlSeconds: Number(process.env.CACHE_SESSION_TTL ?? 3600),
    knowledgeTtlSeconds: Number(process.env.CACHE_KNOWLEDGE_TTL ?? 1800),
    aiResponseTtlSeconds: Number(process.env.CACHE_AI_TTL ?? 300),
  },
  storage: {
    root: process.env.STORAGE_ROOT ?? "./storage",
    documentsDir: "documents",
    imagesDir: "images",
    reportsDir: "reports",
    tempDir: "temp",
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
    maxRequests: Number(process.env.RATE_LIMIT_MAX ?? (isProduction ? 100 : 500)),
    aiMaxRequests: Number(process.env.RATE_LIMIT_AI_MAX ?? (isProduction ? 20 : 100)),
  },
  ai: {
    ollamaUrl: process.env.OLLAMA_URL ?? "http://localhost:11434/api/generate",
    model: process.env.OLLAMA_MODEL ?? "qwen2.5:0.5b",
    timeoutMs: Number(process.env.AI_TIMEOUT_MS ?? 120_000),
    retryAttempts: Number(process.env.AI_RETRY_ATTEMPTS ?? 2),
  },
  logging: {
    level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
    logDir: process.env.LOG_DIR ?? "./logs",
  },
  jobs: {
    enabled: process.env.JOBS_ENABLED !== "false",
    maintenanceIntervalMs: Number(process.env.MAINTENANCE_INTERVAL_MS ?? 3_600_000),
  },
};

export { appEnvironment, isDevelopment, isProduction, isTesting };
