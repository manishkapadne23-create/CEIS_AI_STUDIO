import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type EngineeringProjectStatus =
  | "active"
  | "on-hold"
  | "completed"
  | "archived";

export type EngineeringProjectType =
  | "highway"
  | "building"
  | "water-treatment"
  | "solar"
  | "bridge"
  | "metro"
  | "airport"
  | "industrial"
  | "stp"
  | "general";

export type ProjectArtifactType =
  | "chat"
  | "document"
  | "standard"
  | "calculation"
  | "report"
  | "template"
  | "generated-file"
  | "workflow"
  | "recommendation"
  | "saved-output";

export type ProjectModuleId =
  | "overview"
  | "ai-chat"
  | "standards"
  | "calculators"
  | "professional-tools"
  | "documents"
  | "learning-hub"
  | "generated-reports"
  | "saved-outputs";

export interface EngineeringProject {
  id: string;
  name: string;
  projectType: EngineeringProjectType | string;
  disciplineId: string | null;
  disciplineName: string | null;
  location: string | null;
  client: string | null;
  consultant: string | null;
  contractor: string | null;
  startDate: string | null;
  targetCompletion: string | null;
  description: string;
  tags: string[];
  status: EngineeringProjectStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectArtifact {
  id: string;
  projectId: string;
  type: ProjectArtifactType;
  title: string;
  content: string;
  moduleId?: WorkspaceCategoryId;
  conversationId?: string;
  messageId?: string;
  resourceId?: string;
  tags: string[];
  pinned: boolean;
  bookmarked: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectWorkflowRecord {
  workflowId: string;
  workflowTitle: string;
  status: string;
  currentStep: string | null;
  updatedAt: number;
}

export interface ProjectAIRecommendation {
  id: string;
  message: string;
  source: string;
  timestamp: number;
}

export interface ProjectMemoryState {
  projectId: string;
  chatConversationIds: string[];
  uploadedDocuments: ProjectArtifact[];
  standardsUsed: string[];
  calculations: ProjectArtifact[];
  reports: ProjectArtifact[];
  templates: ProjectArtifact[];
  generatedFiles: ProjectArtifact[];
  savedOutputs: ProjectArtifact[];
  workflows: ProjectWorkflowRecord[];
  aiRecommendations: ProjectAIRecommendation[];
  lastActivityAt: number;
}

export interface ProjectActivityRecord {
  id: string;
  projectId: string;
  type: ProjectArtifactType | "project-created" | "project-updated";
  title: string;
  summary: string;
  timestamp: number;
}

export interface ProjectDashboardData {
  project: EngineeringProject;
  memory: ProjectMemoryState;
  recentActivity: ProjectActivityRecord[];
  stats: {
    documents: number;
    calculations: number;
    reports: number;
    standards: number;
    workflows: number;
    conversations: number;
    pinnedItems: number;
  };
  latestDiscussions: Array<{
    conversationId: string;
    title: string;
    lastMessagePreview: string;
    updatedAt: number;
  }>;
  workflowStatus: ProjectWorkflowRecord[];
}

export interface ProjectSearchResult {
  id: string;
  projectId: string;
  type: ProjectArtifactType | "conversation";
  title: string;
  snippet: string;
  score: number;
  artifactId?: string;
  conversationId?: string;
}

export interface CreateProjectInput {
  name: string;
  projectType?: EngineeringProjectType | string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  location?: string | null;
  client?: string | null;
  consultant?: string | null;
  contractor?: string | null;
  startDate?: string | null;
  targetCompletion?: string | null;
  description?: string;
  tags?: string[];
}

/** Future-ready hooks for PMIS, BIM, GIS, multi-agent, document intelligence. */
export interface ProjectExtensionHooks {
  pmisProjectId?: string | null;
  bimModelId?: string | null;
  gisLayerId?: string | null;
  drawingAnalysisEnabled?: boolean;
  multiAgentSessionId?: string | null;
  timelineEnabled?: boolean;
}

export const PROJECT_MODULE_IDS: ProjectModuleId[] = [
  "overview",
  "ai-chat",
  "standards",
  "calculators",
  "professional-tools",
  "documents",
  "learning-hub",
  "generated-reports",
  "saved-outputs",
];

export const SAMPLE_PROJECT_NAMES = [
  "Mumbai–Nagpur Expressway",
  "Residential Building G+12",
  "STP Design",
  "Solar Power Plant",
  "Bridge Rehabilitation",
  "Metro Station",
  "Airport Expansion",
];
