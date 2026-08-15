export type {
  DisciplineKnowledgeIndex,
  EngineeringKnowledgeCategory,
  EngineeringKnowledgeCategoryDef,
  KnowledgeEntry,
  KnowledgeEntryStatus,
  KnowledgeNetworkExtensionHooks,
  KnowledgeProviderInput,
  KnowledgeProviderResult,
  KnowledgeRelation,
  KnowledgeRelationType,
  KnowledgeRetrievalBundle,
  KnowledgeSearchMode,
  KnowledgeSearchOptions,
  KnowledgeSearchResult,
  KnowledgeVersionRecord,
} from "./types";

export { EKN_CATEGORY_DEFINITIONS } from "./types";

export {
  buildKnowledgeRepository,
  getKnowledgeRepository,
  getRepositoryEntriesByCategory,
  getRepositoryEntriesByDiscipline,
  invalidateKnowledgeRepository,
} from "./knowledgeRepository";

export {
  getDisciplineKnowledgeIndex,
  getKnowledgeEntry,
  getRegistryStats,
  listAllKnowledgeEntries,
  listDisciplineKnowledgeIndices,
  registerKnowledgeEntry,
  searchRegistryByCategory,
} from "./knowledgeRegistry";

export {
  buildKnowledgeRelations,
  buildKnowledgeRetrievalBundle,
  formatRelationsForPrompt,
} from "./knowledgeRelations";

export {
  searchByCategory,
  searchByDiscipline,
  searchCalculators,
  searchKnowledgeNetwork,
  searchStandards,
  searchWorkflows,
} from "./knowledgeSearch";

export {
  getKnowledgeSyncCounter,
  getKnowledgeVersionHistory,
  getVersionSummary,
  markKnowledgeDeprecated,
  markKnowledgeUpdated,
  recordKnowledgeVersion,
  registerNewKnowledgeTopic,
  synchronizeKnowledgeVersions,
} from "./knowledgeVersioning";

export {
  formatKnowledgeForPrompt,
  getKnowledgeNetworkExtensionHooks,
  provideEngineeringKnowledge,
  setKnowledgeNetworkExtensionHooks,
} from "./knowledgeProvider";
