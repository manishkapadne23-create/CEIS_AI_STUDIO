import type { CodingStandardRule } from "./types";

export const CODING_STANDARDS: CodingStandardRule[] = [
  { id: "naming-engines", category: "naming", rule: "Engine files use *Engine.ts naming convention.", enforced: true },
  { id: "folder-modules", category: "folder-structure", rule: "Domain modules live under src/<module-name>/", enforced: true },
  { id: "barrel-exports", category: "file-organization", rule: "Public APIs exported via index.ts barrel files.", enforced: true },
  { id: "no-ui-redesign", category: "component", rule: "Architecture sprints must not redesign UI.", enforced: true },
  { id: "chat-integration", category: "component", rule: "Modules integrate via engineeringAIExpertEngine prompt augmentation.", enforced: true },
  { id: "typescript-strict", category: "type-safety", rule: "TypeScript strict mode enabled.", enforced: true },
];

export const validateCodingStandards = (): CodingStandardRule[] => CODING_STANDARDS;
