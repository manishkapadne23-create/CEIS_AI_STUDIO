import fs from "fs";
import path from "path";

import { getArchitectureSummary, listArchitectureModules } from "./architectureRegistry.js";
import { validateApiGovernance } from "./apiGovernance.js";
import { validateCodingStandards } from "./codingStandards.js";
import { analyzeDependencies } from "./dependencyManager.js";
import { validateDatabaseGovernance } from "./databaseGovernance.js";
import { getCurrentRelease } from "./releaseManager.js";

const projectRoot = path.resolve(process.cwd(), "..");
const docsDir = path.join(projectRoot, "docs/governance");

const ensureDocsDir = (): void => {
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
};

const writeDoc = (filename: string, content: string): string => {
  ensureDocsDir();
  const filePath = path.join(docsDir, filename);
  fs.writeFileSync(filePath, content, "utf8");
  return filePath;
};

export const generateArchitectureDiagram = (): string => {
  const modules = listArchitectureModules();
  const layers = {
    "Engineering Modules": modules.filter((m) => m.category === "engineering-module"),
    "AI Modules": modules.filter((m) => m.category === "ai-module"),
    Plugins: modules.filter((m) => m.category === "plugin"),
    Knowledge: modules.filter((m) => m.category === "knowledge-service" || m.category === "calculator"),
  };

  const mermaid = [
    "graph TB",
    "  subgraph Frontend",
    ...layers["Engineering Modules"].slice(0, 6).map((m) => `    ${m.id}[${m.name}]`),
    "  end",
    "  subgraph AI_Layer",
    ...layers["AI Modules"].map((m) => `    ${m.id}[${m.name}]`),
    "  end",
    "  subgraph Plugins",
    ...layers.Plugins.map((m) => `    ${m.id}[${m.name}]`),
    "  end",
    "  ai --> plugins",
    "  assistant --> ai",
    "  workflows --> ai",
  ].join("\n");

  return ["# Sarathi AI Architecture", "", "```mermaid", mermaid, "```"].join("\n");
};

export const generateApiDocumentation = (): string => {
  const endpoints = [
    "| Method | Endpoint | Description |",
    "|--------|----------|-------------|",
    "| GET | /api/v1/health | System health |",
    "| GET | /api/v1/health/live | Liveness probe |",
    "| GET | /api/v1/health/ready | Readiness probe |",
    "| GET | /api/v1/metrics | Performance metrics |",
    "| POST | /api/v1/auth/login | JWT authentication |",
    "| POST | /api/v1/ai/chat | AI chat |",
    "| POST | /api/v1/ai/complete | Multi-LLM completion |",
    "| GET | /api/v1/ai/providers/health | AI provider health |",
    "| GET | /api/v1/plugins | Plugin registry |",
    "| GET | /api/v1/governance | Governance report |",
    "| GET | /api/v1/governance/quality | Quality gates |",
    "| GET | /api/v1/governance/dependencies | Dependency analysis |",
  ];

  return ["# Sarathi AI API Documentation", "", ...endpoints].join("\n");
};

export const generateDatabaseDocumentation = (): string => {
  const rules = validateDatabaseGovernance();
  return [
    "# Database Documentation",
    "",
    "## Governance Rules",
    ...rules.map((rule) => `- [${rule.compliant ? "x" : " "}] ${rule.rule}`),
    "",
    "## Commands",
    "- `npm run db:migrate` — Apply migrations",
    "- `npm run db:migrate:dev` — Development migrations",
    "- `npm run db:backup` — Backup database",
    "- `npm run db:seed` — Seed data",
  ].join("\n");
};

export const generateDeveloperGuide = (): string => {
  const standards = validateCodingStandards();
  return [
    "# Sarathi AI Developer Guide",
    "",
    "## Module Structure",
    "Each domain module contains:",
    "- `types.ts` — Type definitions",
    "- `*Engine.ts` — Business logic entry point",
    "- `index.ts` — Public barrel exports",
    "",
    "## Integration Pattern",
    "1. Create `runXEngine()` in module",
    "2. Wire into `engineeringAIExpertEngine.ts`",
    "3. Add prompt augmentation when `result.active === true`",
    "4. Register in governance architecture registry",
    "",
    "## Coding Standards",
    ...standards.map((rule) => `- ${rule.rule}`),
  ].join("\n");
};

export const generateComponentDocumentation = (): string => {
  const modules = listArchitectureModules();
  return [
    "# Component Documentation",
    "",
    "| ID | Name | Category | Version | Status |",
    "|----|------|----------|---------|--------|",
    ...modules.map(
      (m) => `| ${m.id} | ${m.name} | ${m.category} | ${m.version} | ${m.status} |`
    ),
  ].join("\n");
};

export const generateAllDocumentation = (): { generatedAt: string; artifacts: string[] } => {
  const artifacts = [
    writeDoc("ARCHITECTURE.md", generateArchitectureDiagram()),
    writeDoc("API.md", generateApiDocumentation()),
    writeDoc("DATABASE.md", generateDatabaseDocumentation()),
    writeDoc("DEVELOPER_GUIDE.md", generateDeveloperGuide()),
    writeDoc("COMPONENTS.md", generateComponentDocumentation()),
  ];

  const summary = getArchitectureSummary();
  const release = getCurrentRelease();
  artifacts.push(
    writeDoc(
      "GOVERNANCE_SUMMARY.md",
      [
        "# Governance Summary",
        "",
        `Platform version: ${release.version}`,
        `Total modules: ${summary.totalModules}`,
        `Generated: ${new Date().toISOString()}`,
      ].join("\n")
    )
  );

  return {
    generatedAt: new Date().toISOString(),
    artifacts: artifacts.map((filePath) => path.relative(projectRoot, filePath)),
  };
};
