import { formatCapabilitiesList } from "./agentCapabilities";
import type {
  ActiveAgentContext,
  AgentContextPayload,
  EngineeringAgentProfile,
} from "./types";

export const buildAgentContextPayload = (
  agent: EngineeringAgentProfile,
  selectionReason: string
): AgentContextPayload => {
  const capabilitySummary = formatCapabilitiesList(agent.capabilities);

  const supportedResourcesSummary = [
    `Modules: ${agent.supportedModules.join(", ")}`,
    agent.supportedStandards.length > 0
      ? `Standards: ${agent.supportedStandards.join(", ")}`
      : "Standards: discipline catalog",
    agent.supportedCalculators.length > 0
      ? `Calculators: ${agent.supportedCalculators.join(", ")}`
      : "Calculators: discipline catalog",
    agent.supportedTools.length > 0
      ? `Tools: ${agent.supportedTools.join(", ")}`
      : "Tools: professional tools library",
    agent.supportedWorkflows.length > 0
      ? `Workflows: ${agent.supportedWorkflows.join(", ")}`
      : "Workflows: discipline workflows",
    `Documents: ${agent.supportedDocuments.join(", ")}`,
    `LLM providers: ${agent.compatibleProviders.join(", ")}`,
  ].join("\n");

  const contextSummary = [
    "========================================",
    "Engineering AI Agent",
    "========================================",
    `Agent: ${agent.name}`,
    `Discipline: ${agent.disciplineName}`,
    `Status: ${agent.status}`,
    `Selection: ${selectionReason}`,
    "",
    agent.description,
    "",
    agent.systemPromptAugmentation ?? "",
    "",
    "Capabilities:",
    capabilitySummary,
    "",
    "Supported resources:",
    supportedResourcesSummary,
    "",
    "Respond as this specialized engineering agent. Users do not need to manually select agents — discipline drives agent activation.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    activeAgent: agent,
    contextSummary,
    capabilitySummary,
    supportedResourcesSummary,
  };
};

export const buildAgentContextFromActive = (
  activeContext: ActiveAgentContext | null
): AgentContextPayload | null => {
  if (!activeContext) return null;
  return buildAgentContextPayload(
    activeContext.agent,
    activeContext.selectionReason
  );
};

export const formatAgentContextForPrompt = (
  payload: AgentContextPayload | null
): string => payload?.contextSummary ?? "";
