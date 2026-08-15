import type { EngineeringStandardMetadata } from "../config/standards";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { buildWorkflowEngineSummary } from "../workflows";
import { getConversationMemory } from "./conversationMemory";
import { getDisciplineSnapshot } from "./disciplineMemory";
import { formatHistorySummary } from "./historyManager";
import type { LoadedEngineeringContext } from "./memoryTypes";
import { getModuleSnapshot } from "./moduleMemory";
import {
  bindEngineeringConversation,
  getEngineeringSession,
  switchEngineeringDiscipline,
  switchEngineeringModule,
} from "./sessionManager";

export interface LoadEngineeringContextInput {
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
  userMessage: string;
  selectedStandard?: EngineeringStandardMetadata | null;
  moduleSearchQuery?: string;
  isFollowUp?: boolean;
}

const buildMemorySummary = (
  context: Omit<LoadedEngineeringContext, "memorySummary">
): string => {
  const lines: string[] = [
    "========================================",
    "Engineering Session Memory",
    "========================================",
  ];

  const { session, conversation, disciplineSnapshot, moduleSnapshot } = context;

  if (session.currentDisciplineName) {
    lines.push(`Discipline: ${session.currentDisciplineName}`);
  }
  if (session.currentModuleId) {
    lines.push(`Active module: ${session.currentModuleId}`);
  }
  if (conversation?.topic ?? session.currentTopic) {
    lines.push(
      `Current engineering topic: ${conversation?.topic ?? session.currentTopic}`
    );
  }
  if (conversation?.lastUserMessage && context.extensions) {
    lines.push(
      `Last user message: "${conversation.lastUserMessage.slice(0, 120)}"`
    );
  }
  if (conversation?.lastAssistantSummary) {
    lines.push(
      `Last AI summary: "${conversation.lastAssistantSummary.slice(0, 160)}"`
    );
  }
  if (session.activeStandardCodes.length > 0) {
    lines.push(
      `Active standards: ${session.activeStandardCodes.join(", ")}`
    );
  }
  if (session.activeCalculatorId) {
    lines.push(`Active calculator: ${session.activeCalculatorId}`);
  }
  if (session.activeDocumentIds.length > 0) {
    lines.push(
      `Active documents: ${session.activeDocumentIds.join(", ")}`
    );
  }

  if (moduleSnapshot) {
    if (moduleSnapshot.searchQuery) {
      lines.push(`Module search context: ${moduleSnapshot.searchQuery}`);
    }
    if (moduleSnapshot.recentQueries.length > 0) {
      lines.push(
        `Recent module queries: ${moduleSnapshot.recentQueries.slice(0, 3).join(" | ")}`
      );
    }
  }

  const projectContext =
    disciplineSnapshot?.projectContext ?? session.projectContext;
  const historyLines = formatHistorySummary(projectContext);
  if (historyLines.length > 0) {
    lines.push("", "Accumulated engineering context:");
    lines.push(...historyLines.map((line) => `  • ${line}`));
  }

  if (context.extensions.ragDocumentIds?.length) {
    lines.push(
      `RAG documents (future): ${context.extensions.ragDocumentIds.join(", ")}`
    );
  }
  if (context.extensions.pmisProjectId) {
    lines.push(`PMIS project (future): ${context.extensions.pmisProjectId}`);
  }

  lines.push(
    "",
    "Continue the same engineering project unless the user explicitly changes topic.",
    "For follow-up commands (continue, BOQ, summarize, etc.), anchor to the current topic above."
  );

  return lines.join("\n");
};

/** Prepare full engineering memory context before an AI turn. */
export const loadEngineeringContext = (
  input: LoadEngineeringContextInput
): LoadedEngineeringContext => {
  let session = getEngineeringSession();

  if (
    input.disciplineId &&
    input.disciplineName &&
    session.currentDisciplineId !== input.disciplineId
  ) {
    session = switchEngineeringDiscipline({
      disciplineId: input.disciplineId,
      disciplineName: input.disciplineName,
      conversationId: input.conversationId,
    });
  }

  session = switchEngineeringModule({
    moduleId: input.moduleId,
    searchQuery: input.moduleSearchQuery,
    selectedStandard: input.selectedStandard ?? null,
  });

  session = bindEngineeringConversation({
    conversationId: input.conversationId,
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    moduleId: input.moduleId,
  });

  const conversation = getConversationMemory(input.conversationId);
  const disciplineSnapshot = input.disciplineId
    ? getDisciplineSnapshot(input.disciplineId)
    : null;
  const moduleSnapshot = getModuleSnapshot(
    input.disciplineId,
    input.moduleId
  );

  const partial: Omit<LoadedEngineeringContext, "memorySummary"> = {
    session,
    conversation,
    disciplineSnapshot,
    moduleSnapshot,
    extensions: {
      vectorStoreNamespace: input.disciplineId
        ? `discipline:${input.disciplineId}`
        : undefined,
      pmisProjectId: null,
      agentSessionId: session.sessionId,
    },
  };

  const workflowSummary = buildWorkflowEngineSummary(
    input.disciplineId,
    input.disciplineName
  ).summaryText;

  return {
    ...partial,
    memorySummary: [buildMemorySummary(partial), workflowSummary]
      .filter(Boolean)
      .join("\n\n"),
  };
};

export const formatLoadedContextForPrompt = (
  context: LoadedEngineeringContext
): string => context.memorySummary;
