import { readPersistedString, PERSISTED_KEYS } from "../utils/persistedState";
import { getEntityById } from "./entityRegistry";
import { buildRelationshipsForEntity } from "./relationshipEngine";
import { searchKnowledgeGraph } from "./graphSearch";
import type { GraphContextBundle, GraphEntity } from "./types";

const byType = (
  entities: GraphEntity[],
  type: GraphEntity["type"]
): GraphEntity[] => entities.filter((entity) => entity.type === type);

const readSimilarConversations = (disciplineId: string | null): string[] => {
  try {
    const raw = readPersistedString(PERSISTED_KEYS.chatSessions);
    if (!raw) return [];
    const sessions = JSON.parse(raw) as Array<{
      title?: string;
      disciplineId?: string;
      messages?: Array<{ role: string; content: string }>;
    }>;
    return sessions
      .filter((session) => !disciplineId || session.disciplineId === disciplineId)
      .map((session) => session.title ?? session.messages?.[0]?.content?.slice(0, 80) ?? "")
      .filter(Boolean)
      .slice(0, 4);
  } catch {
    return [];
  }
};

export const resolveGraphContext = (
  query: string,
  disciplineId: string | null,
  disciplineName: string | null,
  selectedStandardCode?: string | null
): GraphContextBundle => {
  const searchQuery = selectedStandardCode
    ? `${query} ${selectedStandardCode}`
    : query;

  const searchResults = searchKnowledgeGraph({
    query: searchQuery,
    disciplineId,
    limit: 16,
  });

  const topicEntities = searchResults
    .filter((r) => r.entity.type === "topic" || r.entity.type === "discipline")
    .map((r) => r.entity)
    .slice(0, 4);

  if (topicEntities.length === 0 && disciplineId) {
    const disciplineEntity = getEntityById(`discipline-${disciplineId}`);
    if (disciplineEntity) {
      topicEntities.push(disciplineEntity);
    } else {
      topicEntities.push({
        id: `topic-${disciplineId}`,
        type: "topic",
        label: disciplineName ?? disciplineId,
        description: `General ${disciplineName ?? "engineering"} context`,
        disciplineId,
        disciplineName,
        keywords: [disciplineName ?? disciplineId],
      });
    }
  }

  const allRelated: GraphEntity[] = [];
  const relationships = [];
  for (const topic of topicEntities.slice(0, 2)) {
    const rels = buildRelationshipsForEntity(topic, disciplineId, 8);
    relationships.push(...rels);
    for (const rel of rels) {
      const entity = getEntityById(rel.toId);
      if (entity) allRelated.push(entity);
    }
  }

  const merged = [
    ...searchResults.map((r) => r.entity),
    ...allRelated,
  ];

  const unique = Array.from(new Map(merged.map((e) => [e.id, e])).values());

  return {
    topicEntities,
    standards: byType(unique, "standard").concat(byType(unique, "clause")),
    calculators: byType(unique, "calculator").concat(byType(unique, "formula")),
    workflows: byType(unique, "workflow"),
    templates: byType(unique, "template"),
    documents: byType(unique, "document"),
    reports: byType(unique, "report"),
    aiAgents: byType(unique, "ai-agent"),
    learningResources: byType(unique, "learning-resource"),
    materials: byType(unique, "material"),
    equipment: byType(unique, "equipment"),
    relationships,
    similarConversations: readSimilarConversations(disciplineId),
  };
};

export const formatGraphContextForPrompt = (context: GraphContextBundle): string => {
  const formatGroup = (label: string, entities: GraphEntity[]) => {
    if (entities.length === 0) return null;
    return `${label}:\n${entities
      .slice(0, 5)
      .map((e) => `  - [${e.type}] ${e.label}: ${e.description}`)
      .join("\n")}`;
  };

  const sections = [
    formatGroup("Topics", context.topicEntities),
    formatGroup("Applicable Standards", context.standards),
    formatGroup("Recommended Calculators", context.calculators),
    formatGroup("Workflows", context.workflows),
    formatGroup("Templates", context.templates),
    formatGroup("Documents", context.documents),
    formatGroup("Reports", context.reports),
    formatGroup("AI Experts", context.aiAgents),
    formatGroup("Learning Resources", context.learningResources),
    formatGroup("Materials", context.materials),
    formatGroup("Equipment", context.equipment),
  ].filter(Boolean);

  if (context.relationships.length > 0) {
    sections.push(
      "Knowledge Links:\n" +
        context.relationships
          .slice(0, 8)
          .map((rel) => {
            const from = getEntityById(rel.fromId)?.label ?? rel.fromId;
            const to = getEntityById(rel.toId)?.label ?? rel.toId;
            return `  - ${from} → ${to} (${rel.label})`;
          })
          .join("\n")
    );
  }

  if (context.similarConversations.length > 0) {
    sections.push(
      "Similar Conversations:\n" +
        context.similarConversations.map((c) => `  - ${c}`).join("\n")
    );
  }

  return sections.join("\n\n");
};
