import { getEntityById, getEntityRegistry, getEntitiesByDiscipline } from "./entityRegistry";
import type {
  GraphEntity,
  GraphRelationship,
  GraphRelationshipType,
  EngineeringKnowledgeGraphIndex,
} from "./types";

const KEYWORD_RELATIONSHIPS: Array<{
  sourcePattern: RegExp;
  targetPattern: RegExp;
  type: GraphRelationshipType;
  label: string;
}> = [
  {
    sourcePattern: /pavement|flexible|highway|road/i,
    targetPattern: /irc\s*37|morth|pavement/i,
    type: "related-standard",
    label: "governed by",
  },
  {
    sourcePattern: /pavement|flexible|highway/i,
    targetPattern: /pavement|thickness|cbir|flexible/i,
    type: "related-calculator",
    label: "calculated with",
  },
  {
    sourcePattern: /concrete|flexural|beam/i,
    targetPattern: /is\s*456|concrete/i,
    type: "related-standard",
    label: "governed by",
  },
  {
    sourcePattern: /steel|connection|structural/i,
    targetPattern: /is\s*800|steel/i,
    type: "related-standard",
    label: "governed by",
  },
];

const inferRelationshipType = (
  _from: GraphEntity,
  to: GraphEntity
): GraphRelationshipType => {
  switch (to.type) {
    case "standard":
    case "clause":
      return "related-standard";
    case "calculator":
    case "formula":
      return "related-calculator";
    case "document":
      return "related-document";
    case "template":
      return "related-template";
    case "report":
      return "related-report";
    case "workflow":
      return "related-workflow";
    case "ai-agent":
      return "related-ai-expert";
    case "learning-resource":
      return "related-learning-resource";
    case "material":
      return "related-material";
    case "equipment":
      return "related-equipment";
    case "software":
    case "professional-tool":
      return "related-technology";
    default:
      return "references";
  }
};

const sharedKeywordScore = (a: GraphEntity, b: GraphEntity): number => {
  const aKeywords = new Set(a.keywords.map((k) => k.toLowerCase()));
  let score = 0;
  for (const keyword of b.keywords) {
    const normalized = keyword.toLowerCase();
    if (aKeywords.has(normalized)) score += 2;
    if (a.label.toLowerCase().includes(normalized)) score += 1;
    if (a.description.toLowerCase().includes(normalized)) score += 1;
  }
  if (a.disciplineId && a.disciplineId === b.disciplineId) score += 1;
  return score;
};

const addRelationship = (
  relationships: GraphRelationship[],
  from: GraphEntity,
  to: GraphEntity,
  type: GraphRelationshipType,
  label: string,
  weight: number
): void => {
  if (from.id === to.id) return;
  const id = `${from.id}->${to.id}:${type}`;
  if (relationships.some((rel) => rel.id === id)) return;
  relationships.push({ id, fromId: from.id, toId: to.id, type, label, weight });
};

export const buildRelationshipsForEntity = (
  entity: GraphEntity,
  disciplineId?: string | null,
  limit = 8
): GraphRelationship[] => {
  const relationships: GraphRelationship[] = [];
  const pool = getEntityRegistry().filter((candidate) => {
    if (candidate.id === entity.id) return false;
    if (disciplineId && candidate.disciplineId && candidate.disciplineId !== disciplineId) {
      return false;
    }
    return true;
  });

  const scored = pool
    .map((candidate) => ({
      candidate,
      score: sharedKeywordScore(entity, candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  for (const { candidate, score } of scored) {
    addRelationship(
      relationships,
      entity,
      candidate,
      inferRelationshipType(entity, candidate),
      inferRelationshipType(entity, candidate).replace(/-/g, " "),
      score
    );
  }

  for (const rule of KEYWORD_RELATIONSHIPS) {
    const text = `${entity.label} ${entity.description} ${entity.keywords.join(" ")}`;
    if (!rule.sourcePattern.test(text)) continue;
    for (const candidate of pool) {
      if (rule.targetPattern.test(`${candidate.label} ${candidate.description}`)) {
        addRelationship(relationships, entity, candidate, rule.type, rule.label, 5);
      }
    }
  }

  if (entity.type === "standard" && entity.resourceId) {
    for (const clause of pool.filter((e) => e.type === "clause" && e.resourceId?.includes(entity.resourceId!))) {
      addRelationship(relationships, entity, clause, "implements", "contains clause", 4);
    }
  }

  return relationships;
};

export const buildKnowledgeGraphIndex = (
  disciplineId?: string | null
): EngineeringKnowledgeGraphIndex => {
  const entities = disciplineId
    ? getEntitiesByDiscipline(disciplineId)
    : getEntityRegistry();

  const relationships: GraphRelationship[] = [];
  const topicSeeds = entities.filter(
    (entity) => entity.type === "topic" || entity.type === "discipline"
  );

  for (const seed of topicSeeds.slice(0, 20)) {
    relationships.push(...buildRelationshipsForEntity(seed, disciplineId, 6));
  }

  return {
    entities,
    relationships,
    builtAt: Date.now(),
  };
};

export const getRelatedEntities = (
  entityId: string,
  disciplineId?: string | null
): { entity: GraphEntity; relationships: GraphRelationship[] } | null => {
  const entity = getEntityById(entityId);
  if (!entity) return null;
  const relationships = buildRelationshipsForEntity(entity, disciplineId);
  return { entity, relationships };
};

export const getEntitiesForRelationship = (
  relationships: GraphRelationship[],
  fromId: string
): GraphEntity[] =>
  relationships
    .filter((rel) => rel.fromId === fromId)
    .map((rel) => getEntityById(rel.toId))
    .filter((entity): entity is GraphEntity => Boolean(entity));
