import type { CodingStandardRule } from "./types.js";

export const CODING_STANDARDS: CodingStandardRule[] = [
  { id: "naming-modules", category: "naming", rule: "Domain modules use kebab-case folder names (e.g. knowledge-capture, site-execution).", enforced: true },
  { id: "naming-engines", category: "naming", rule: "Engine entry points use run*Engine or *Engine.ts naming.", enforced: true },
  { id: "naming-types", category: "naming", rule: "Shared types live in types.ts within each module.", enforced: true },
  { id: "folder-structure", category: "folder-structure", rule: "Each module contains types.ts, *Engine.ts, and index.ts barrel export.", enforced: true },
  { id: "folder-ai", category: "folder-structure", rule: "AI infrastructure lives under frontend/src/ai and backend/src/ai.", enforced: true },
  { id: "folder-plugins", category: "folder-structure", rule: "Plugin framework lives under */plugins with manager, registry, loader, sandbox, API.", enforced: true },
  { id: "file-barrel", category: "file-organization", rule: "Public module API is exported through index.ts only.", enforced: true },
  { id: "file-esm", category: "file-organization", rule: "Backend imports use .js extensions for ESM compatibility.", enforced: true },
  { id: "doc-module", category: "documentation", rule: "Each sprint module documents integration via prompt augmentation pattern.", enforced: true },
  { id: "component-no-ui-change", category: "component", rule: "Architecture sprints must not redesign UI — chat-driven modules only.", enforced: true },
  { id: "api-versioned", category: "api", rule: "REST APIs are versioned under /api/v1.", enforced: true },
  { id: "api-response", category: "api", rule: "API responses use { success, data } or { success, error } envelope.", enforced: true },
  { id: "db-prisma", category: "database", rule: "Database access uses Prisma with migration-based schema changes.", enforced: true },
  { id: "db-backup", category: "database", rule: "Backup script available via npm run db:backup.", enforced: true },
];

export const validateCodingStandards = (): CodingStandardRule[] => CODING_STANDARDS;

export const getCodingStandardsByCategory = (
  category: CodingStandardRule["category"]
): CodingStandardRule[] => CODING_STANDARDS.filter((rule) => rule.category === category);
