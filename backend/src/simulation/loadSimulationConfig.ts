import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "config");

const readJson = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(configDir, fileName), "utf-8")) as T;

export const loadSupportedDisciplines = () =>
  readJson<{ disciplines: Array<{ id: string; name: string }> }>(
    "supportedDisciplines.json"
  ).disciplines;

export const loadScenarioTypes = () =>
  readJson<{
    scenarioTypes: Array<{ id: string; label: string; enumValue: string }>;
  }>("scenarioTypes.json").scenarioTypes;

export const loadComparisonCriteria = () =>
  readJson<{
    criteria: Array<{ id: string; label: string; scale?: string }>;
    impactLevels: string[];
  }>("comparisonCriteria.json");

export const loadFutureIntegrations = () =>
  readJson<{
    disclaimer: string;
    futureIntegrations: string[];
    assistantCapabilities: string[];
  }>("futureIntegrations.json");

export const getEssaePublicConfig = () => ({
  engine: "Engineering Simulation & Scenario Analysis Engine",
  version: "1.0.0",
  disciplines: loadSupportedDisciplines(),
  scenarioTypes: loadScenarioTypes(),
  comparisonCriteria: loadComparisonCriteria(),
  ...loadFutureIntegrations(),
});
