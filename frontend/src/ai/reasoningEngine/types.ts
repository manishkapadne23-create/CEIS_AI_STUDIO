import type { EngineeringStandardMetadata } from "../../config/standards";
import type { LoadedEngineeringContext } from "../../context";
import type { EngineeringCalculatorMetadata } from "../../config/calculators";
import type { EngineeringExpertRuntimeContext } from "../contextEngine";
import type { DisciplineExpertIntelligence } from "../expertIntelligence";
import type { DisciplinePromptDefinition } from "../promptLibrary/types";
import type { EngineeringAIContext } from "../types/EngineeringAIContext";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";

export type EngineeringQueryIntent =
  | "standards-inquiry"
  | "calculation"
  | "design"
  | "compliance"
  | "comparison"
  | "procedure"
  | "general";

export interface RetrievedKnowledgeArtifacts {
  relevantStandards: EngineeringStandardMetadata[];
  relevantCalculators: EngineeringCalculatorMetadata[];
  mentionedStandardCodes: string[];
}

export interface ModuleReasoningSnapshot {
  moduleId: WorkspaceCategoryId | null;
  moduleTitle: string;
  moduleDescription: string;
  selectedStandard: EngineeringStandardMetadata | null;
  moduleSearchQuery: string;
  moduleGuidance: string[];
}

export interface SarathiReasoningContext {
  runtimeContext: EngineeringExpertRuntimeContext;
  expertIntelligence: DisciplineExpertIntelligence;
  engineeringContext: EngineeringAIContext;
  disciplinePrompt: DisciplinePromptDefinition;
  queryIntent: EngineeringQueryIntent;
  retrieved: RetrievedKnowledgeArtifacts;
  moduleSnapshot: ModuleReasoningSnapshot;
  followUpIntent: string | null;
  userQuestion: string;
  sessionMemory?: LoadedEngineeringContext | null;
}

export interface EngineeringReasoningSections {
  summary: string;
  explanation: string;
  engineeringConsiderations: string[];
  applicableStandards: string[];
  calculationNotes: string[];
  practicalRecommendations: string[];
  references: string[];
}

export interface EngineeringReasoningResult {
  sections: EngineeringReasoningSections;
  reasoningContext: SarathiReasoningContext;
  systemPromptAugmentation: string;
}
