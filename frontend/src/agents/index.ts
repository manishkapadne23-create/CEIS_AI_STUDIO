export type {
  ActiveAgentContext,
  AgentContextPayload,
  AgentSelectionInput,
  EngineeringAgentCapability,
  EngineeringAgentCapabilityId,
  EngineeringAgentProfile,
  EngineeringAgentStatus,
  EngineeringAgentType,
  FutureSpecialistAgentId,
} from "./types";

export {
  DEFAULT_AGENT_MODULES,
  SUPPORTED_LLM_PROVIDERS,
} from "./types";

export {
  DEFAULT_DISCIPLINE_AGENT_CAPABILITIES,
  ENGINEERING_AGENT_CAPABILITIES,
  formatCapabilitiesList,
  getAgentCapability,
} from "./agentCapabilities";

export {
  DISCIPLINE_AGENT_PROFILES,
  FUTURE_SPECIALIST_AGENT_PROFILES,
  rebuildDisciplineAgentProfile,
} from "./agentProfiles";

export {
  getAgentForDiscipline,
  getEngineeringAgent,
  listAllAgents,
  listDisciplineAgents,
  listSpecialistAgents,
  registerEngineeringAgent,
  searchAgents,
  unregisterEngineeringAgent,
} from "./agentRegistry";

export {
  activateAgentForDiscipline,
  clearActiveAgent,
  getActiveAgent,
  getActiveAgentContext,
  selectAgentForSession,
} from "./agentSelector";

export {
  buildAgentContextFromActive,
  buildAgentContextPayload,
  formatAgentContextForPrompt,
} from "./agentContext";

export {
  getAgentEngineSummary,
  runAgentEngine,
} from "./agentEngine";
export type { RunAgentEngineInput, RunAgentEngineResult } from "./agentEngine";
