import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import { hashValue } from "./encryptionService.js";
import { encryptSensitive } from "./encryptionService.js";

const execFileAsync = promisify(execFile);

const BACKUP_DIR = process.env.BACKUP_DIR ?? "./backups";
const ENCRYPTION_ENABLED = process.env.ESIPF_ENCRYPTED_BACKUP !== "false";

export const createDatabaseBackup = async (): Promise<{
  filePath: string;
  encrypted: boolean;
  checksum: string;
}> => {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const rawPath = path.join(BACKUP_DIR, `sarathi-db-${timestamp}.sql`);

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for backup.");
  }

  await execFileAsync("pg_dump", [databaseUrl, "-f", rawPath], {
    env: process.env,
  });

  const raw = await fs.readFile(rawPath, "utf8");
  const checksum = hashValue(raw);

  if (!ENCRYPTION_ENABLED) {
    return { filePath: rawPath, encrypted: false, checksum };
  }

  const encryptedPath = `${rawPath}.enc`;
  const encryptedPayload = encryptSensitive(raw);
  await fs.writeFile(encryptedPath, encryptedPayload, "utf8");
  await fs.unlink(rawPath);

  return {
    filePath: encryptedPath,
    encrypted: true,
    checksum: hashValue(encryptedPayload),
  };
};

export const validateBackupRecovery = async (filePath: string): Promise<boolean> => {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile() && stats.size > 0;
  } catch {
    return false;
  }
};

export const getBackupPolicy = () => ({
  automatic: process.env.ESIPF_AUTO_BACKUP === "true",
  encrypted: ENCRYPTION_ENABLED,
  directory: BACKUP_DIR,
  intervalMs: Number(process.env.BACKUP_INTERVAL_MS ?? 86_400_000),
});
