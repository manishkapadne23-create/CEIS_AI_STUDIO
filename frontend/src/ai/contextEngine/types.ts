import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import type { EngineeringStandardMetadata } from "../../config/standards";

export type EngineeringSubscriptionPlan =
  | "free"
  | "professional"
  | "enterprise";

export type EngineeringUserLanguage =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "mr"
  | "bn"
  | "gu"
  | "kn"
  | "ml"
  | "pa";

export interface EngineeringConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface EngineeringExpertContextInput {
  workspaceDomain: string | null;
  workspaceBranch: string | null;
  workspaceSpecialization: string | null;
  workspaceCountry: string;
  workspaceCodes: string[];
  activeModuleId: WorkspaceCategoryId | null;
  activeDisciplineId: string | null;
  activeDisciplineName: string | null;
  activeSpecializationId?: string | null;
  activeSpecializationName?: string | null;
  conversationId: string;
  subscriptionPlan?: EngineeringSubscriptionPlan;
  language?: EngineeringUserLanguage;
  userMessage: string;
  conversationHistory: EngineeringConversationMessage[];
  selectedStandard?: EngineeringStandardMetadata | null;
  moduleSearchQuery?: string;
}

export interface EngineeringExpertRuntimeContext {
  input: EngineeringExpertContextInput;
  disciplineId: string | null;
  disciplineName: string | null;
  activeModuleTitle: string;
  activeModuleDescription: string;
  workspaceLabel: string;
  applicableStandards: string[];
}
