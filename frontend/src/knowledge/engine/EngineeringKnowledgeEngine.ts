import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import type { EngineeringStandardMetadata } from "../../config/standards";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import {
  buildDisciplineKnowledgeBundle,
  getDisciplinePersonality,
  listAllDisciplineBundles,
} from "./buildDisciplineBundle";
import {
  getDisciplineRegistryEntry,
  getKnowledgeCategoryById,
  loadEngineeringKnowledgeConfig,
} from "./loadKnowledgeConfig";
import {
  getKnowledgeSearchIndex,
  searchEngineeringKnowledge,
} from "./buildKnowledgeSearchIndex";
import {
  formatAIKnowledgeContext,
  resolveAIKnowledgeContext,
} from "./resolveAIKnowledgeContext";
import type {
  AIKnowledgeContextPayload,
  DisciplineKnowledgeBundle,
  KnowledgeCategoryDefinition,
  KnowledgeSearchOptions,
} from "./types";

export class EngineeringKnowledgeEngine {
  private static instance: EngineeringKnowledgeEngine | null = null;

  static getInstance(): EngineeringKnowledgeEngine {
    if (!this.instance) {
      this.instance = new EngineeringKnowledgeEngine();
    }

    return this.instance;
  }

  getConfig() {
    return loadEngineeringKnowledgeConfig();
  }

  listDisciplines() {
    return this.getConfig().disciplines;
  }

  listCategories(): KnowledgeCategoryDefinition[] {
    return this.getConfig().categories;
  }

  getCategory(categoryId: string) {
    return getKnowledgeCategoryById(categoryId);
  }

  getDiscipline(disciplineId: string) {
    return getDisciplineRegistryEntry(disciplineId);
  }

  getDisciplineBundle(disciplineId: string): DisciplineKnowledgeBundle | null {
    return buildDisciplineKnowledgeBundle(disciplineId);
  }

  listDisciplineBundles(): DisciplineKnowledgeBundle[] {
    return listAllDisciplineBundles();
  }

  getPersonality(disciplineId: string) {
    return getDisciplinePersonality(disciplineId);
  }

  search(query: string, options?: KnowledgeSearchOptions) {
    return searchEngineeringKnowledge(query, options);
  }

  getSearchIndex() {
    return getKnowledgeSearchIndex();
  }

  resolveAIContext(options: {
    workspace: EngineeringWorkspace;
    activeDisciplineId?: string | null;
    activeDisciplineName?: string | null;
    activeModuleId?: WorkspaceCategoryId | null;
    userQuery?: string;
    selectedStandard?: EngineeringStandardMetadata | null;
  }): AIKnowledgeContextPayload {
    return resolveAIKnowledgeContext(options);
  }

  formatAIContext(context: AIKnowledgeContextPayload): string {
    return formatAIKnowledgeContext(context);
  }
}

export const engineeringKnowledgeEngine =
  EngineeringKnowledgeEngine.getInstance();
