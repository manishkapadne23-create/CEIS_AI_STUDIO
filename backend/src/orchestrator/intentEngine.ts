import { loadIntentConfig } from "./loadOrchestratorConfig.js";
import type { EoeIntentDetection, EoeIntentId } from "./types.js";

export const detectIntent = (message: string): EoeIntentDetection => {
  const normalized = message.trim();
  const intents = loadIntentConfig();
  const matches: Array<{
    id: EoeIntentId;
    label: string;
    priority: number;
    phrase: string;
  }> = [];

  for (const intent of intents) {
    for (const patternSource of intent.patterns) {
      const pattern = new RegExp(patternSource, "i");
      const match = normalized.match(pattern);
      if (match) {
        matches.push({
          id: intent.id as EoeIntentId,
          label: intent.label,
          priority: intent.priority,
          phrase: match[0],
        });
      }
    }
  }

  if (matches.length === 0) {
    return {
      primaryIntent: "question",
      secondaryIntents: [],
      intentLabel: "Question",
      confidence: 0.5,
      triggerPhrase: null,
    };
  }

  matches.sort((left, right) => right.priority - left.priority);
  const primary = matches[0];

  const secondaryIntents = [
    ...new Set(
      matches
        .slice(1)
        .map((match) => match.id)
        .filter((intentId) => intentId !== primary.id)
    ),
  ];

  return {
    primaryIntent: primary.id,
    secondaryIntents,
    intentLabel: primary.label,
    confidence: Math.min(primary.priority / 10, 1),
    triggerPhrase: primary.phrase,
  };
};
