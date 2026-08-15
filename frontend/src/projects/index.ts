export type {
  CreateProjectInput,
  EngineeringProject,
  EngineeringProjectStatus,
  EngineeringProjectType,
  ProjectActivityRecord,
  ProjectArtifact,
  ProjectArtifactType,
  ProjectAIRecommendation,
  ProjectDashboardData,
  ProjectExtensionHooks,
  ProjectMemoryState,
  ProjectModuleId,
  ProjectSearchResult,
  ProjectWorkflowRecord,
} from "./types";

export { PROJECT_MODULE_IDS, SAMPLE_PROJECT_NAMES } from "./types";

export {
  createEngineeringProject,
  findProjectByName,
  getActiveProject,
  getProjectExtensionHooks,
  listEngineeringProjects,
  resolveProjectFromMessage,
  setActiveProject,
  setProjectExtensionHooks,
  updateEngineeringProject,
} from "./projectManager";

export {
  bindConversationToProject,
  bookmarkProjectArtifact,
  formatProjectMemorySummary,
  getAllArtifacts,
  getProjectMemory,
  pinProjectArtifact,
  recordProjectRecommendations,
  recordProjectStandards,
  recordProjectWorkflow,
  saveItemToProject,
  tagProjectArtifact,
} from "./projectMemory";
export type { RecordProjectChatInput, SaveToProjectInput } from "./projectMemory";

export {
  formatActivityTimeline,
  getRecentProjectActivity,
  recordProjectHistory,
} from "./projectHistory";

export { searchWithinProject } from "./projectSearch";
export type { ProjectSearchScope } from "./projectSearch";

export {
  buildProjectDashboard,
  formatProjectDashboardSummary,
  getActiveProjectDashboard,
} from "./projectDashboard";

export {
  getActiveProjectContextBlock,
  handleProjectMessage,
  recordProjectAITurn,
} from "./projectOrchestrator";
export type { HandleProjectMessageResult } from "./projectOrchestrator";

export {
  getActiveProjectId,
  hydrateProjectStorage,
  resetProjectStorage,
} from "./projectStorage";
