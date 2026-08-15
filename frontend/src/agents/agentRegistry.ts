import {
  DISCIPLINE_AGENT_PROFILES,
  FUTURE_SPECIALIST_AGENT_PROFILES,
  rebuildDisciplineAgentProfile,
} from "./agentProfiles";
import type { EngineeringAgentProfile } from "./types";

const agentMap = new Map<string, EngineeringAgentProfile>();

const hydrateRegistry = (): void => {
  if (agentMap.size > 0) return;

  for (const agent of DISCIPLINE_AGENT_PROFILES) {
    agentMap.set(agent.id, agent);
  }

  for (const agent of FUTURE_SPECIALIST_AGENT_PROFILES) {
    agentMap.set(agent.id, agent);
  }
};

export const registerEngineeringAgent = (
  profile: EngineeringAgentProfile
): void => {
  hydrateRegistry();
  agentMap.set(profile.id, profile);
};

export const unregisterEngineeringAgent = (agentId: string): boolean => {
  hydrateRegistry();
  return agentMap.delete(agentId);
};

export const getEngineeringAgent = (
  agentId: string
): EngineeringAgentProfile | null => {
  hydrateRegistry();
  return agentMap.get(agentId) ?? null;
};

export const getAgentForDiscipline = (
  disciplineId: string | null,
  disciplineName?: string | null
): EngineeringAgentProfile | null => {
  hydrateRegistry();

  if (disciplineId) {
    const byId = agentMap.get(`${disciplineId}-agent`);
    if (byId) return byId;

    const rebuilt = rebuildDisciplineAgentProfile(disciplineId);
    if (rebuilt) {
      registerEngineeringAgent(rebuilt);
      return rebuilt;
    }
  }

  if (disciplineName) {
    const normalized = disciplineName.toLowerCase();
    const match = Array.from(agentMap.values()).find(
      (agent) =>
        agent.type === "discipline" &&
        agent.disciplineName.toLowerCase() === normalized
    );
    if (match) return match;
  }

  return null;
};

export const listDisciplineAgents = (): EngineeringAgentProfile[] => {
  hydrateRegistry();
  return Array.from(agentMap.values()).filter(
    (agent) => agent.type === "discipline" && agent.status === "active"
  );
};

export const listSpecialistAgents = (
  disciplineId?: string | null
): EngineeringAgentProfile[] => {
  hydrateRegistry();
  return Array.from(agentMap.values()).filter(
    (agent) =>
      agent.type === "specialist" &&
      (!disciplineId || agent.disciplineId === disciplineId)
  );
};

export const listAllAgents = (): EngineeringAgentProfile[] => {
  hydrateRegistry();
  return Array.from(agentMap.values());
};

export const searchAgents = (query: string): EngineeringAgentProfile[] => {
  hydrateRegistry();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return listDisciplineAgents();

  return Array.from(agentMap.values()).filter(
    (agent) =>
      agent.name.toLowerCase().includes(normalized) ||
      agent.description.toLowerCase().includes(normalized) ||
      agent.disciplineName.toLowerCase().includes(normalized)
  );
};
