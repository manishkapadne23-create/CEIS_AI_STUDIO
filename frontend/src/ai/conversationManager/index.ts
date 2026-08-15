export type {
  ConversationTurn,
  FollowUpIntent,
  ManagedConversationState,
} from "./types";
export {
  detectContextualContinuation,
  detectFollowUpIntent,
  getLastAssistantSummary,
  getLastUserQuestion,
  manageConversationTurn,
} from "./followUpIntent";
