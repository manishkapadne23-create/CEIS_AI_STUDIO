import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import type { EngineeringDisciplineKnowledgeSchema } from "../types/EngineeringKnowledgeSchema";
import type { EngineeringSearchResult } from "../../sarathi/types";

export type KnowledgeCategoryId =
  | "fundamentals"
  | "design"
  | "analysis"
  | "construction-manufacturing"
  | "testing"
  | "inspection"
  | "maintenance"
  | "safety"
  | "standards"
  | "specifications"
  | "best-practices"
  | "checklists"
  | "troubleshooting"
  | "faqs";

export type KnowledgeCatalogModuleId = WorkspaceCategoryId;

export interface KnowledgeCategoryDefinition {
  id: KnowledgeCategoryId;
  label: string;
  description: string;
}

export interface KnowledgeCatalogModuleDefinition {
  id: KnowledgeCatalogModuleId;
  label: string;
  catalogKey: string;
}

export interface DisciplineKnowledgeRegistryEntry {
  id: string;
  name: string;
  aiPersonalityKey: string;
}

export interface EngineeringKnowledgeCategoryItem {
  id: string;
  categoryId: KnowledgeCategoryId;
  title: string;
  description?: string;
  disciplineId: string;
  moduleId?: KnowledgeCatalogModuleId;
  keywords?: string[];
}

export interface DisciplineKnowledgeBundle {
  disciplineId: string;
  disciplineName: string;
  aiPersonalityKey: string;
  schema: EngineeringDisciplineKnowledgeSchema;
  categoryItems: EngineeringKnowledgeCategoryItem[];
  standardsCount: number;
  calculatorsCount: number;
  toolsCount: number;
  workflowsCount: number;
  documentsCount: number;
  learningResourcesCount: number;
}

export interface KnowledgeSearchOptions {
  disciplineId?: string | null;
  categoryId?: KnowledgeCategoryId | null;
  moduleId?: KnowledgeCatalogModuleId | null;
  scope?: "all" | "workspace";
  limit?: number;
}

export interface KnowledgeSearchIndexEntry extends EngineeringSearchResult {
  categoryId?: KnowledgeCategoryId;
  moduleId?: KnowledgeCatalogModuleId;
  keywords?: string[];
}

export interface AIKnowledgeContextPayload {
  disciplineId: string | null;
  disciplineName: string | null;
  activeModuleId: KnowledgeCatalogModuleId | null;
  personality: {
    role: string;
    answerStyle: string;
    terminology: string[];
    safetyRules: string[];
    knowledgeScope: string[];
  };
  knowledgeOverview: string | null;
  categoryHighlights: EngineeringKnowledgeCategoryItem[];
  applicableStandards: string[];
  applicableCalculators: string[];
  enabledCapabilities: string[];
  semanticSearchReady: boolean;
  ragReady: boolean;
  providerHooks: {
    openai: boolean;
    ollama: boolean;
    localLlm: boolean;
    vectorDatabase: boolean;
    documentIntelligence: boolean;
    drawingIntelligence: boolean;
    pmisIntegration: boolean;
  };
}
