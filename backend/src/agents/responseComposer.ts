import type {
  EmaceAgentOutput,
  EmaceCollaborationInput,
  EmaceComposedResponse,
  EmaceConflictResolution,
  EmaceRequestAnalysis,
} from "./types.js";

export const composeCollaborativeResponse = (input: {
  userMessage: string;
  analysis: EmaceRequestAnalysis;
  agentOutputs: EmaceAgentOutput[];
  conflicts: EmaceConflictResolution[];
  collaborationInput: EmaceCollaborationInput;
}): EmaceComposedResponse => {
  const executed = input.agentOutputs.filter(
    (output) => output.status === "executed"
  );

  const leadAgent =
    executed.find((output) => output.role === "lead") ?? executed[0];

  const allRecommendations = executed.flatMap((output) => output.recommendations);
  const allWarnings = executed.flatMap((output) => output.warnings);
  const allStandards = executed
    .filter((output) => output.agentId === "standards-expert")
    .flatMap((output) => output.references);
  const allCalculations = executed
    .filter((output) => output.agentId === "calculation-expert")
    .flatMap((output) => output.recommendations);

  const discipline = input.analysis.disciplineName ?? "Engineering";
  const specialization = input.analysis.specializationName ?? "General";
  const topic = input.analysis.topic ?? input.collaborationInput.userMessage.slice(0, 80);

  return {
    executiveSummary: [
      `${discipline} (${specialization}) analysis for: ${topic}.`,
      `${executed.length} specialized agents collaborated on this request.`,
      leadAgent
        ? `Lead recommendation from ${leadAgent.agentName}: ${leadAgent.recommendations[0] ?? "See detailed analysis below."}`
        : "See detailed analysis below.",
    ].join(" "),
    engineeringAnalysis: executed
      .map(
        (output) =>
          `**${output.agentName}**: ${output.observations.slice(0, 2).join(" ")}`
      )
      .join("\n\n"),
    applicableStandards:
      allStandards.length > 0
        ? [...new Set(allStandards)]
        : ["IRC codes", "IS codes", "MoRTH guidelines", "Project specifications"],
    calculations:
      allCalculations.length > 0
        ? allCalculations
        : ["Design calculations to be performed per applicable code provisions."],
    recommendations: [...new Set(allRecommendations)].slice(0, 8),
    risks:
      allWarnings.length > 0
        ? allWarnings
        : input.conflicts.length > 0
          ? input.conflicts.map(
              (conflict) =>
                `Conflict between ${conflict.conflictingAgents.join(" and ")} requires resolution.`
            )
          : ["Standard engineering risks apply — verify with project data."],
    nextSteps: [
      "Confirm design criteria and project constraints.",
      "Perform detailed calculations and prepare design drawings.",
      "Conduct interdisciplinary review with QA/QC and Safety.",
      "Prepare documentation for approval and submission.",
      ...(input.conflicts.length > 0
        ? ["Resolve agent conflicts — review Option A vs Option B justifications."]
        : []),
    ],
  };
};

export const buildCollaborationPromptAugmentation = (input: {
  analysis: EmaceRequestAnalysis;
  agentOutputs: EmaceAgentOutput[];
  composedResponse: EmaceComposedResponse;
  conflicts: EmaceConflictResolution[];
}): string => {
  if (input.agentOutputs.length === 0) {
    return "";
  }

  const sections = [
    "## Multi-Agent Engineering Collaboration",
    "The following specialized engineering agents have analyzed this request. Synthesize their contributions into a unified response.",
    "",
    `### Participating Agents (${input.agentOutputs.length})`,
    ...input.agentOutputs.map(
      (output) =>
        `- **${output.agentName}**: ${output.observations[0] ?? "Contributed analysis."}`
    ),
  ];

  if (input.composedResponse.recommendations.length > 0) {
    sections.push(
      "",
      "### Consolidated Recommendations",
      ...input.composedResponse.recommendations
        .slice(0, 5)
        .map((rec) => `- ${rec}`)
    );
  }

  if (input.conflicts.length > 0) {
    sections.push(
      "",
      "### Agent Conflicts Requiring Resolution",
      ...input.conflicts.map(
        (conflict) =>
          `- ${conflict.topic}: ${conflict.optionA.label} vs ${conflict.optionB.label}`
      )
    );
  }

  return sections.join("\n");
};
