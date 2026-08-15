import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "config");

const readJson = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(configDir, fileName), "utf-8")) as T;

export const loadRecommendationCategories = () =>
  readJson<{ categories: Array<{
    id: string;
    label: string;
    moduleId: string;
    priority: number;
  }> }>("recommendationCategories.json").categories;

export const loadTimelineRules = () =>
  readJson<{
    activityTypes: Array<{ id: string; label: string }>;
    intentTimelineMap: Record<string, string[]>;
  }>("timelineRules.json");

export const loadReminderTypes = () =>
  readJson<{ reminderTypes: Array<{ id: string; label: string; category: string }> }>(
    "reminderTypes.json"
  ).reminderTypes;

export const loadRiskPatterns = () =>
  readJson<{
    riskCategories: Array<{ id: string; label: string; severity: string }>;
    detectors: Array<{
      riskId: string;
      patterns: string[];
      condition: string;
    }>;
  }>("riskPatterns.json");

export const loadCoachModes = () =>
  readJson<{ coachModes: Array<{ id: string; label: string; horizonDays: number }> }>(
    "coachModes.json"
  ).coachModes;

export const getPredictivePublicConfig = () => ({
  engine: "Engineering Predictive Intelligence Engine",
  version: "1.0.0",
  recommendationCategories: loadRecommendationCategories(),
  timelineRules: loadTimelineRules(),
  reminderTypes: loadReminderTypes(),
  riskPatterns: loadRiskPatterns().riskCategories,
  coachModes: loadCoachModes(),
  privacy: {
    predictionsPrivate: true,
    userControlled: true,
    canDisable: true,
  },
});
