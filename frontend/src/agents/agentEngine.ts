import { buildAgentContextFromActive, formatAgentContextForPrompt } from "./agentContext";
import {
  getEngineeringAgent,
  listAllAgents,
  listDisciplineAgents,
  registerEngineeringAgent,
} from "./agentRegistry";
import { selectAgentForSession, getActiveAgent, getActiveAgentContext } from "./agentSelector";
import type {
  ActiveAgentContext,
  AgentContextPayload,
  AgentSelectionInput,
  EngineeringAgentProfile,
} from "./types";

export interface RunAgentEngineInput extends AgentSelectionInput {
  userMessage?: string;
}

export interface RunAgentEngineResult {
  activeContext: ActiveAgentContext | null;
  contextPayload: AgentContextPayload | null;
  promptAugmentation: string;
}

/** Resolve and activate the engineering agent for the current session. */
export const runAgentEngine = (
  input: RunAgentEngineInput
): RunAgentEngineResult => {
  const activeContext = selectAgentForSession(
    input,
    (agentId) => getEngineeringAgent(agentId)
  );

  const contextPayload = buildAgentContextFromActive(activeContext);
  const promptAugmentation = formatAgentContextForPrompt(contextPayload);

  return {
    activeContext,
    contextPayload,
    promptAugmentation,
  };
};

export const getAgentEngineSummary = (): string => {
  const active = getActiveAgent();
  if (!active) {
    return [
      "Engineering AI Agents: No active discipline agent.",
      `Available discipline agents: ${listDisciplineAgents().length}`,
      "Select an engineering discipline to auto-activate the corresponding agent.",
    ].join("\n");
  }

  const payload = buildAgentContextFromActive(getActiveAgentContext());
  return payload?.contextSummary ?? "";
};

export {
  registerEngineeringAgent,
  getEngineeringAgent,
  listAllAgents,
  listDisciplineAgents,
  getActiveAgent,
  getActiveAgentContext,
};

export type { EngineeringAgentProfile, ActiveAgentContext, AgentContextPayload };
