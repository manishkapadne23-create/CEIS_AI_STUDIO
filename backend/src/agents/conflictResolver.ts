import { loadConflictPatterns } from "./loadAgentConfig.js";
import type {
  EmaceAgentOutput,
  EmaceCollaborationMessage,
  EmaceConflictResolution,
  EmaceRequestAnalysis,
} from "./types.js";

export const detectConflicts = (
  analysis: EmaceRequestAnalysis,
  agentOutputs: EmaceAgentOutput[],
  collaborations: EmaceCollaborationMessage[]
): EmaceConflictResolution[] => {
  const scenarios = loadConflictPatterns().conflictScenarios;
  const executedAgentIds = new Set(
    agentOutputs
      .filter((output) => output.status === "executed")
      .map((output) => output.agentId)
  );

  const unresolvedConflicts = collaborations.filter(
    (collab) => collab.action === "raise-conflict" && !collab.resolved
  );

  const conflicts: EmaceConflictResolution[] = [];

  for (const scenario of scenarios) {
    const agentsPresent = scenario.agents.every((agentId) =>
      executedAgentIds.has(agentId)
    );
    if (!agentsPresent) {
      continue;
    }

    const topicMatch = scenario.topicPatterns.some((pattern) =>
      (analysis.topic ?? "").toLowerCase().includes(pattern.toLowerCase())
    );

    const hasCollaborationConflict = unresolvedConflicts.some((collab) =>
      scenario.agents.includes(collab.fromAgentId) &&
      scenario.agents.includes(collab.toAgentId)
    );

    if (!topicMatch && !hasCollaborationConflict) {
      continue;
    }

    const optionAOutput = agentOutputs.find(
      (output) => output.agentId === scenario.optionA.agentId
    );
    const optionBOutput = agentOutputs.find(
      (output) => output.agentId === scenario.optionB.agentId
    );

    conflicts.push({
      id: `conflict-${scenario.id}`,
      scenarioId: scenario.id,
      topic: analysis.topic ?? "Engineering decision",
      conflictingAgents: scenario.agents,
      optionA: {
        label: scenario.optionA.label,
        agentId: scenario.optionA.agentId,
        engineeringJustification:
          optionAOutput?.observations[0] ??
          `${scenario.optionA.label} based on ${scenario.optionA.agentId} analysis.`,
        advantages: scenario.optionA.advantages,
        limitations: scenario.optionA.limitations,
      },
      optionB: {
        label: scenario.optionB.label,
        agentId: scenario.optionB.agentId,
        engineeringJustification:
          optionBOutput?.observations[0] ??
          `${scenario.optionB.label} based on ${scenario.optionB.agentId} analysis.`,
        advantages: scenario.optionB.advantages,
        limitations: scenario.optionB.limitations,
      },
      applicableStandards: scenario.applicableStandards,
      recommendedOption: "user-decision",
    });
  }

  return conflicts.slice(0, 3);
};
