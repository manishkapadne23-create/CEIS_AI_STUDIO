import type {
  CopilotIntelligenceResult,
  CopilotSuggestion,
  EngineeringRecommendation,
  RelatedKnowledgeBundle,
} from "./types";

const mergeSuggestions = (
  ...groups: CopilotSuggestion[][]
): CopilotSuggestion[] => {
  const seen = new Set<string>();
  const merged: CopilotSuggestion[] = [];

  for (const group of groups) {
    for (const item of group) {
      const key = `${item.category}:${item.title}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }

  return merged.sort((a, b) => b.priority - a.priority);
};

export const buildCopilotSummary = (options: {
  suggestions: CopilotSuggestion[];
  recommendations: EngineeringRecommendation[];
  relatedKnowledge: RelatedKnowledgeBundle;
  userIntent: string;
  moduleRouteReason: string | null;
}): string => {
  const lines: string[] = [
    "========================================",
    "Sarathi Engineering Copilot",
    "========================================",
    `Detected intent: ${options.userIntent}`,
  ];

  if (options.moduleRouteReason) {
    lines.push(`Module routing: ${options.moduleRouteReason}`);
  }

  const topRecs = options.recommendations.slice(0, 4);
  if (topRecs.length > 0) {
    lines.push("", "Engineering recommendations:");
    for (const rec of topRecs) {
      lines.push(`  • [${rec.type}] ${rec.title}: ${rec.message}`);
    }
  }

  const formatGroup = (label: string, items: CopilotSuggestion[]) => {
    if (items.length === 0) return;
    lines.push("", `${label}:`);
    for (const item of items.slice(0, 4)) {
      lines.push(`  • ${item.title} — ${item.description}`);
    }
  };

  formatGroup(
    "Suggested standards",
    options.suggestions.filter((s) => s.category === "standards")
  );
  formatGroup(
    "Suggested calculators",
    options.suggestions.filter((s) => s.category === "calculators")
  );
  formatGroup(
    "Suggested tools & templates",
    options.suggestions.filter(
      (s) =>
        s.category === "templates" ||
        s.category === "professional-tools" ||
        s.category === "reports"
    )
  );
  formatGroup(
    "Suggested workflows",
    options.suggestions.filter((s) => s.category === "workflows")
  );
  formatGroup(
    "Suggested checklists",
    options.suggestions.filter((s) => s.category === "checklists")
  );
  formatGroup(
    "Learning resources",
    options.suggestions.filter((s) => s.category === "learning-resources")
  );

  lines.push(
    "",
    "Proactively mention relevant standards, calculators, tools, workflows, and next steps in your response.",
    "Include a brief '## Copilot Suggestions' section listing the most relevant items above."
  );

  return lines.join("\n");
};

export const assembleCopilotIntelligence = (options: {
  snapshot: CopilotIntelligenceResult["snapshot"];
  topicSuggestions: CopilotSuggestion[];
  knowledgeSuggestions: CopilotSuggestion[];
  intentSuggestions: CopilotSuggestion[];
  recommendations: EngineeringRecommendation[];
  relatedKnowledge: RelatedKnowledgeBundle;
  moduleRoute: CopilotIntelligenceResult["moduleRoute"];
  userIntent: string;
}): CopilotIntelligenceResult => {
  const suggestions = mergeSuggestions(
    options.topicSuggestions,
    options.intentSuggestions,
    options.knowledgeSuggestions
  ).slice(0, 16);

  const summaryText = buildCopilotSummary({
    suggestions,
    recommendations: options.recommendations,
    relatedKnowledge: options.relatedKnowledge,
    userIntent: options.userIntent,
    moduleRouteReason: options.moduleRoute?.reason ?? null,
  });

  return {
    snapshot: options.snapshot,
    suggestions,
    recommendations: options.recommendations,
    relatedKnowledge: options.relatedKnowledge,
    moduleRoute: options.moduleRoute,
    summaryText,
    userIntent: options.userIntent,
  };
};
