import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "config");

const readJson = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(configDir, fileName), "utf-8")) as T;

export const loadExpertiseDomains = () =>
  readJson<{
    domains: Array<{ id: string; label: string }>;
    proficiencyLevels: Array<{ id: string; label: string; score: number }>;
  }>("expertiseDomains.json");

export const loadAdaptationRules = () =>
  readJson<{
    experienceLevelMap: Record<string, string>;
    adaptationFactors: string[];
    responseAdjustments: Record<
      string,
      {
        detailLevel: string;
        includeDefinitions: boolean;
        includeExamples: boolean;
        assumePriorKnowledge: boolean;
      }
    >;
  }>("adaptationRules.json");

export const loadInsightTemplates = () =>
  readJson<{
    insightTypes: Array<{
      id: string;
      label: string;
      enumType: string;
      horizonDays: number;
    }>;
    futureReady: string[];
  }>("insightTemplates.json");

export const getEdePublicConfig = () => ({
  engine: "Engineering Digital Engineer",
  version: "1.0.0",
  expertise: loadExpertiseDomains(),
  adaptation: loadAdaptationRules(),
  insights: loadInsightTemplates(),
  privacy: {
    profilePrivate: true,
    noCrossUserLearning: true,
    userControlled: true,
  },
  futureReady: loadInsightTemplates().futureReady,
});
