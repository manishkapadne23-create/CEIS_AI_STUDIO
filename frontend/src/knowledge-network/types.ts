import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type EngineeringKnowledgeCategory =
  | "engineering-concepts"
  | "engineering-terminology"
  | "engineering-standards"
  | "engineering-formulae"
  | "engineering-units"
  | "engineering-materials"
  | "engineering-equipment"
  | "engineering-methods"
  | "engineering-procedures"
  | "engineering-workflows"
  | "engineering-templates"
  | "engineering-checklists"
  | "engineering-best-practices"
  | "engineering-safety"
  | "engineering-quality"
  | "engineering-inspection"
  | "engineering-maintenance"
  | "engineering-construction"
  | "engineering-design"
  | "engineering-planning"
  | "engineering-contracts"
  | "engineering-claims"
  | "engineering-research";

export type KnowledgeEntryStatus = "active" | "updated" | "new" | "deprecated";

export type KnowledgeRelationType =
  | "standard"
  | "calculator"
  | "professional-tool"
  | "learning-resource"
  | "template"
  | "report"
  | "document"
  | "workflow"
  | "related-topic";

export interface EngineeringKnowledgeCategoryDef {
  id: EngineeringKnowledgeCategory;
  label: string;
  description: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  category: EngineeringKnowledgeCategory;
  disciplineId: string;
  disciplineName: string;
  moduleId?: WorkspaceCategoryId;
  resourceId?: string;
  keywords: string[];
  status: KnowledgeEntryStatus;
  version: string;
  updatedAt: number;
}

export interface KnowledgeRelation {
  topicId: string;
  relatedId: string;
  relationType: KnowledgeRelationType;
  label: string;
}

export interface KnowledgeVersionRecord {
  entryId: string;
  version: string;
  status: KnowledgeEntryStatus;
  updatedAt: number;
  changeNote: string;
}

export interface DisciplineKnowledgeIndex {
  disciplineId: string;
  disciplineName: string;
  entryCount: number;
  categories: EngineeringKnowledgeCategory[];
}

export type KnowledgeSearchMode =
  | "keyword"
  | "discipline"
  | "category"
  | "topic"
  | "standards"
  | "calculator"
  | "workflow";

export interface KnowledgeSearchOptions {
  query: string;
  disciplineId?: string | null;
  category?: EngineeringKnowledgeCategory | null;
  mode?: KnowledgeSearchMode;
  limit?: number;
}

export interface KnowledgeSearchResult {
  entry: KnowledgeEntry;
  score: number;
  matchedTerms: string[];
}

export interface KnowledgeRetrievalBundle {
  topicEntries: KnowledgeEntry[];
  relations: KnowledgeRelation[];
  standards: KnowledgeEntry[];
  calculators: KnowledgeEntry[];
  workflows: KnowledgeEntry[];
  tools: KnowledgeEntry[];
  learningResources: KnowledgeEntry[];
  relatedTopics: KnowledgeEntry[];
}

/** Future-ready hooks for RAG, vector DB, semantic search, PMIS. */
export interface KnowledgeNetworkExtensionHooks {
  ragEnabled?: boolean;
  vectorDatabaseId?: string | null;
  semanticSearchEnabled?: boolean;
  localKnowledgeBasePath?: string | null;
  pmisKnowledgeLayerId?: string | null;
}

export interface KnowledgeProviderInput {
  userMessage: string;
  disciplineId: string | null;
  disciplineName: string | null;
  activeModuleId: WorkspaceCategoryId | null;
  conversationId: string;
  sessionTopic?: string | null;
  selectedStandardCode?: string | null;
}

export interface KnowledgeProviderResult {
  retrieval: KnowledgeRetrievalBundle;
  searchResults: KnowledgeSearchResult[];
  disciplineIndex: DisciplineKnowledgeIndex | null;
  versionSummary: string;
  promptAugmentation: string;
  summaryText: string;
  entryCount: number;
}

export const EKN_CATEGORY_DEFINITIONS: EngineeringKnowledgeCategoryDef[] = [
  { id: "engineering-concepts", label: "Engineering Concepts", description: "Core engineering principles and concepts" },
  { id: "engineering-terminology", label: "Engineering Terminology", description: "Technical terms and definitions" },
  { id: "engineering-standards", label: "Engineering Standards", description: "Codes, standards, and specifications" },
  { id: "engineering-formulae", label: "Engineering Formulae", description: "Formulas and calculation methods" },
  { id: "engineering-units", label: "Engineering Units", description: "Units of measurement and conversions" },
  { id: "engineering-materials", label: "Engineering Materials", description: "Material properties and selection" },
  { id: "engineering-equipment", label: "Engineering Equipment", description: "Plant, machinery, and equipment" },
  { id: "engineering-methods", label: "Engineering Methods", description: "Engineering methods and approaches" },
  { id: "engineering-procedures", label: "Engineering Procedures", description: "Step-by-step engineering procedures" },
  { id: "engineering-workflows", label: "Engineering Workflows", description: "Discipline engineering workflows" },
  { id: "engineering-templates", label: "Engineering Templates", description: "Document and report templates" },
  { id: "engineering-checklists", label: "Engineering Checklists", description: "Inspection and QA checklists" },
  { id: "engineering-best-practices", label: "Engineering Best Practices", description: "Industry best practices" },
  { id: "engineering-safety", label: "Engineering Safety", description: "Safety requirements and protocols" },
  { id: "engineering-quality", label: "Engineering Quality", description: "Quality assurance and control" },
  { id: "engineering-inspection", label: "Engineering Inspection", description: "Inspection methods and formats" },
  { id: "engineering-maintenance", label: "Engineering Maintenance", description: "Maintenance planning and procedures" },
  { id: "engineering-construction", label: "Engineering Construction", description: "Construction methods and execution" },
  { id: "engineering-design", label: "Engineering Design", description: "Design principles and processes" },
  { id: "engineering-planning", label: "Engineering Planning", description: "Project and engineering planning" },
  { id: "engineering-contracts", label: "Engineering Contracts", description: "Contract types and administration" },
  { id: "engineering-claims", label: "Engineering Claims", description: "Claims management and disputes" },
  { id: "engineering-research", label: "Engineering Research", description: "Research and reference materials" },
];
