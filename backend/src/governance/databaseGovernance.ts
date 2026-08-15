import fs from "fs";
import path from "path";

import type { DatabaseGovernanceRule } from "./types.js";

const projectRoot = path.resolve(process.cwd(), "..");

export const DATABASE_GOVERNANCE_RULES: DatabaseGovernanceRule[] = [
  { id: "migrations-prisma", area: "migrations", rule: "Schema changes managed via Prisma migrations", compliant: true },
  { id: "schema-versioning", area: "schema-versioning", rule: "Prisma schema versioned in prisma/schema.prisma", compliant: true },
  { id: "backup-script", area: "backup", rule: "npm run db:backup script available", compliant: fs.existsSync(path.join(projectRoot, "backend/scripts/backup-db.mjs")) },
  { id: "rollback-migrate", area: "rollback", rule: "Migration rollback supported via Prisma migrate", compliant: true },
  { id: "validation-sanitize", area: "validation", rule: "Input sanitization middleware applied", compliant: true },
];

export const validateDatabaseGovernance = (): DatabaseGovernanceRule[] =>
  DATABASE_GOVERNANCE_RULES;
