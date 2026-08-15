import { formatGraphContextForPrompt, resolveGraphContext } from "./contextResolver";
import { exploreKnowledgePath, formatExplorerPath, listExplorerTopics } from "./graphExplorer";
import { inferSearchMode, searchKnowledgeGraph } from "./graphSearch";
import { generateGraphRecommendations } from "./recommendationGraph";
import type { KnowledgeGraphInput, KnowledgeGraphResult } from "./types";

const EKG_TRIGGERS =
  /\b(knowledge\s+graph|related\s+to|connected\s+to|explore\s+topic|what\s+is\s+related|cross[\s-]?ref|dependency|depends?\s+on|recommend|next\s+topic|engineering\s+topic|find\s+related)\b/i;

export const isKnowledgeGraphQuery = (message: string): boolean =>
  EKG_TRIGGERS.test(message) ||
  /\b(flexible\s+pavement|irc\s*37|reinforced\s+concrete|is\s*456)\b/i.test(message);

const formatPromptAugmentation = (
  input: KnowledgeGraphInput,
  result: Omit<KnowledgeGraphResult, "promptAugmentation" | "summaryText" | "active">
): string => {
  const lines = [
    "========================================",
    "Engineering Knowledge Graph (EKG)",
    "========================================",
    `Discipline: ${input.disciplineName ?? "General"}`,
    `Search mode: ${result.searchMode ?? "semantic"}`,
  ];

  if (result.context) {
    lines.push("", formatGraphContextForPrompt(result.context));
  }

  if (result.explorerPaths.length > 0) {
    lines.push("", "Knowledge Explorer Paths:");
    for (const path of result.explorerPaths.slice(0, 2)) {
      lines.push(formatExplorerPath(path));
    }
  }

  if (result.recommendations.length > 0) {
    lines.push("", "Smart Recommendations:");
    for (const rec of result.recommendations.slice(0, 8)) {
      lines.push(`- [${rec.category}] ${rec.title}: ${rec.description}`);
    }
  }

  lines.push(
    "",
    "Instructions: Use the knowledge graph to connect standards, calculators, workflows,",
    "templates, and learning resources. Suggest related entities when helpful.",
    "Always verify against official standards and project-specific requirements."
  );

  return lines.join("\n");
};

export const runKnowledgeGraphEngine = (
  input: KnowledgeGraphInput
): KnowledgeGraphResult => {
  const inactive: KnowledgeGraphResult = {
    active: false,
    searchMode: null,
    matchedEntities: [],
    recommendations: [],
    context: null,
    explorerPaths: [],
    graphSummary: "",
    promptAugmentation: "",
    summaryText: "",
  };

  const message = input.userMessage.trim();
  const shouldActivate =
    isKnowledgeGraphQuery(message) ||
    Boolean(input.sessionTopic) ||
    message.length > 12;

  if (!shouldActivate) {
    return inactive;
  }

  const searchMode = inferSearchMode(message);
  const searchResults = searchKnowledgeGraph({
    query: message,
    disciplineId: input.disciplineId,
    mode: searchMode,
    limit: 10,
  });

  const matchedEntities = searchResults.map((r) => r.entity);
  const context = resolveGraphContext(
    message,
    input.disciplineId,
    input.disciplineName,
    input.selectedStandardCode
  );

  const recommendations = generateGraphRecommendations(
    message,
    input.disciplineId,
    matchedEntities.map((e) => e.id)
  );

  const explorerPaths = [];
  for (const topic of listExplorerTopics()) {
    if (message.toLowerCase().includes(topic.toLowerCase())) {
      const path = exploreKnowledgePath(topic, input.disciplineId);
      if (path) explorerPaths.push(path);
    }
  }
  if (explorerPaths.length === 0 && matchedEntities.length > 0) {
    const path = exploreKnowledgePath(
      matchedEntities[0].label,
      input.disciplineId
    );
    if (path) explorerPaths.push(path);
  }

  const graphSummary = [
    `${matchedEntities.length} entities`,
    `${context.relationships.length} relationships`,
    `${recommendations.length} recommendations`,
  ].join(", ");

  const partial = {
    searchMode,
    matchedEntities,
    recommendations,
    context,
    explorerPaths,
    graphSummary,
  };

  return {
    active: true,
    ...partial,
    promptAugmentation: formatPromptAugmentation(input, partial),
    summaryText: `EKG: ${graphSummary}`,
  };
};

export { isKnowledgeGraphQuery as isEngineeringKnowledgeGraphQuery };
