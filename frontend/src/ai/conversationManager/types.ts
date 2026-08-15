export type FollowUpIntent =
  | "explain-more"
  | "continue"
  | "compare"
  | "simplify"
  | "example"
  | "summarize"
  | "generate-report"
  | "prepare-checklist"
  | "create-boq"
  | "generate-inspection"
  | "none";

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ManagedConversationState {
  conversationId: string;
  history: ConversationTurn[];
  lastUserQuestion: string | null;
  lastAssistantSummary: string | null;
  detectedIntent: FollowUpIntent;
  augmentedUserMessage: string;
}
