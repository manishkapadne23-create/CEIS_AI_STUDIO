import type { ParsedClauseReference, StandardsAssistantAction } from "./types";

const CLAUSE_PATTERNS = [
  /\b(is|irc|iec|iso|astm|asme|api|nbc|morth)\s*[\d:.]+(?:\s*(?:clause|section|sec\.?|cl\.?)\s*([\d.]+))?/i,
  /\bclause\s*([\d.]+)\s+(?:of\s+)?((?:is|irc|iec|iso|astm)\s*[\d:.]+)/i,
  /\bsection\s*([\d.]+)\s+(?:of\s+)?((?:is|irc|iec|iso|astm)\s*[\d:.]+)/i,
  /\bcl\.?\s*([\d.]+)/i,
];

export const parseClauseReference = (message: string): ParsedClauseReference => {
  for (const pattern of CLAUSE_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      const standardCode = match[2] ?? match[1] ?? null;
      const clauseNumber = match[3] ?? match[1] ?? null;
      return {
        standardCode: standardCode?.trim() ?? null,
        clauseNumber: clauseNumber?.trim() ?? null,
        raw: match[0],
      };
    }
  }

  const codeMatch = message.match(
    /\b(IS|IRC|IEC|ISO|ASTM|ASME|API|NBC|MoRTH|AASHTO|ACI|BS|EN)\s*[\d:./-]+/i
  );

  return {
    standardCode: codeMatch?.[0]?.trim() ?? null,
    clauseNumber: null,
    raw: message,
  };
};

const ACTION_PATTERNS: Array<{ action: StandardsAssistantAction; pattern: RegExp }> = [
  { action: "explain-clause", pattern: /\bexplain\s+(?:clause|section)\b/i },
  { action: "summarize-standard", pattern: /\bsummarize\s+standard\b/i },
  { action: "explain-standard", pattern: /\bexplain\s+standard\b/i },
  { action: "compare-clauses", pattern: /\bcompare\s+(?:clause|section)s?\b/i },
  { action: "compare-standards", pattern: /\bcompare\s+standards?\b/i },
  { action: "compare-revisions", pattern: /\bcompare\s+revision|revision\s+comparison\b/i },
  { action: "applicability-guidance", pattern: /\bapplicab|when\s+(?:to\s+)?apply|which\s+standard\b/i },
  { action: "related-standards", pattern: /\brelated\s+standards?\b/i },
  { action: "mandatory-requirements", pattern: /\bmandatory\s+(?:clause|requirement)|shall\s+requirements?\b/i },
  { action: "locate-definitions", pattern: /\bdefinition|define\s+term\b/i },
];

export const inferStandardsAssistantAction = (
  message: string
): StandardsAssistantAction | "general-standards" | null => {
  for (const entry of ACTION_PATTERNS) {
    if (entry.pattern.test(message)) {
      return entry.action;
    }
  }

  if (
    /\b(standard|code|irc|is\s+\d|iec|astm|clause|section)\b/i.test(message)
  ) {
    return "general-standards";
  }

  return null;
};

export const isStandardsIntelligenceQuery = (message: string): boolean =>
  inferStandardsAssistantAction(message) !== null ||
  /\b(IS|IRC|IEC|ISO|ASTM|ASME|NBC|MoRTH)\b/i.test(message) ||
  /\bclause\s*[\d.]+/i.test(message);
