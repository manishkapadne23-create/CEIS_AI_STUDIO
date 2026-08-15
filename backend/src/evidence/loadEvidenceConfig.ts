import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "config");

const readJson = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(configDir, fileName), "utf-8")) as T;

export const loadCitationTypes = () =>
  readJson<{ citationTypes: Array<{
    id: string;
    label: string;
    enum: string;
    trustWeight: number;
  }> }>("citationTypes.json").citationTypes;

export const loadEvidenceSources = () =>
  readJson<{ sources: Array<{
    id: string;
    label: string;
    category: string;
  }> }>("evidenceSources.json").sources;

export const loadTrustLevels = () =>
  readJson<{ levels: Array<{
    id: string;
    label: string;
    enum: string;
    minScore: number;
  }> }>("trustLevels.json").levels;

export const loadConflictPatterns = () =>
  readJson<{
    patterns: Array<{
      id: string;
      label: string;
      description: string;
      detectors: string[];
    }>;
    standardPairs: Array<{
      left: string;
      right: string;
      conflictType: string;
    }>;
  }>("conflictPatterns.json");

export const loadReferenceGraphRules = () =>
  readJson<{
    nodeTypes: string[];
    relations: Array<{ from: string; to: string; relationship: string }>;
    intentBindings: Record<string, string[]>;
  }>("referenceGraphRules.json");

export const getEvidencePublicConfig = () => ({
  engine: "Engineering Evidence & Citation Engine",
  version: "1.0.0",
  citationTypes: loadCitationTypes(),
  evidenceSources: loadEvidenceSources(),
  trustLevels: loadTrustLevels(),
  conflictPatterns: loadConflictPatterns().patterns,
  referenceGraphRules: loadReferenceGraphRules(),
});
