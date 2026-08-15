import { captureContextMemory, getRestoredContextSummary, loadContextMemory } from "./contextMemory";
import { buildEngineeringMemorySnapshot } from "./engineeringMemory";
import { buildUserMemorySnapshot } from "./memoryControls";
import { searchEngineeringMemory } from "./memorySearch";
import type {
  EngineeringMemoryInput,
  EngineeringMemoryResult,
  SmartRecallIntent,
} from "./types";

const RECALL_PATTERNS: Array<{
  type: SmartRecallIntent["type"];
  pattern: RegExp;
}> = [
  { type: "continue-discussion", pattern: /\bcontinue\s+(?:previous|last|our)\s+(?:discussion|conversation|chat)\b/i },
  { type: "show-calculation", pattern: /\b(show|open|repeat)\s+(?:previous|last|earlier)\s+calculat/i },
  { type: "open-report", pattern: /\b(open|show|find)\s+(?:last|previous|recent)\s+report\b/i },
  { type: "restore-workflow", pattern: /\b(restore|resume|continue)\s+(?:last|recent|previous)\s+workflow\b/i },
  { type: "find-recommendation", pattern: /\b(earlier|previous)\s+recommendation\b/i },
  { type: "general-recall", pattern: /\bwhat\s+did\s+we\s+(?:discuss|do)|remember\s+(?:last|previous)\b/i },
];

const inferRecallIntent = (
  message: string,
  searchResults: EngineeringMemoryResult["searchResults"]
): SmartRecallIntent | null => {
  for (const entry of RECALL_PATTERNS) {
    if (entry.pattern.test(message)) {
      return { type: entry.type, query: message, matchedResults: searchResults };
    }
  }
  if (searchResults.length > 0 && /\brecall|remember|previous|last\b/i.test(message)) {
    return { type: "general-recall", query: message, matchedResults: searchResults };
  }
  return null;
};

const formatPromptAugmentation = (
  input: EngineeringMemoryInput,
  result: Omit<EngineeringMemoryResult, "promptAugmentation" | "summaryText" | "active">
): string => {
  const lines = [
    "========================================",
    "Engineering Digital Memory (EDM)",
    "========================================",
    `Discipline: ${input.disciplineName ?? "General"}`,
  ];

  if (result.userMemory) {
    lines.push(
      "",
      "User memory:",
      `- Primary discipline: ${result.userMemory.primaryDisciplineName ?? "not set"}`,
      `- Preferred units: ${result.userMemory.preferredUnits}`,
      `- Preferred standards: ${result.userMemory.preferredStandards.join(", ") || "none"}`,
      `- Language: ${result.userMemory.preferredLanguage}`
    );
  }

  if (result.restoredContextSummary) {
    lines.push("", "Restored context:", result.restoredContextSummary);
  }

  if (result.engineeringMemory) {
    lines.push(
      "",
      "Engineering memory:",
      `- Recent standards: ${result.engineeringMemory.recentStandards.slice(0, 4).join(", ") || "none"}`,
      `- Recent calculations: ${result.engineeringMemory.recentCalculations.slice(0, 4).join(", ") || "none"}`,
      `- Recent workflows: ${result.engineeringMemory.recentWorkflows.slice(0, 3).join(", ") || "none"}`,
      `- Recent decisions: ${result.engineeringMemory.recentDecisions.slice(0, 3).join(", ") || "none"}`
    );
  }

  if (result.recallIntent) {
    lines.push("", `Smart recall intent: ${result.recallIntent.type}`);
    if (result.recallIntent.matchedResults.length > 0) {
      lines.push("Matched memory:");
      for (const match of result.recallIntent.matchedResults.slice(0, 5)) {
        lines.push(`- [${match.category}] ${match.title}: ${match.description}`);
      }
    }
  }

  lines.push(
    "",
    "Instructions: Use engineering memory to maintain continuity across sessions.",
    "Reference prior standards, calculations, workflows, and project context when relevant.",
    "If the user asks to continue, anchor to the last topic and conversation context."
  );

  return lines.join("\n");
};

export const runEngineeringMemoryEngine = (
  input: EngineeringMemoryInput
): EngineeringMemoryResult => {
  const inactive: EngineeringMemoryResult = {
    active: false,
    recallIntent: null,
    userMemory: null,
    contextMemory: null,
    engineeringMemory: null,
    searchResults: [],
    restoredContextSummary: "",
    promptAugmentation: "",
    summaryText: "",
  };

  const message = input.userMessage.trim();
  if (!message) return inactive;

  captureContextMemory({
    disciplineId: input.disciplineId,
    moduleId: input.activeModuleId ?? null,
    conversationId: input.conversationId,
  });

  const userMemory = buildUserMemorySnapshot();
  const contextMemory = loadContextMemory();
  const engineeringMemory = buildEngineeringMemorySnapshot(input.disciplineId);
  const searchResults = searchEngineeringMemory(message, null, input.disciplineId);
  const recallIntent = inferRecallIntent(message, searchResults);
  const restoredContextSummary = getRestoredContextSummary(contextMemory);

  const partial = {
    recallIntent,
    userMemory,
    contextMemory,
    engineeringMemory,
    searchResults,
    restoredContextSummary,
  };

  const active = Boolean(
    recallIntent ||
    restoredContextSummary ||
    engineeringMemory.recentStandards.length > 0 ||
    engineeringMemory.recentCalculations.length > 0
  );

  return {
    active,
    ...partial,
    promptAugmentation: formatPromptAugmentation(input, partial),
    summaryText: active
      ? `EDM: ${searchResults.length} memory matches, recall=${recallIntent?.type ?? "context"}`
      : "",
  };
};

export const hydrateEngineeringMemory = (): void => {
  loadContextMemory();
  buildEngineeringMemorySnapshot();
};
