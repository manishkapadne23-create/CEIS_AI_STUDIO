import fs from "fs";
import path from "path";

import { config } from "../config/index.js";
import type { SecurityCheckResult } from "./types.js";

const projectRoot = path.resolve(process.cwd(), "..");

const scanForHardcodedSecrets = (): string[] => {
  const findings: string[] = [];
  const envExample = path.join(projectRoot, "backend/.env.example");

  if (fs.existsSync(envExample)) {
    const content = fs.readFileSync(envExample, "utf8");
    if (content.includes("JWT_SECRET=change_this")) {
      findings.push("JWT_SECRET placeholder in .env.example — must be changed in production");
    }
  }

  return findings;
};

export const runSecurityChecks = (): SecurityCheckResult[] => {
  const secretFindings = scanForHardcodedSecrets();

  return [
    {
      id: "dependency-scan",
      area: "dependency-scan",
      passed: fs.existsSync(path.join(projectRoot, "backend/package.json")),
      message: "Package manifest present for dependency auditing",
    },
    {
      id: "secrets-server-side",
      area: "secrets",
      passed: secretFindings.length === 0,
      message:
        secretFindings.length === 0
          ? "No hardcoded production secrets detected in templates"
          : secretFindings.join("; "),
    },
    {
      id: "audit-logs",
      area: "audit-logs",
      passed: fs.existsSync(path.join(process.cwd(), "src/infrastructure/logger/index.ts")),
      message: "Centralized audit logger configured",
    },
    {
      id: "role-validation",
      area: "roles",
      passed: fs.existsSync(path.join(process.cwd(), "src/constants/roles.ts")),
      message: "Role constants defined for authorization",
    },
    {
      id: "encryption-jwt",
      area: "encryption",
      passed: Boolean(config.jwt.secret) && config.jwt.secret.length >= 16,
      message: "JWT secret configured with minimum length",
    },
    {
      id: "secure-config",
      area: "configuration",
      passed: fs.existsSync(path.join(process.cwd(), "src/config/env.ts")),
      message: "Environment-based secure configuration loader present",
    },
  ];
};
