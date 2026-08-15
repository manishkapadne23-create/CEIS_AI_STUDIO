import type { ConversationTurn, FollowUpIntent } from "./types";

const FOLLOW_UP_PATTERNS: Array<{ intent: FollowUpIntent; patterns: RegExp[] }> =
  [
    {
      intent: "continue",
      patterns: [
        /^continue\b/i,
        /^go on\b/i,
        /^proceed\b/i,
        /^next step\b/i,
        /^carry on\b/i,
      ],
    },
    {
      intent: "explain-more",
      patterns: [
        /^explain more\b/i,
        /^explain further\b/i,
        /^elaborate\b/i,
        /^go deeper\b/i,
        /^tell me more\b/i,
        /^more detail\b/i,
      ],
    },
    {
      intent: "summarize",
      patterns: [
        /^summarize\b/i,
        /^summarise\b/i,
        /^summary\b/i,
        /^give a summary\b/i,
        /^brief summary\b/i,
      ],
    },
    {
      intent: "generate-report",
      patterns: [
        /^generate report\b/i,
        /^prepare report\b/i,
        /^create report\b/i,
        /^write report\b/i,
        /^engineering report\b/i,
      ],
    },
    {
      intent: "prepare-checklist",
      patterns: [
        /^prepare checklist\b/i,
        /^create checklist\b/i,
        /^inspection checklist\b/i,
        /^checklist\b/i,
      ],
    },
    {
      intent: "create-boq",
      patterns: [
        /^create boq\b/i,
        /^prepare boq\b/i,
        /^generate boq\b/i,
        /^bill of quantities\b/i,
        /^boq\b/i,
      ],
    },
    {
      intent: "generate-inspection",
      patterns: [
        /^generate inspection\b/i,
        /^inspection format\b/i,
        /^prepare inspection\b/i,
        /^site inspection\b/i,
        /^inspection report\b/i,
      ],
    },
    {
      intent: "compare",
      patterns: [/^compare\b/i, /^versus\b/i, /^vs\.?\b/i, /^difference between\b/i],
    },
    {
      intent: "simplify",
      patterns: [
        /^simplify\b/i,
        /^make it simpler\b/i,
        /^in simple terms\b/i,
        /^easy explanation\b/i,
      ],
    },
    {
      intent: "example",
      patterns: [
        /^give an example\b/i,
        /^show an example\b/i,
        /^example\b/i,
        /^for example\b/i,
      ],
    },
  ];

export const detectFollowUpIntent = (message: string): FollowUpIntent => {
  const normalized = message.trim();

  for (const entry of FOLLOW_UP_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(normalized))) {
      return entry.intent;
    }
  }

  return "none";
};

/** Short continuations that rely on session topic (e.g. "Now calculate reinforcement"). */
export const detectContextualContinuation = (
  message: string,
  sessionTopic: string | null
): FollowUpIntent => {
  if (!sessionTopic) return "none";

  const normalized = message.trim();
  if (normalized.length > 120) return "none";

  const continuationLead =
    /^(now|next|also|then|please|can you|could you)\b/i.test(normalized);
  const imperativeContinuation =
    /^(calculate|prepare|design|check|verify|estimate|draft|review)\b/i.test(
      normalized
    );

  if (continuationLead || imperativeContinuation) {
    return "continue";
  }

  return "none";
};

const augmentMessageForIntent = (
  message: string,
  intent: FollowUpIntent,
  lastUserQuestion: string | null,
  lastAssistantSummary: string | null
): string => {
  if (intent === "none" || !lastUserQuestion) {
    return message;
  }

  const contextAnchor = lastAssistantSummary
    ? `Previous answer summary: ${lastAssistantSummary}`
    : `Previous question: ${lastUserQuestion}`;

  switch (intent) {
    case "continue":
      return `${message}\n\n[Follow-up: Continue the same engineering project from where we left off. ${contextAnchor}]`;
    case "explain-more":
      return `${message}\n\n[Follow-up: Expand the previous engineering explanation with more technical depth. ${contextAnchor}]`;
    case "summarize":
      return `${message}\n\n[Follow-up: Summarize the engineering discussion so far in a concise professional format. ${contextAnchor}]`;
    case "generate-report":
      return `${message}\n\n[Follow-up: Generate a structured engineering report for the current project topic. ${contextAnchor}]`;
    case "prepare-checklist":
      return `${message}\n\n[Follow-up: Prepare a practical engineering checklist for the current project topic. ${contextAnchor}]`;
    case "create-boq":
      return `${message}\n\n[Follow-up: Prepare a Bill of Quantities (BOQ) for the current engineering project. ${contextAnchor}]`;
    case "generate-inspection":
      return `${message}\n\n[Follow-up: Generate an inspection format or site inspection template for the current project. ${contextAnchor}]`;
    case "compare":
      return `${message}\n\n[Follow-up: Provide a structured comparison relevant to the previous engineering topic. ${contextAnchor}]`;
    case "simplify":
      return `${message}\n\n[Follow-up: Simplify the previous engineering explanation for a non-specialist audience. ${contextAnchor}]`;
    case "example":
      return `${message}\n\n[Follow-up: Provide a practical worked example for the previous engineering topic. ${contextAnchor}]`;
    default:
      return message;
  }
};

export const getLastUserQuestion = (
  history: ConversationTurn[]
): string | null => {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index]?.role === "user") {
      return history[index].content;
    }
  }

  return null;
};

export const getLastAssistantSummary = (
  history: ConversationTurn[]
): string | null => {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index]?.role === "assistant") {
      const content = history[index].content;
      const summaryMatch = content.match(/## Summary\n([\s\S]*?)(?:\n##|$)/);

      return summaryMatch?.[1]?.trim() ?? content.slice(0, 240);
    }
  }

  return null;
};

export const manageConversationTurn = (
  conversationId: string,
  history: ConversationTurn[],
  userMessage: string,
  sessionAnchor?: {
    topic: string | null;
    lastUserMessage: string | null;
    lastAssistantSummary: string | null;
  }
) => {
  const explicitIntent = detectFollowUpIntent(userMessage);
  const detectedIntent =
    explicitIntent !== "none"
      ? explicitIntent
      : detectContextualContinuation(
          userMessage,
          sessionAnchor?.topic ?? null
        );
  const lastUserQuestion =
    getLastUserQuestion(history) ?? sessionAnchor?.lastUserMessage ?? null;
  const lastAssistantSummary =
    getLastAssistantSummary(history) ?? sessionAnchor?.lastAssistantSummary ?? null;

  const topicAnchor = sessionAnchor?.topic
    ? `Current engineering topic: ${sessionAnchor.topic}.`
    : "";

  const augmentedBase = augmentMessageForIntent(
    userMessage,
    detectedIntent,
    lastUserQuestion,
    lastAssistantSummary
  );

  const augmentedUserMessage =
    detectedIntent !== "none" && topicAnchor && !lastUserQuestion
      ? `${augmentedBase}\n\n[Session context: ${topicAnchor}]`
      : augmentedBase;

  return {
    conversationId,
    history,
    lastUserQuestion,
    lastAssistantSummary,
    detectedIntent,
    augmentedUserMessage,
  };
};
