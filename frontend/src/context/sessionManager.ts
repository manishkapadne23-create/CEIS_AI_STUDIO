import {
  readSubscriptionPlan,
  readUserLanguage,
} from "../ai/contextEngine/userPreferences";
import type { EngineeringStandardMetadata } from "../config/standards";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import {
  ensureConversationMemory,
  recordConversationTurn,
} from "./conversationMemory";
import {
  ensureDisciplineSnapshot,
  restoreDisciplineContext,
  saveDisciplineContext,
} from "./disciplineMemory";
import { recordEngineeringHistoryTurn } from "./historyManager";
import {
  createEmptyProjectContext,
  type EngineeringSessionState,
  type LoadedEngineeringContext,
} from "./memoryTypes";
import { getModuleSnapshot, updateModuleMemory } from "./moduleMemory";

let currentSession: EngineeringSessionState = createInitialSession();

function createInitialSession(): EngineeringSessionState {
  return {
    sessionId: crypto.randomUUID(),
    currentDisciplineId: null,
    currentDisciplineName: null,
    currentModuleId: null,
    currentTopic: null,
    currentConversationId: null,
    activeStandardCodes: [],
    activeCalculatorId: null,
    activeDocumentIds: [],
    language: readUserLanguage(),
    subscriptionPlan: readSubscriptionPlan(),
    projectContext: createEmptyProjectContext(),
    startedAt: Date.now(),
    lastActivityAt: Date.now(),
  };
}

const touchSession = (): void => {
  currentSession = {
    ...currentSession,
    lastActivityAt: Date.now(),
    language: readUserLanguage(),
    subscriptionPlan: readSubscriptionPlan(),
  };
};

export const getEngineeringSession = (): EngineeringSessionState =>
  currentSession;

export interface SwitchDisciplineInput {
  disciplineId: string;
  disciplineName: string;
  conversationId?: string | null;
}

/** Store current discipline context and load the target discipline snapshot. */
export const switchEngineeringDiscipline = (
  input: SwitchDisciplineInput
): EngineeringSessionState => {
  touchSession();

  if (
    currentSession.currentDisciplineId &&
    currentSession.currentDisciplineId !== input.disciplineId
  ) {
    const currentDiscipline = ensureDisciplineSnapshot(
      currentSession.currentDisciplineId,
      currentSession.currentDisciplineName ?? currentSession.currentDisciplineId
    );

    saveDisciplineContext({
      disciplineId: currentSession.currentDisciplineId,
      disciplineName:
        currentSession.currentDisciplineName ??
        currentSession.currentDisciplineId,
      topic: currentSession.currentTopic,
      conversationId: currentSession.currentConversationId,
      projectContext: currentSession.projectContext,
      moduleSnapshots: currentDiscipline.moduleSnapshots,
    });
  }

  const restored = restoreDisciplineContext(input.disciplineId);
  const disciplineSnapshot =
    restored ??
    ensureDisciplineSnapshot(input.disciplineId, input.disciplineName);

  currentSession = {
    ...currentSession,
    currentDisciplineId: input.disciplineId,
    currentDisciplineName: input.disciplineName,
    currentTopic: disciplineSnapshot.topic,
    currentConversationId:
      input.conversationId ?? disciplineSnapshot.conversationId,
    projectContext: {
      ...disciplineSnapshot.projectContext,
      disciplineId: input.disciplineId,
      disciplineName: input.disciplineName,
    },
    lastActivityAt: Date.now(),
  };

  if (input.conversationId) {
    ensureConversationMemory(
      input.conversationId,
      input.disciplineId,
      input.disciplineName,
      currentSession.currentModuleId
    );
  }

  return currentSession;
};

export interface SwitchModuleInput {
  moduleId: WorkspaceCategoryId | null;
  searchQuery?: string;
  selectedStandard?: EngineeringStandardMetadata | null;
  activeCalculatorId?: string | null;
}

export const switchEngineeringModule = (
  input: SwitchModuleInput
): EngineeringSessionState => {
  touchSession();

  if (
    currentSession.currentDisciplineId &&
    currentSession.currentDisciplineName &&
    input.moduleId
  ) {
    updateModuleMemory({
      disciplineId: currentSession.currentDisciplineId,
      disciplineName: currentSession.currentDisciplineName,
      moduleId: input.moduleId,
      searchQuery: input.searchQuery,
      selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
      activeCalculatorId: input.activeCalculatorId,
    });
  }

  const standardCode = input.selectedStandard?.codeNumber ?? null;

  currentSession = {
    ...currentSession,
    currentModuleId: input.moduleId,
    activeStandardCodes: standardCode
      ? Array.from(new Set([...currentSession.activeStandardCodes, standardCode]))
      : currentSession.activeStandardCodes,
    activeCalculatorId:
      input.activeCalculatorId ?? currentSession.activeCalculatorId,
    lastActivityAt: Date.now(),
  };

  return currentSession;
};

export interface BindConversationInput {
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
}

export const bindEngineeringConversation = (
  input: BindConversationInput
): EngineeringSessionState => {
  touchSession();

  ensureConversationMemory(
    input.conversationId,
    input.disciplineId,
    input.disciplineName,
    input.moduleId
  );

  currentSession = {
    ...currentSession,
    currentConversationId: input.conversationId,
    currentDisciplineId: input.disciplineId ?? currentSession.currentDisciplineId,
    currentDisciplineName:
      input.disciplineName ?? currentSession.currentDisciplineName,
    currentModuleId: input.moduleId ?? currentSession.currentModuleId,
    lastActivityAt: Date.now(),
  };

  if (input.disciplineId) {
    const discipline = ensureDisciplineSnapshot(
      input.disciplineId,
      input.disciplineName ?? input.disciplineId
    );
    saveDisciplineContext({
      ...discipline,
      conversationId: input.conversationId,
    });
  }

  return currentSession;
};

export interface RecordMessageTurnInput {
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
  userMessage: string;
  assistantContent?: string;
  isFollowUp: boolean;
  selectedStandard?: EngineeringStandardMetadata | null;
  moduleSearchQuery?: string;
}

export const recordEngineeringMessageTurn = (
  input: RecordMessageTurnInput
): LoadedEngineeringContext => {
  touchSession();

  bindEngineeringConversation({
    conversationId: input.conversationId,
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    moduleId: input.moduleId,
  });

  if (input.moduleId && input.disciplineId && input.disciplineName) {
    updateModuleMemory({
      disciplineId: input.disciplineId,
      disciplineName: input.disciplineName,
      moduleId: input.moduleId,
      searchQuery: input.moduleSearchQuery,
      selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
      recentQuery: input.isFollowUp ? undefined : input.userMessage,
    });
  }

  const conversation = recordConversationTurn({
    conversationId: input.conversationId,
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    moduleId: input.moduleId,
    userMessage: input.userMessage,
    assistantContent: input.assistantContent,
    isFollowUp: input.isFollowUp,
  });

  if (input.assistantContent && input.disciplineId) {
    recordEngineeringHistoryTurn({
      disciplineId: input.disciplineId,
      disciplineName: input.disciplineName,
      moduleId: input.moduleId,
      conversationId: input.conversationId,
      userMessage: input.userMessage,
      assistantContent: input.assistantContent,
      topic: conversation.topic,
    });
  }

  const disciplineSnapshot = input.disciplineId
    ? restoreDisciplineContext(input.disciplineId)
    : null;

  if (disciplineSnapshot) {
    currentSession = {
      ...currentSession,
      currentTopic: conversation.topic ?? disciplineSnapshot.topic,
      projectContext: disciplineSnapshot.projectContext,
    };

    if (input.disciplineId) {
      saveDisciplineContext({
        ...disciplineSnapshot,
        topic: conversation.topic ?? disciplineSnapshot.topic,
        conversationId: input.conversationId,
      });
    }
  } else {
    currentSession = {
      ...currentSession,
      currentTopic: conversation.topic ?? currentSession.currentTopic,
    };
  }

  const moduleSnapshot = getModuleSnapshot(
    input.disciplineId,
    input.moduleId
  );

  return {
    session: currentSession,
    conversation,
    disciplineSnapshot,
    moduleSnapshot,
    memorySummary: "",
    extensions: {},
  };
};

export const clearEngineeringSession = (): EngineeringSessionState => {
  currentSession = createInitialSession();
  return currentSession;
};

export const resetEngineeringSessionManager = (): void => {
  currentSession = createInitialSession();
};
