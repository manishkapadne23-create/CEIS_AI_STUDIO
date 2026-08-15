import { WORKSPACE_CATEGORY_DEFINITIONS } from "../../workspace/utils/workspaceCategoryConfig";
import { getDisciplineIdByName } from "../../knowledge/utils/resolveKnowledgeModule";
import { retrieveRelevantKnowledge } from "../reasoningEngine/retrieveRelevantKnowledge";
import type {
  EngineeringExpertContextInput,
  EngineeringExpertRuntimeContext,
} from "./types";

const formatValue = (value: string | null | undefined): string =>
  value?.trim() ? value : "Not selected";

export const resolveExpertRuntimeContext = (
  input: EngineeringExpertContextInput
): EngineeringExpertRuntimeContext => {
  const disciplineId =
    input.activeDisciplineId ??
    getDisciplineIdByName(input.workspaceDomain) ??
    null;
  const disciplineName = input.activeDisciplineName ?? input.workspaceDomain;
  const moduleDefinition = input.activeModuleId
    ? WORKSPACE_CATEGORY_DEFINITIONS.find(
        (category) => category.id === input.activeModuleId
      )
    : undefined;

  const cleanMessage = input.userMessage
    .replace(/\n\n\[Follow-up:[\s\S]*$/, "")
    .trim();

  const retrieved = retrieveRelevantKnowledge(
    disciplineId,
    disciplineName,
    [cleanMessage, input.moduleSearchQuery ?? ""].filter(Boolean).join(" "),
    input.selectedStandard ?? null
  );

  const applicableStandards =
    retrieved.relevantStandards.length > 0
      ? retrieved.relevantStandards.map(
          (standard) =>
            `${standard.codeNumber} — ${standard.title} (${standard.publisher})`
        )
      : [];

  const workspaceLabel = [
    formatValue(disciplineName),
    formatValue(input.workspaceBranch),
    formatValue(input.workspaceSpecialization),
  ]
    .filter((value) => value !== "Not selected")
    .join(" / ");

  return {
    input,
    disciplineId,
    disciplineName,
    activeModuleTitle: moduleDefinition?.title ?? "AI Expert",
    activeModuleDescription:
      moduleDefinition?.description ??
      "General engineering expert guidance for the active workspace.",
    workspaceLabel: workspaceLabel || "General Engineering Workspace",
    applicableStandards,
  };
};

export const formatExpertRuntimeContext = (
  context: EngineeringExpertRuntimeContext
): string => {
  const { input } = context;

  return [
    "Engineering AI Expert Context",
    `Discipline: ${formatValue(context.disciplineName)}`,
    `Discipline ID: ${formatValue(context.disciplineId)}`,
    `Branch: ${formatValue(input.workspaceBranch)}`,
    `Specialization: ${formatValue(input.workspaceSpecialization)}`,
    `Country: ${input.workspaceCountry}`,
    `Codes: ${input.workspaceCodes.join(", ") || "Not specified"}`,
    `Active Module: ${context.activeModuleTitle}`,
    `Workspace: ${context.workspaceLabel}`,
    `Conversation ID: ${input.conversationId}`,
    `Subscription Plan: ${input.subscriptionPlan}`,
    `Language: ${input.language}`,
    `Applicable Standards: ${
      context.applicableStandards.length > 0
        ? context.applicableStandards.join("; ")
        : "Resolve from discipline catalog when available"
    }`,
  ].join("\n");
};
