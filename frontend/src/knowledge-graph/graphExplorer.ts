import { getEntityById } from "./entityRegistry";
import { buildRelationshipsForEntity } from "./relationshipEngine";
import { searchKnowledgeGraph } from "./graphSearch";
import type { GraphEntity, GraphExplorerPath, GraphRelationship } from "./types";

const EXPLORER_CHAINS: Array<{
  topic: string;
  steps: Array<{ type: GraphEntity["type"]; pattern: RegExp }>;
}> = [
  {
    topic: "Flexible Pavement",
    steps: [
      { type: "standard", pattern: /irc\s*37|morth/i },
      { type: "calculator", pattern: /pavement|thickness|cbir|flexible/i },
      { type: "workflow", pattern: /pavement|highway|design/i },
      { type: "template", pattern: /pavement|design|report/i },
      { type: "learning-resource", pattern: /pavement|highway/i },
      { type: "professional-tool", pattern: /pavement|highway|design/i },
    ],
  },
  {
    topic: "Reinforced Concrete Design",
    steps: [
      { type: "standard", pattern: /is\s*456/i },
      { type: "calculator", pattern: /concrete|flexural|beam/i },
      { type: "workflow", pattern: /structural|concrete|design/i },
      { type: "template", pattern: /structural|design/i },
    ],
  },
];

const findEntityForStep = (
  step: { type: GraphEntity["type"]; pattern: RegExp },
  disciplineId?: string | null
): GraphEntity | null => {
  const results = searchKnowledgeGraph({
    query: step.pattern.source,
    disciplineId,
    entityTypes: [step.type],
    limit: 1,
  });
  return results[0]?.entity ?? null;
};

export const exploreKnowledgePath = (
  topicQuery: string,
  disciplineId?: string | null,
  maxDepth = 6
): GraphExplorerPath | null => {
  const preset = EXPLORER_CHAINS.find((chain) =>
    chain.topic.toLowerCase().includes(topicQuery.toLowerCase()) ||
    topicQuery.toLowerCase().includes(chain.topic.toLowerCase())
  );

  const searchResults = searchKnowledgeGraph({
    query: topicQuery,
    disciplineId,
    entityTypes: ["topic", "discipline"],
    limit: 1,
  });

  const rootEntity =
    searchResults[0]?.entity ??
    ({
      id: `explorer-${topicQuery}`,
      type: "topic",
      label: topicQuery,
      description: `Engineering topic: ${topicQuery}`,
      disciplineId: disciplineId ?? null,
      disciplineName: null,
      keywords: tokenize(topicQuery),
    } satisfies GraphEntity);

  const steps: GraphExplorerPath["steps"] = [];
  let previousEntity = rootEntity;

  const stepDefs = preset?.steps ?? [
    { type: "standard" as const, pattern: /.+/ },
    { type: "calculator" as const, pattern: /.+/ },
    { type: "workflow" as const, pattern: /.+/ },
    { type: "template" as const, pattern: /.+/ },
  ];

  for (const stepDef of stepDefs.slice(0, maxDepth)) {
    const relationships = buildRelationshipsForEntity(previousEntity, disciplineId, 10);
    const match =
      relationships
        .map((rel) => ({ rel, entity: getEntityById(rel.toId) }))
        .find(
          (entry) =>
            entry.entity &&
            entry.entity.type === stepDef.type &&
            stepDef.pattern.test(`${entry.entity.label} ${entry.entity.description}`)
        ) ??
      relationships
        .map((rel) => ({ rel, entity: getEntityById(rel.toId) }))
        .find((entry) => entry.entity?.type === stepDef.type);

    if (!match?.entity) {
      const fallback = findEntityForStep(stepDef, disciplineId);
      if (!fallback) break;
      const rel: GraphRelationship = {
        id: `${previousEntity.id}->${fallback.id}`,
        fromId: previousEntity.id,
        toId: fallback.id,
        type: "references",
        label: "related to",
        weight: 1,
      };
      steps.push({ entity: fallback, relationship: rel });
      previousEntity = fallback;
      continue;
    }

    steps.push({ entity: match.entity, relationship: match.rel });
    previousEntity = match.entity;
  }

  if (steps.length === 0) return null;

  return { rootEntity, steps };
};

const tokenize = (value: string): string[] =>
  value.toLowerCase().split(/[\s,;/]+/).filter((t) => t.length > 1);

export const formatExplorerPath = (path: GraphExplorerPath): string => {
  const lines = [path.rootEntity.label];
  for (const step of path.steps) {
    lines.push(`  ↓ ${step.relationship.label}`);
    lines.push(`  ${step.entity.label} [${step.entity.type}]`);
  }
  return lines.join("\n");
};

export const listExplorerTopics = (): string[] =>
  EXPLORER_CHAINS.map((chain) => chain.topic);
