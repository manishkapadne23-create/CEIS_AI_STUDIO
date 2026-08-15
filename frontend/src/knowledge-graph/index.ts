export { buildEntityRegistry, getEntityById, getEntityRegistry, getEntitiesByDiscipline, getEntitiesByType, invalidateEntityRegistry } from "./entityRegistry";
export { buildKnowledgeGraphIndex, buildRelationshipsForEntity, getEntitiesForRelationship, getRelatedEntities } from "./relationshipEngine";
export { crossReferenceSearch, inferSearchMode, searchByEntityType, searchKnowledgeGraph } from "./graphSearch";
export { generateGraphRecommendations } from "./recommendationGraph";
export { formatGraphContextForPrompt, resolveGraphContext } from "./contextResolver";
export { exploreKnowledgePath, formatExplorerPath, listExplorerTopics } from "./graphExplorer";
export { isEngineeringKnowledgeGraphQuery, runKnowledgeGraphEngine } from "./knowledgeGraphEngine";
export type {
  EngineeringKnowledgeGraphIndex,
  GraphContextBundle,
  GraphEntity,
  GraphEntityType,
  GraphExplorerPath,
  GraphRecommendation,
  GraphRelationship,
  GraphRelationshipType,
  GraphSearchMode,
  GraphSearchOptions,
  GraphSearchResult,
  KnowledgeGraphInput,
  KnowledgeGraphResult,
} from "./types";
export { KNOWLEDGE_GRAPH_CAPABILITIES } from "./types";
