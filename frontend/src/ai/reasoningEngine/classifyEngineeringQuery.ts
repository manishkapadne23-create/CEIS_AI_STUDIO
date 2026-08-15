import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import type { EngineeringQueryIntent } from "./types";

const INTENT_PATTERNS: Array<{
  intent: EngineeringQueryIntent;
  patterns: RegExp[];
}> = [
  {
    intent: "standards-inquiry",
    patterns: [
      /\b(is\s*\d+|irc|nbc|morth|astm|aashto|bs\s*\d+|iso\s*\d+|iec\s*\d+)\b/i,
      /\b(standard|code|clause|edition|revision|specification)\b/i,
      /\bwhat does .+ cover\b/i,
      /\bwhich code\b/i,
    ],
  },
  {
    intent: "calculation",
    patterns: [
      /\b(calculate|calculation|compute|formula|equation|derive|sizing)\b/i,
      /\bhow much\b/i,
      /\b(load|stress|deflection|capacity|flow rate|head loss)\b/i,
    ],
  },
  {
    intent: "compliance",
    patterns: [
      /\b(comply|compliance|compliant|mandatory|requirement|per code)\b/i,
      /\b(is it allowed|is this acceptable)\b/i,
    ],
  },
  {
    intent: "comparison",
    patterns: [
      /\b(compare|versus|vs\.?|difference between|which is better)\b/i,
    ],
  },
  {
    intent: "procedure",
    patterns: [
      /\b(procedure|step[- ]by[- ]step|process|workflow|how to|methodology)\b/i,
      /\bwhat are the steps\b/i,
    ],
  },
  {
    intent: "design",
    patterns: [
      /\b(design|dimension|specify|select|sizing|layout|detail)\b/i,
      /\b(recommend|propose|suggest a)\b/i,
    ],
  },
];

const MODULE_INTENT_BOOST: Partial<
  Record<WorkspaceCategoryId, EngineeringQueryIntent>
> = {
  standards: "standards-inquiry",
  calculators: "calculation",
  "professional-tools": "procedure",
  documents: "procedure",
  "learning-hub": "procedure",
};

export const classifyEngineeringQuery = (
  message: string,
  activeModuleId: WorkspaceCategoryId | null
): EngineeringQueryIntent => {
  const normalized = message.trim();

  for (const entry of INTENT_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(normalized))) {
      return entry.intent;
    }
  }

  if (activeModuleId && MODULE_INTENT_BOOST[activeModuleId]) {
    return MODULE_INTENT_BOOST[activeModuleId]!;
  }

  return "general";
};
