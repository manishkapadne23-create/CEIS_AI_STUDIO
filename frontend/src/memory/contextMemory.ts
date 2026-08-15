import { getEngineeringSession } from "../context/sessionManager";
import type { DisciplineSessionSnapshot } from "../context/memoryTypes";
import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { PERSISTED_KEYS, readPersistedString } from "../utils/persistedState";
import { memoryStorageKeys, readMemoryJson, writeMemoryJson } from "./memoryStorage";
import type { ContextMemorySnapshot } from "./types";

const EMPTY_CONTEXT = (): ContextMemorySnapshot => ({
  lastWorkspaceRoute: null,
  lastConversationId: null,
  lastDisciplineId: null,
  lastModuleId: null,
  lastTopic: null,
  sessionState: null,
  disciplineSnapshots: [],
  updatedAt: Date.now(),
});

export const loadContextMemory = (): ContextMemorySnapshot =>
  readMemoryJson(memoryStorageKeys.context(), EMPTY_CONTEXT());

export const saveContextMemory = (snapshot: ContextMemorySnapshot): void => {
  writeMemoryJson(memoryStorageKeys.context(), {
    ...snapshot,
    updatedAt: Date.now(),
  });
};

export const captureContextMemory = (input: {
  disciplineId?: string | null;
  moduleId?: WorkspaceCategoryId | null;
  conversationId?: string | null;
  topic?: string | null;
  workspaceRoute?: string | null;
  disciplineSnapshots?: DisciplineSessionSnapshot[];
}): ContextMemorySnapshot => {
  const session = getEngineeringSession();
  const existing = loadContextMemory();

  const snapshot: ContextMemorySnapshot = {
    lastWorkspaceRoute:
      input.workspaceRoute ??
      readPersistedString(PERSISTED_KEYS.lastSidebarRoute) ??
      existing.lastWorkspaceRoute,
    lastConversationId:
      input.conversationId ?? session.currentConversationId ?? existing.lastConversationId,
    lastDisciplineId:
      input.disciplineId ?? session.currentDisciplineId ?? existing.lastDisciplineId,
    lastModuleId:
      input.moduleId ?? session.currentModuleId ?? existing.lastModuleId,
    lastTopic:
      input.topic ?? session.currentTopic ?? existing.lastTopic,
    sessionState: session,
    disciplineSnapshots: input.disciplineSnapshots ?? existing.disciplineSnapshots,
    updatedAt: Date.now(),
  };

  saveContextMemory(snapshot);
  return snapshot;
};

export const getRestoredContextSummary = (
  context: ContextMemorySnapshot
): string => {
  const lines: string[] = [];

  if (context.lastDisciplineId) {
    lines.push(`Last workspace discipline: ${context.lastDisciplineId}`);
  }
  if (context.lastModuleId) {
    lines.push(`Last module: ${context.lastModuleId}`);
  }
  if (context.lastTopic) {
    lines.push(`Recent engineering topic: ${context.lastTopic}`);
  }
  if (context.lastConversationId) {
    lines.push(`Last conversation: ${context.lastConversationId}`);
  }
  if (context.lastWorkspaceRoute) {
    lines.push(`Last route: ${context.lastWorkspaceRoute}`);
  }

  return lines.join("\n");
};

export const hydrateContextMemory = (): ContextMemorySnapshot =>
  loadContextMemory();
