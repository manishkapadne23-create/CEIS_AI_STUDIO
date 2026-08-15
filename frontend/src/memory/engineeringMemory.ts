import { readRecentlyViewedStandardIds } from "../config/standards/standardsPersistence";
import { readRecentlyUsedCalculatorIds } from "../config/calculators/calculatorsPersistence";
import { readFavoriteClauses } from "../standards-intelligence/standardsBookmarks";
import { listDecisionSessions } from "../decision-intelligence/decisionWorkspace";
import { getRecentActivity } from "../personalization/activityTracker";
import { memoryStorageKeys, readMemoryJson, writeMemoryJson } from "./memoryStorage";
import type { EngineeringMemorySnapshot } from "./types";

const EMPTY_ENGINEERING = (): EngineeringMemorySnapshot => ({
  recentStandards: [],
  recentClauses: [],
  recentCalculations: [],
  recentTemplates: [],
  recentReports: [],
  recentDecisions: [],
  recentWorkflows: [],
  updatedAt: Date.now(),
});

export const loadEngineeringMemory = (): EngineeringMemorySnapshot =>
  readMemoryJson(memoryStorageKeys.engineering(), EMPTY_ENGINEERING());

export const saveEngineeringMemory = (
  snapshot: EngineeringMemorySnapshot
): void => {
  writeMemoryJson(memoryStorageKeys.engineering(), {
    ...snapshot,
    updatedAt: Date.now(),
  });
};

const pushUnique = (values: string[], value: string, limit = 12): string[] =>
  [value, ...values.filter((entry) => entry !== value)].slice(0, limit);

export const recordEngineeringMemoryEvent = (
  event: Partial<EngineeringMemorySnapshot>
): EngineeringMemorySnapshot => {
  const current = loadEngineeringMemory();
  const next: EngineeringMemorySnapshot = {
    recentStandards: event.recentStandards
      ? [...event.recentStandards]
      : current.recentStandards,
    recentClauses: event.recentClauses
      ? [...event.recentClauses]
      : current.recentClauses,
    recentCalculations: event.recentCalculations
      ? [...event.recentCalculations]
      : current.recentCalculations,
    recentTemplates: event.recentTemplates
      ? [...event.recentTemplates]
      : current.recentTemplates,
    recentReports: event.recentReports
      ? [...event.recentReports]
      : current.recentReports,
    recentDecisions: event.recentDecisions
      ? [...event.recentDecisions]
      : current.recentDecisions,
    recentWorkflows: event.recentWorkflows
      ? [...event.recentWorkflows]
      : current.recentWorkflows,
    updatedAt: Date.now(),
  };
  saveEngineeringMemory(next);
  return next;
};

export const buildEngineeringMemorySnapshot = (
  disciplineId?: string | null
): EngineeringMemorySnapshot => {
  const stored = loadEngineeringMemory();
  const activity = getRecentActivity(20);

  const recentStandards = disciplineId
    ? readRecentlyViewedStandardIds(disciplineId)
    : stored.recentStandards;
  const recentCalculators = disciplineId
    ? readRecentlyUsedCalculatorIds(disciplineId)
    : stored.recentCalculations;
  const recentClauses = disciplineId
    ? readFavoriteClauses(disciplineId).map((c) => c.label)
    : stored.recentClauses;

  const recentDecisions = listDecisionSessions()
    .slice(0, 5)
    .map((session) => session.title);
  const recentWorkflows = activity
    .filter((entry) => entry.type === "workflow")
    .map((entry) => entry.title)
    .slice(0, 5);
  const recentTemplates = activity
    .filter((entry) => entry.type === "template")
    .map((entry) => entry.title)
    .slice(0, 5);
  const recentReports = activity
    .filter((entry) => entry.type === "document")
    .map((entry) => entry.title)
    .slice(0, 5);

  return {
    recentStandards: recentStandards.length > 0 ? recentStandards : stored.recentStandards,
    recentClauses,
    recentCalculations: recentCalculators.length > 0 ? recentCalculators : stored.recentCalculations,
    recentTemplates: recentTemplates.length > 0 ? recentTemplates : stored.recentTemplates,
    recentReports: recentReports.length > 0 ? recentReports : stored.recentReports,
    recentDecisions: recentDecisions.length > 0 ? recentDecisions : stored.recentDecisions,
    recentWorkflows: recentWorkflows.length > 0 ? recentWorkflows : stored.recentWorkflows,
    updatedAt: Date.now(),
  };
};

export const recordStandardMemory = (
  standardId: string,
  disciplineId: string
): void => {
  const current = loadEngineeringMemory();
  recordEngineeringMemoryEvent({
    recentStandards: pushUnique(
      [
        ...readRecentlyViewedStandardIds(disciplineId),
        ...current.recentStandards,
      ],
      standardId
    ),
  });
};

export const recordCalculatorMemory = (
  calculatorId: string,
  disciplineId: string
): void => {
  const current = loadEngineeringMemory();
  recordEngineeringMemoryEvent({
    recentCalculations: pushUnique(
      [
        ...readRecentlyUsedCalculatorIds(disciplineId),
        ...current.recentCalculations,
      ],
      calculatorId
    ),
  });
};
