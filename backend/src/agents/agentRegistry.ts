import { loadDefaultAgents } from "./loadAgentConfig.js";
import type { EmaceAgentDefinition } from "./types.js";

const agentMap = () => {
  const agents = loadDefaultAgents();
  return new Map(agents.map((agent) => [agent.id, agent]));
};

export const listRegisteredAgents = (): EmaceAgentDefinition[] =>
  loadDefaultAgents().sort((left, right) => right.priority - left.priority);

export const getAgentById = (agentId: string): EmaceAgentDefinition | undefined =>
  agentMap().get(agentId);

export const getAgentsByIds = (agentIds: string[]): EmaceAgentDefinition[] =>
  agentIds
    .map((agentId) => getAgentById(agentId))
    .filter((agent): agent is EmaceAgentDefinition => Boolean(agent));

export const filterAgentsBySubscription = (
  agentIds: string[],
  subscriptionPlan: string
): string[] => {
  const agents = getAgentsByIds(agentIds);
  return agents
    .filter((agent) => agent.subscriptionTiers.includes(subscriptionPlan))
    .map((agent) => agent.id);
};
