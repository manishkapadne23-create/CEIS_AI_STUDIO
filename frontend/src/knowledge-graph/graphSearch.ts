import { getEntityRegistry } from "./entityRegistry";
import { buildRelationshipsForEntity } from "./relationshipEngine";
import type {
  GraphEntity,
  GraphEntityType,
  GraphSearchMode,
  GraphSearchOptions,
  GraphSearchResult,
} from "./types";

const normalize = (value: string): string => value.toLowerCase().trim();

const tokenize = (value: string): string[] =>
  normalize(value)
    .split(/[\s,;/]+/)
    .filter((token) => token.length > 1);

const scoreEntity = (
  entity: GraphEntity,
  queryTokens: string[],
  mode: GraphSearchMode
): { score: number; matchedTerms: string[] } => {
  const haystack = normalize(
    [entity.label, entity.description, entity.type, ...entity.keywords].join(" ")
  );
  const matchedTerms: string[] = [];
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      matchedTerms.push(token);
      score += entity.label.toLowerCase().includes(token) ? 4 : 2;
    }
  }

  if (mode === "topic" && (entity.type === "topic" || entity.type === "discipline")) {
    score += 2;
  }
  if (mode === "cross-reference" && entity.type === "standard") {
    score += 1;
  }
  if (mode === "dependency" && (entity.type === "workflow" || entity.type === "calculator")) {
    score += 1;
  }

  return { score, matchedTerms };
};

const inferSearchMode = (query: string): GraphSearchMode => {
  if (/\brelated\s+to\b|\bconnected\b|\blinked\b/i.test(query)) return "relationship";
  if (/\bdepends?\s+on\b|\bdependency\b|\brequires?\b/i.test(query)) return "dependency";
  if (/\bcross[\s-]?ref/i.test(query)) return "cross-reference";
  if (/\btopic\b|\bconcept\b|\babout\b/i.test(query)) return "topic";
  return "semantic";
};

export const searchKnowledgeGraph = (
  options: GraphSearchOptions
): GraphSearchResult[] => {
  const query = options.query.trim();
  const mode = options.mode ?? inferSearchMode(query);
  const limit = options.limit ?? 12;
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return [];
  }

  let pool = getEntityRegistry();
  if (options.disciplineId) {
    pool = pool.filter(
      (entity) =>
        !entity.disciplineId || entity.disciplineId === options.disciplineId
    );
  }
  if (options.entityTypes?.length) {
    pool = pool.filter((entity) => options.entityTypes!.includes(entity.type));
  }

  const results: GraphSearchResult[] = [];

  for (const entity of pool) {
    const { score, matchedTerms } = scoreEntity(entity, queryTokens, mode);
    if (score <= 0) continue;

    const relationships = buildRelationshipsForEntity(
      entity,
      options.disciplineId,
      4
    );
    const relatedIds = new Set(relationships.map((rel) => rel.toId));
    const relatedEntities = pool
      .filter((candidate) => relatedIds.has(candidate.id))
      .slice(0, 4);

    let finalScore = score;
    if (mode === "relationship") finalScore += relatedEntities.length;
    if (mode === "dependency") {
      finalScore += relatedEntities.filter(
        (e) => e.type === "workflow" || e.type === "standard"
      ).length;
    }

    results.push({ entity, score: finalScore, matchedTerms, relatedEntities });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
};

export const searchByEntityType = (
  query: string,
  type: GraphEntityType,
  disciplineId?: string | null
): GraphSearchResult[] =>
  searchKnowledgeGraph({
    query,
    disciplineId,
    entityTypes: [type],
    limit: 8,
  });

export const crossReferenceSearch = (
  query: string,
  disciplineId?: string | null
): GraphSearchResult[] =>
  searchKnowledgeGraph({
    query,
    disciplineId,
    mode: "cross-reference",
    entityTypes: ["standard", "clause", "document", "template"],
    limit: 10,
  });

export { inferSearchMode };
