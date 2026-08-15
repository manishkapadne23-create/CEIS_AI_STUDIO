import type { EngineeringExpertRuntimeContext } from "../contextEngine";
import { agriculturalPrompt } from "./agriculturalPrompt";
import { aerospacePrompt } from "./aerospacePrompt";
import { architecturePrompt } from "./architecturePrompt";
import { automationPrompt } from "./automationPrompt";
import { biomedicalPrompt } from "./biomedicalPrompt";
import { chemicalPrompt } from "./chemicalPrompt";
import { civilPrompt } from "./civilPrompt";
import { computerPrompt } from "./computerPrompt";
import { electricalPrompt } from "./electricalPrompt";
import { electronicsPrompt } from "./electronicsPrompt";
import { environmentalPrompt } from "./environmentalPrompt";
import { industrialPrompt } from "./industrialPrompt";
import { marinePrompt } from "./marinePrompt";
import { mechanicalPrompt } from "./mechanicalPrompt";
import { miningPrompt } from "./miningPrompt";
import { oilGasPrompt } from "./oilgasPrompt";
import { railwayPrompt } from "./railwayPrompt";
import { renewablePrompt } from "./renewablePrompt";
import type { DisciplinePromptDefinition } from "./types";
import { createDisciplinePrompt } from "./types";

export const DISCIPLINE_PROMPT_LIBRARY: DisciplinePromptDefinition[] = [
  civilPrompt,
  mechanicalPrompt,
  electricalPrompt,
  computerPrompt,
  electronicsPrompt,
  chemicalPrompt,
  environmentalPrompt,
  miningPrompt,
  marinePrompt,
  railwayPrompt,
  aerospacePrompt,
  industrialPrompt,
  automationPrompt,
  renewablePrompt,
  architecturePrompt,
  agriculturalPrompt,
  oilGasPrompt,
  biomedicalPrompt,
];

const promptByDisciplineId = new Map(
  DISCIPLINE_PROMPT_LIBRARY.map((prompt) => [prompt.disciplineId, prompt])
);

export const generalEngineeringPrompt = createDisciplinePrompt({
  disciplineId: "general-engineering",
  disciplineName: "General Engineering",
  role: "Senior Engineering Expert providing cross-discipline technical guidance.",
  knowledgeScope: [
    "General engineering analysis and professional practice",
    "Standards-aware design recommendations",
    "Safety and compliance awareness",
  ],
  answerStyle:
    "Provide structured, assumption-driven engineering guidance using professional terminology.",
  terminology: ["design basis", "factor of safety", "compliance", "verification"],
  safetyRules: [
    "Flag safety-critical risks and recommend qualified professional review.",
  ],
});

export const getDisciplinePrompt = (
  disciplineId: string | null | undefined
): DisciplinePromptDefinition =>
  disciplineId
    ? promptByDisciplineId.get(disciplineId) ?? generalEngineeringPrompt
    : generalEngineeringPrompt;

const formatList = (items: string[], emptyMessage: string): string =>
  items.length > 0
    ? items.map((item) => `- ${item}`).join("\n")
    : `- ${emptyMessage}`;

export const buildDisciplineSystemPrompt = (
  runtimeContext: EngineeringExpertRuntimeContext
): string => {
  const prompt = getDisciplinePrompt(runtimeContext.disciplineId);
  const { input } = runtimeContext;

  return [
    "========================================",
    "Sarathi AI — Engineering Expert System Prompt",
    "========================================",
    "",
    "Role",
    prompt.role,
    "",
    "Knowledge Scope",
    formatList(prompt.knowledgeScope, "General engineering scope"),
    "",
    "Answer Style",
    prompt.answerStyle,
    "",
    "Terminology",
    formatList(prompt.terminology, "Use domain-appropriate terminology"),
    "",
    "Safety Rules",
    formatList(prompt.safetyRules, "Apply standard engineering safety practice"),
    "",
    "Response Format",
    prompt.responseFormat,
    "",
    "Runtime Context",
    `Discipline: ${runtimeContext.disciplineName ?? "General Engineering"}`,
    `Active Module: ${runtimeContext.activeModuleTitle}`,
    `Workspace: ${runtimeContext.workspaceLabel}`,
    `Branch: ${input.workspaceBranch ?? "Not selected"}`,
    `Specialization: ${input.workspaceSpecialization ?? "Not selected"}`,
    `Country: ${input.workspaceCountry}`,
    `Codes: ${input.workspaceCodes.join(", ") || "Not specified"}`,
    `Subscription Plan: ${input.subscriptionPlan}`,
    `Response Language: ${input.language}`,
    `Module Focus: ${runtimeContext.activeModuleDescription}`,
    "",
    "Applicable Standards (metadata)",
    formatList(
      runtimeContext.applicableStandards,
      "Resolve from discipline standards catalog"
    ),
    "",
    "========================================",
  ].join("\n");
};

export type { DisciplinePromptDefinition } from "./types";
export { SHARED_ENGINEERING_RESPONSE_FORMAT } from "./types";
