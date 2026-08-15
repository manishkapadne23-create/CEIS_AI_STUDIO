import type { EmaceAgentOutput, EmaceRequestAnalysis } from "./types.js";

export interface EmaceSessionMemory {
  disciplineId: string | null;
  specializationId: string | null;
  topic: string | null;
  participatingAgents: string[];
  keyObservations: string[];
  keyRecommendations: string[];
  keyWarnings: string[];
  lastUpdated: string;
}

export const buildSessionMemory = (
  analysis: EmaceRequestAnalysis,
  agentOutputs: EmaceAgentOutput[]
): EmaceSessionMemory => {
  const executed = agentOutputs.filter((output) => output.status === "executed");

  return {
    disciplineId: analysis.disciplineId,
    specializationId: analysis.specializationId,
    topic: analysis.topic,
    participatingAgents: executed.map((output) => output.agentId),
    keyObservations: executed.flatMap((output) => output.observations).slice(0, 10),
    keyRecommendations: executed.flatMap((output) => output.recommendations).slice(0, 10),
    keyWarnings: executed.flatMap((output) => output.warnings).slice(0, 6),
    lastUpdated: new Date().toISOString(),
  };
};

export const buildMemorySummary = (memory: EmaceSessionMemory): string => {
  const parts = [
    memory.topic ? `Topic: ${memory.topic}` : null,
    memory.participatingAgents.length > 0
      ? `Agents: ${memory.participatingAgents.join(", ")}`
      : null,
    memory.keyWarnings.length > 0
      ? `Warnings: ${memory.keyWarnings.slice(0, 2).join("; ")}`
      : null,
  ].filter(Boolean);

  return parts.join(" | ");
};
