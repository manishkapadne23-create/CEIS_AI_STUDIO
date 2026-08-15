export {
  buildComparisonTable,
  extractAlternativesFromMessage,
  formatComparisonForPrompt,
  isComparisonQuery,
  KNOWN_COMPARISON_TEMPLATES,
  matchKnownComparison,
} from "../decision-support/comparisonEngine";

import type { ComparisonSubject } from "./types";

const SUBJECT_PATTERNS: Array<{ subject: ComparisonSubject; pattern: RegExp }> = [
  { subject: "materials", pattern: /\bmaterial|concrete|steel|timber|composite|polymer\b/i },
  { subject: "technologies", pattern: /\btechnolog|pv|wind|automation|digital|bim\b/i },
  {
    subject: "construction-methods",
    pattern: /\bconstruction\s+method|precast|cast[\s-]in[\s-]situ|open\s+cut|bored\b/i,
  },
  { subject: "equipment", pattern: /\bequipment|plant|machinery|transformer|pump|crane\b/i },
  { subject: "software", pattern: /\bsoftware|etabs|staad|revit|autocad|plm\b/i },
  { subject: "standards", pattern: /\bstandard|code|specification|irc|is\s+\d|iec\b/i },
  {
    subject: "design-alternatives",
    pattern: /\bdesign\s+alternative|option|scheme|configuration\b/i,
  },
];

export const inferComparisonSubject = (message: string): ComparisonSubject | null => {
  for (const entry of SUBJECT_PATTERNS) {
    if (entry.pattern.test(message)) {
      return entry.subject;
    }
  }
  return "design-alternatives";
};
