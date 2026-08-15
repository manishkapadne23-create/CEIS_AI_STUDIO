import { getEntityById } from "./entityRegistry";
import { buildRelationshipsForEntity } from "./relationshipEngine";
import { searchKnowledgeGraph } from "./graphSearch";
import type { GraphEntity, GraphRecommendation } from "./types";

const ENTITY_PRIORITY: Partial<Record<GraphEntity["type"], number>> = {
  topic: 10,
  standard: 9,
  calculator: 8,
  workflow: 7,
  template: 6,
  "ai-agent": 5,
  document: 4,
  "learning-resource": 3,
};

export const generateGraphRecommendations = (
  query: string,
  disciplineId: string | null,
  seedEntityIds: string[] = []
): GraphRecommendation[] => {
  const recommendations: GraphRecommendation[] = [];
  const seen = new Set<string>();

  const addRecommendation = (
    entity: GraphEntity,
    category: GraphRecommendation["category"],
    priority: number
  ): void => {
    if (seen.has(entity.id)) return;
    seen.add(entity.id);
    recommendations.push({
      category,
      title: entity.label,
      description: entity.description,
      entityId: entity.id,
      moduleId: entity.moduleId,
      resourceId: entity.resourceId,
      route: entity.route,
      priority,
    });
  };

  const searchResults = searchKnowledgeGraph({
    query,
    disciplineId,
    limit: 8,
  });

  for (const result of searchResults) {
    const basePriority = ENTITY_PRIORITY[result.entity.type] ?? 2;
    addRecommendation(result.entity, result.entity.type, basePriority + result.score);

    for (const related of result.relatedEntities) {
      addRecommendation(
        related,
        related.type,
        (ENTITY_PRIORITY[related.type] ?? 2) + 1
      );
    }
  }

  for (const seedId of seedEntityIds) {
    const entity = getEntityById(seedId);
    if (!entity) continue;
    const relationships = buildRelationshipsForEntity(entity, disciplineId, 6);
    for (const rel of relationships) {
      const related = getEntityById(rel.toId);
      if (related) {
        addRecommendation(related, related.type, rel.weight + 5);
      }
    }
  }

  if (searchResults.length > 0) {
    const topTopic = searchResults.find(
      (r) => r.entity.type === "topic" || r.entity.type === "discipline"
    )?.entity;
    if (topTopic) {
      const nextTopics = searchKnowledgeGraph({
        query: topTopic.keywords.join(" "),
        disciplineId,
        entityTypes: ["topic"],
        limit: 3,
      }).filter((r) => r.entity.id !== topTopic.id);

      for (const next of nextTopics) {
        addRecommendation(next.entity, "next-topic", 6);
      }
    }
  }

  return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 16);
};
