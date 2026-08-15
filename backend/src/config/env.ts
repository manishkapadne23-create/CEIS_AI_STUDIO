export type AppEnvironment = "development" | "testing" | "production";

const parseEnv = (): AppEnvironment => {
  const env = process.env.NODE_ENV?.toLowerCase();
  if (env === "production") return "production";
  if (env === "testing" || env === "test") return "testing";
  return "development";
};

export const appEnvironment: AppEnvironment = parseEnv();

export const isProduction = appEnvironment === "production";
export const isTesting = appEnvironment === "testing";
export const isDevelopment = appEnvironment === "development";

export const requireEnv = (key: string, fallback?: string): string => {
  const raw = process.env[key];
  const value = raw?.trim() ? raw.trim() : fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};
