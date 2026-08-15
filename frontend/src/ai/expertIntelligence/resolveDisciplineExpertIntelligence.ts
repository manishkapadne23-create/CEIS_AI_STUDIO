import type { EngineeringExpertRuntimeContext } from "../contextEngine";
import { EXPERT_CAPABILITIES } from "./expertCapabilities";
import {
  detectExpertModeFromMessage,
  detectOutputFormatFromMessage,
} from "./detectExpertIntent";
import { EXPERT_MODES, getExpertModeById } from "./expertModes";
import { FUTURE_EXPERT_CAPABILITIES } from "./futureCapabilities";
import {
  EXPERT_OUTPUT_FORMATS,
  getOutputFormatById,
} from "./outputFormats";
import type { DisciplineExpertIntelligence } from "./types";

const buildEngineeringContextSummary = (
  runtimeContext: EngineeringExpertRuntimeContext
): string => {
  const { input } = runtimeContext;

  return [
    `Workspace: ${runtimeContext.workspaceLabel}`,
    `Branch: ${input.workspaceBranch ?? "Not selected"}`,
    `Specialization: ${input.workspaceSpecialization ?? "Not selected"}`,
    `Country: ${input.workspaceCountry}`,
    `Codes: ${input.workspaceCodes.join(", ") || "Not specified"}`,
    `Standards: ${
      runtimeContext.applicableStandards.length > 0
        ? runtimeContext.applicableStandards.slice(0, 5).join("; ")
        : "Discipline catalog"
    }`,
  ].join(" | ");
};

export const resolveDisciplineExpertIntelligence = (
  runtimeContext: EngineeringExpertRuntimeContext,
  userMessage: string
): DisciplineExpertIntelligence => {
  const disciplineName =
    runtimeContext.disciplineName ?? "General Engineering";
  const expertModeId = detectExpertModeFromMessage(userMessage);
  const outputFormatId = detectOutputFormatFromMessage(userMessage);

  return {
    expertTitle: `${disciplineName} Expert`,
    disciplineName,
    disciplineId: runtimeContext.disciplineId,
    workspaceLabel: runtimeContext.workspaceLabel,
    activeModuleTitle: runtimeContext.activeModuleTitle,
    engineeringContextSummary: buildEngineeringContextSummary(runtimeContext),
    subscriptionPlan: runtimeContext.input.subscriptionPlan ?? "free",
    activeExpertMode: getExpertModeById(expertModeId),
    availableExpertModes: EXPERT_MODES,
    capabilities: EXPERT_CAPABILITIES,
    outputFormat: getOutputFormatById(outputFormatId),
    availableOutputFormats: EXPERT_OUTPUT_FORMATS,
    futureCapabilities: FUTURE_EXPERT_CAPABILITIES,
  };
};
