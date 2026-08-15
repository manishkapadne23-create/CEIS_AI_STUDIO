import fs from "fs";
import path from "path";

import { config } from "../../config/index.js";

export type LogCategory = "app" | "ai" | "api" | "error" | "audit";

export interface LogEntry {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  category: LogCategory;
  message: string;
  meta?: Record<string, unknown>;
}

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const;
const minLevel = LEVELS[config.logging.level as keyof typeof LEVELS] ?? LEVELS.info;

const ensureLogDir = (): void => {
  if (!fs.existsSync(config.logging.logDir)) {
    fs.mkdirSync(config.logging.logDir, { recursive: true });
  }
};

const writeToFile = (category: LogCategory, line: string): void => {
  try {
    ensureLogDir();
    const filePath = path.join(config.logging.logDir, `${category}.log`);
    fs.appendFileSync(filePath, `${line}\n`, "utf8");
  } catch {
    // Non-fatal — console fallback only
  }
};

const formatEntry = (entry: LogEntry): string => JSON.stringify(entry);

const log = (
  level: LogEntry["level"],
  category: LogCategory,
  message: string,
  meta?: Record<string, unknown>
): void => {
  if (LEVELS[level] < minLevel) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    ...(meta ? { meta } : {}),
  };

  const line = formatEntry(entry);
  const prefix = `[${entry.timestamp}] [${category.toUpperCase()}]`;

  if (level === "error") console.error(prefix, message, meta ?? "");
  else if (level === "warn") console.warn(prefix, message, meta ?? "");
  else console.log(prefix, message, meta ? JSON.stringify(meta) : "");

  writeToFile(category, line);
  if (category !== "error" && level === "error") {
    writeToFile("error", line);
  }
};

export const appLogger = {
  debug: (message: string, meta?: Record<string, unknown>) => log("debug", "app", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log("info", "app", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", "app", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", "app", message, meta),
};

export const aiLogger = {
  info: (message: string, meta?: Record<string, unknown>) => log("info", "ai", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", "ai", message, meta),
};

export const apiLogger = {
  info: (message: string, meta?: Record<string, unknown>) => log("info", "api", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", "api", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", "api", message, meta),
};

export const errorLogger = {
  error: (message: string, meta?: Record<string, unknown>) => log("error", "error", message, meta),
};

export const auditLogger = {
  info: (action: string, meta?: Record<string, unknown>) =>
    log("info", "audit", action, meta),
};
