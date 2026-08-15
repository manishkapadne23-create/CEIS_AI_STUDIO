import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type { ConversationMemoryState } from "./memoryTypes";

const conversationStore = new Map<string, ConversationMemoryState>();

const createConversationMemory = (
  conversationId: string,
  disciplineId: string | null = null,
  disciplineName: string | null = null,
  moduleId: WorkspaceCategoryId | null = null
): ConversationMemoryState => ({
  conversationId,
  disciplineId,
  disciplineName,
  moduleId,
  topic: null,
  lastUserMessage: null,
  lastAssistantSummary: null,
  followUpChainCount: 0,
  turnCount: 0,
  updatedAt: Date.now(),
});

export const getConversationMemory = (
  conversationId: string
): ConversationMemoryState | null =>
  conversationStore.get(conversationId) ?? null;

export const ensureConversationMemory = (
  conversationId: string,
  disciplineId: string | null,
  disciplineName: string | null,
  moduleId: WorkspaceCategoryId | null
): ConversationMemoryState => {
  const existing = conversationStore.get(conversationId);

  if (existing) {
    const updated: ConversationMemoryState = {
      ...existing,
      disciplineId: disciplineId ?? existing.disciplineId,
      disciplineName: disciplineName ?? existing.disciplineName,
      moduleId: moduleId ?? existing.moduleId,
      updatedAt: Date.now(),
    };
    conversationStore.set(conversationId, updated);
    return updated;
  }

  const created = createConversationMemory(
    conversationId,
    disciplineId,
    disciplineName,
    moduleId
  );
  conversationStore.set(conversationId, created);
  return created;
};

const TOPIC_PATTERNS: RegExp[] = [
  /\b(design|calculate|prepare|analyze|review|inspect)\s+(?:a\s+)?(.{8,80})/i,
  /\b(rigid pavement|flexible pavement|retaining wall|foundation|beam|column|slab|bridge|tunnel|pipeline|hvac|boiler|transformer)\b/i,
  /\b(boq|bill of quantities|reinforcement|concrete mix|structural design)\b/i,
];

export const inferTopicFromMessage = (message: string): string | null => {
  const trimmed = message.trim();
  if (trimmed.length < 8) return null;

  for (const pattern of TOPIC_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      const topic = (match[2] ?? match[1] ?? match[0]).trim();
      if (topic.length >= 4 && topic.length <= 120) {
        return topic.charAt(0).toUpperCase() + topic.slice(1);
      }
    }
  }

  if (trimmed.length <= 80) {
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  return `${trimmed.slice(0, 77).trim()}...`;
};

export const extractAssistantSummary = (content: string): string => {
  const summaryMatch = content.match(/## Summary\n([\s\S]*?)(?:\n##|$)/);
  if (summaryMatch?.[1]?.trim()) {
    return summaryMatch[1].trim();
  }
  return content.slice(0, 280).trim();
};

export interface RecordConversationTurnInput {
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId: WorkspaceCategoryId | null;
  userMessage: string;
  assistantContent?: string;
  isFollowUp: boolean;
}

export const recordConversationTurn = (
  input: RecordConversationTurnInput
): ConversationMemoryState => {
  const memory = ensureConversationMemory(
    input.conversationId,
    input.disciplineId,
    input.disciplineName,
    input.moduleId
  );

  const inferredTopic =
    !memory.topic && !input.isFollowUp
      ? inferTopicFromMessage(input.userMessage)
      : null;

  const updated: ConversationMemoryState = {
    ...memory,
    lastUserMessage: input.userMessage,
    lastAssistantSummary: input.assistantContent
      ? extractAssistantSummary(input.assistantContent)
      : memory.lastAssistantSummary,
    topic: inferredTopic ?? memory.topic,
    followUpChainCount: input.isFollowUp
      ? memory.followUpChainCount + 1
      : 0,
    turnCount: memory.turnCount + 1,
    updatedAt: Date.now(),
  };

  conversationStore.set(input.conversationId, updated);
  return updated;
};

export const bindConversationToDiscipline = (
  conversationId: string,
  disciplineId: string,
  disciplineName: string
): void => {
  const memory = ensureConversationMemory(
    conversationId,
    disciplineId,
    disciplineName,
    null
  );
  conversationStore.set(conversationId, {
    ...memory,
    disciplineId,
    disciplineName,
    updatedAt: Date.now(),
  });
};

export const listConversationMemories = (): ConversationMemoryState[] =>
  Array.from(conversationStore.values());

export const clearConversationMemory = (conversationId: string): void => {
  conversationStore.delete(conversationId);
};

export const resetConversationMemoryStore = (): void => {
  conversationStore.clear();
};
