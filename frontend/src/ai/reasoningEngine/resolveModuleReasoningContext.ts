import type { EngineeringStandardMetadata } from "../../config/standards";
import { WORKSPACE_CATEGORY_DEFINITIONS } from "../../workspace/utils/workspaceCategoryConfig";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import type { ModuleReasoningSnapshot } from "./types";

const MODULE_GUIDANCE: Record<WorkspaceCategoryId, string[]> = {
  "ai-expert": [
    "Provide open-ended discipline expert guidance grounded in workspace context.",
    "Apply the active expert mode to shape depth, tone, and deliverable type.",
  ],
  standards: [
    "Ground answers in applicable standards metadata — scope, edition, and related codes.",
    "Cite code numbers and publishers; do not reproduce copyrighted standard text.",
    "Cross-reference related standards when the user asks about compliance or design basis.",
  ],
  calculators: [
    "When calculations are requested, identify the relevant calculator, required inputs, units, and verification steps.",
    "State assumptions before presenting formulas or numerical guidance.",
    "Recommend the Sarathi calculator workspace for structured computation when a matching tool exists.",
  ],
  "professional-tools": [
    "Frame responses around professional deliverables: reports, BOQ, checklists, and estimation workflows.",
    "Align tool recommendations with the active discipline practice and project phase.",
  ],
  documents: [
    "Reference document templates, specifications, and report structures appropriate to the discipline.",
    "Highlight sections, approvals, and traceability expected in engineering documentation.",
  ],
  "learning-hub": [
    "Structure explanations for learning: concepts first, then application, then practice.",
    "Recommend courses, tutorials, or practice paths within the discipline knowledge base.",
  ],
};

export const resolveModuleReasoningContext = (
  activeModuleId: WorkspaceCategoryId | null,
  selectedStandard: EngineeringStandardMetadata | null,
  moduleSearchQuery: string
): ModuleReasoningSnapshot => {
  const moduleDefinition = activeModuleId
    ? WORKSPACE_CATEGORY_DEFINITIONS.find(
        (category) => category.id === activeModuleId
      )
    : undefined;

  const moduleId = activeModuleId ?? "ai-expert";

  return {
    moduleId: activeModuleId,
    moduleTitle: moduleDefinition?.title ?? "AI Expert",
    moduleDescription:
      moduleDefinition?.description ??
      "General engineering expert guidance for the active workspace.",
    selectedStandard,
    moduleSearchQuery: moduleSearchQuery.trim(),
    moduleGuidance: MODULE_GUIDANCE[moduleId],
  };
};
