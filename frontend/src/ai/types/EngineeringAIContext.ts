import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import type { EngineeringAIExpertProfile } from "./EngineeringAIExpertProfile";

export interface EngineeringAIContextDiscipline {
  id: string | null;
  name: string | null;
}

export interface EngineeringAIContextKnowledge {
  moduleId: string | null;
  moduleName: string | null;
  specialization: string | null;
  overview: string | null;
}

export interface EngineeringAIContextCapability {
  id: string;
  key: string;
  label: string;
  status: string;
  enabled: boolean;
}

export interface EngineeringAIContextStandard {
  id: string;
  code: string;
  title: string;
  family: string;
  status: string;
  fromKnowledgeRepository: boolean;
}

export interface EngineeringAIContext {
  workspace: EngineeringWorkspace;
  discipline: EngineeringAIContextDiscipline;
  knowledge: EngineeringAIContextKnowledge;
  capabilities: EngineeringAIContextCapability[];
  standards: EngineeringAIContextStandard[];
  expert: EngineeringAIExpertProfile;
  userPrompt: string;
  aiKnowledgeContext?: import("../../knowledge/engine").AIKnowledgeContextPayload;
}
