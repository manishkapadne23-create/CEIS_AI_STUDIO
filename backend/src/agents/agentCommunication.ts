import { loadCollaborationRules } from "./loadAgentConfig.js";
import type {
  EmaceAgentOutput,
  EmaceCollaborationMessage,
} from "./types.js";

export const runAgentCollaboration = (
  agentOutputs: EmaceAgentOutput[]
): EmaceCollaborationMessage[] => {
  const rules = loadCollaborationRules();
  const collaborations: EmaceCollaborationMessage[] = [];
  const executedAgents = agentOutputs.filter(
    (output) => output.status === "executed"
  );

  for (const pair of rules.validationPairs) {
    const validator = executedAgents.find(
      (output) => output.agentId === pair.validator
    );
    if (!validator) {
      continue;
    }

    for (const targetId of pair.validates) {
      const target = executedAgents.find((output) => output.agentId === targetId);
      if (!target) {
        continue;
      }

      collaborations.push({
        id: `collab-validate-${pair.validator}-${targetId}`,
        fromAgentId: pair.validator,
        toAgentId: targetId,
        action: "validate-output",
        message: `${validator.agentName} validated output from ${target.agentName}. ${
          target.warnings.length > 0
            ? `Warnings noted: ${target.warnings.join("; ")}`
            : "No critical issues identified."
        }`,
        resolved: target.warnings.length === 0,
      });
    }
  }

  for (let index = 0; index < executedAgents.length - 1; index += 1) {
    const fromAgent = executedAgents[index];
    const toAgent = executedAgents[index + 1];

    if (fromAgent.recommendations.length > 0) {
      collaborations.push({
        id: `collab-request-${fromAgent.agentId}-${toAgent.agentId}`,
        fromAgentId: toAgent.agentId,
        toAgentId: fromAgent.agentId,
        action: "request-information",
        message: `${toAgent.agentName} requested clarification from ${fromAgent.agentName} on: ${fromAgent.recommendations[0]}`,
        resolved: true,
      });
    }
  }

  const designOutput = executedAgents.find(
    (output) => output.agentId === "design-expert"
  );
  const safetyOutput = executedAgents.find(
    (output) => output.agentId === "safety-expert"
  );

  if (designOutput && safetyOutput && safetyOutput.warnings.length > 0) {
    collaborations.push({
      id: "collab-conflict-design-safety",
      fromAgentId: "safety-expert",
      toAgentId: "design-expert",
      action: "raise-conflict",
      message: `${safetyOutput.agentName} raised safety concerns with ${designOutput.agentName}'s approach.`,
      resolved: false,
    });
  }

  const estimationOutput = executedAgents.find(
    (output) => output.agentId === "estimation-expert"
  );
  if (designOutput && estimationOutput) {
    collaborations.push({
      id: "collab-alternative-estimation",
      fromAgentId: "estimation-expert",
      toAgentId: "design-expert",
      action: "recommend-alternative",
      message: `${estimationOutput.agentName} recommends cost-optimized alternatives to ${designOutput.agentName}'s design approach.`,
      resolved: false,
    });
  }

  return collaborations;
};
