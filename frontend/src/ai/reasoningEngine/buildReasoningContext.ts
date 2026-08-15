import type { EngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import type { LoadedEngineeringContext } from "../../context";
import type { EngineeringStandardMetadata } from "../../config/standards";
import { resolveEngineeringAIContext } from "../engineeringContextEngine";
import type { EngineeringExpertContextInput } from "../contextEngine";
import { resolveExpertRuntimeContext } from "../contextEngine";
import { resolveDisciplineExpertIntelligence } from "../expertIntelligence";
import { getDisciplinePrompt } from "../promptLibrary";
import { classifyEngineeringQuery } from "./classifyEngineeringQuery";
import { resolveModuleReasoningContext } from "./resolveModuleReasoningContext";
import { retrieveRelevantKnowledge } from "./retrieveRelevantKnowledge";
import type { SarathiReasoningContext } from "./types";

export interface BuildReasoningContextOptions {
  input: EngineeringExpertContextInput;
  workspace: EngineeringWorkspace;
  selectedStandard?: EngineeringStandardMetadata | null;
  moduleSearchQuery?: string;
  followUpIntent?: string | null;
  sessionMemory?: LoadedEngineeringContext | null;
}

export const buildSarathiReasoningContext = (
  options: BuildReasoningContextOptions
): SarathiReasoningContext => {
  const {
    input,
    workspace,
    selectedStandard = null,
    moduleSearchQuery = "",
    followUpIntent = null,
    sessionMemory = null,
  } = options;

  const cleanQuestion = input.userMessage
    .replace(/\n\n\[Follow-up:[\s\S]*$/, "")
    .trim();

  const runtimeContext = resolveExpertRuntimeContext(input);
  const expertIntelligence = resolveDisciplineExpertIntelligence(
    runtimeContext,
    cleanQuestion
  );
  const engineeringContext = resolveEngineeringAIContext(workspace, cleanQuestion, {
    activeDisciplineId: input.activeDisciplineId,
    activeModuleId: input.activeModuleId,
    selectedStandard: selectedStandard ?? null,
  });
  const disciplinePrompt = getDisciplinePrompt(runtimeContext.disciplineId);
  const queryIntent = classifyEngineeringQuery(
    cleanQuestion,
    input.activeModuleId
  );
  const retrieved = retrieveRelevantKnowledge(
    runtimeContext.disciplineId,
    runtimeContext.disciplineName,
    [cleanQuestion, moduleSearchQuery].filter(Boolean).join(" "),
    selectedStandard
  );
  const moduleSnapshot = resolveModuleReasoningContext(
    input.activeModuleId,
    selectedStandard,
    moduleSearchQuery
  );

  return {
    runtimeContext,
    expertIntelligence,
    engineeringContext,
    disciplinePrompt,
    queryIntent,
    retrieved,
    moduleSnapshot,
    followUpIntent,
    userQuestion: cleanQuestion,
    sessionMemory,
  };
};

export const buildReasoningContextSummary = (
  context: SarathiReasoningContext
): string => {
  const { engineeringContext, retrieved, moduleSnapshot, queryIntent } = context;

  const standardsLines =
    retrieved.relevantStandards.length > 0
      ? retrieved.relevantStandards
          .slice(0, 5)
          .map(
            (standard) =>
              `${standard.codeNumber} — ${standard.title} (${standard.publisher}, ${standard.edition})`
          )
      : ["No specific standards matched — use discipline catalog defaults."];

  const calculatorLines =
    retrieved.relevantCalculators.length > 0
      ? retrieved.relevantCalculators.map(
          (calculator) => `${calculator.name} [${calculator.category}]`
        )
      : ["No specific calculators matched."];

  return [
    `Query intent: ${queryIntent}`,
    `Active module: ${moduleSnapshot.moduleTitle}`,
    `Workspace: ${context.runtimeContext.workspaceLabel}`,
    `Country / codes: ${engineeringContext.workspace.country} — ${engineeringContext.workspace.codes.join(", ") || "not specified"}`,
    `Expert mode: ${context.expertIntelligence.activeExpertMode.label}`,
    `Knowledge overview: ${engineeringContext.knowledge.overview ?? "discipline fundamentals"}`,
    ...(context.sessionMemory?.conversation?.topic
      ? [`Session topic: ${context.sessionMemory.conversation.topic}`]
      : context.sessionMemory?.session.currentTopic
        ? [`Session topic: ${context.sessionMemory.session.currentTopic}`]
        : []),
    ...(context.followUpIntent
      ? [`Follow-up intent: ${context.followUpIntent}`]
      : []),
    `Matched standards: ${standardsLines.join("; ")}`,
    `Matched calculators: ${calculatorLines.join("; ")}`,
    ...(engineeringContext.aiKnowledgeContext?.categoryHighlights ?? []).map(
      (item) => `Knowledge [${item.categoryId}]: ${item.title}`
    ),
    ...moduleSnapshot.moduleGuidance.map((line) => `Module guidance: ${line}`),
  ].join("\n");
};
