import type {
  EdActivitySignalInput,
  EdDigitalEngineerProfile,
  EdWorkingStyle,
} from "./types.js";

const signalToWorkingStyleKey: Record<
  EdActivitySignalInput["signalType"],
  keyof EdWorkingStyle | null
> = {
  STANDARD: "frequentlyUsedStandards",
  CALCULATOR: "frequentlyUsedCalculators",
  TEMPLATE: "frequentlyUsedTemplates",
  REPORT: "frequentlyUsedReports",
  TOPIC: "frequentlyAskedTopics",
  AGENT: "preferredAgents",
  WORKFLOW: "preferredWorkflows",
  DOCUMENT: null,
  CLAUSE: null,
};

export const applyActivityToWorkingStyle = (
  workingStyle: EdWorkingStyle,
  signals: Array<{
    signalType: string;
    resourceLabel: string | null;
    usageCount: number;
  }>
): EdWorkingStyle => {
  const next = { ...workingStyle };

  const grouped = new Map<string, Array<{ label: string; count: number }>>();

  for (const signal of signals) {
    const key = signalToWorkingStyleKey[signal.signalType as EdActivitySignalInput["signalType"]];
    if (!key || !signal.resourceLabel) {
      continue;
    }
    const entries = grouped.get(key) ?? [];
    entries.push({ label: signal.resourceLabel, count: signal.usageCount });
    grouped.set(key, entries);
  }

  for (const [key, entries] of grouped.entries()) {
    const sorted = entries
      .sort((left, right) => right.count - left.count)
      .slice(0, 8)
      .map((entry) => entry.label);
    (next as Record<string, string[]>)[key] = sorted;
  }

  return next;
};

export const buildPersonalLibraryFromSignals = (
  profile: EdDigitalEngineerProfile,
  signals: Array<{
    signalType: string;
    resourceLabel: string | null;
    usageCount: number;
  }>
) => {
  const library = { ...profile.personalLibrary };
  const topByType = (type: string, target: keyof typeof library) => {
    library[target] = signals
      .filter((signal) => signal.signalType === type && signal.resourceLabel)
      .sort((left, right) => right.usageCount - left.usageCount)
      .slice(0, 6)
      .map((signal) => signal.resourceLabel as string);
  };

  topByType("STANDARD", "favouriteStandards");
  topByType("CLAUSE", "favouriteClauses");
  topByType("DOCUMENT", "favouriteDocuments");
  topByType("CALCULATOR", "favouriteCalculators");
  topByType("TEMPLATE", "favouriteTemplates");
  topByType("REPORT", "favouriteReports");

  return library;
};

export const mergePreferredStandards = (
  profile: EdDigitalEngineerProfile,
  workingStyle: EdWorkingStyle
): string[] => {
  const merged = [
    ...profile.preferredStandards,
    ...workingStyle.frequentlyUsedStandards,
    ...profile.personalLibrary.favouriteStandards,
  ];
  return [...new Set(merged)].slice(0, 12);
};
