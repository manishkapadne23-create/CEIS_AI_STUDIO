#!/usr/bin/env node
/**
 * Database backup script — dumps PostgreSQL database to ./backups/
 * Usage: npm run db:backup
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const backupDir = path.resolve("./backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outfile = path.join(backupDir, `sarathi_ai_${timestamp}.sql`);

try {
  execSync(`pg_dump "${databaseUrl}" -f "${outfile}"`, { stdio: "inherit" });
  console.log(`Backup created: ${outfile}`);
} catch {
  console.error("Backup failed. Ensure pg_dump is installed and DATABASE_URL is valid.");
  process.exit(1);
}
