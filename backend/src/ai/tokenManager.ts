import { auditLogger } from "../infrastructure/logger/index.js";
import type { AIProviderId, TokenUsage } from "./types.js";

const COST_PER_1K: Partial<Record<AIProviderId, { input: number; output: number }>> = {
  openai: { input: 0.00015, output: 0.0006 },
  "azure-openai": { input: 0.00015, output: 0.0006 },
  gemini: { input: 0.000075, output: 0.0003 },
  claude: { input: 0.003, output: 0.015 },
  ollama: { input: 0, output: 0 },
  "lm-studio": { input: 0, output: 0 },
  "local-llm": { input: 0, output: 0 },
  custom: { input: 0, output: 0 },
};

export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / 4);

export const buildTokenUsage = (
  providerId: AIProviderId,
  inputText: string,
  outputText: string,
  reportedInput?: number,
  reportedOutput?: number
): TokenUsage => {
  const inputTokens = reportedInput ?? estimateTokens(inputText);
  const outputTokens = reportedOutput ?? estimateTokens(outputText);
  const rates = COST_PER_1K[providerId] ?? { input: 0, output: 0 };
  const estimatedCostUsd =
    (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCostUsd: Math.round(estimatedCostUsd * 1_000_000) / 1_000_000,
  };
};

export const recordTokenUsage = (
  providerId: AIProviderId,
  usage: TokenUsage,
  responseTimeMs: number,
  userId?: string
): void => {
  auditLogger.info("ai.token_usage", {
    providerId,
    ...usage,
    responseTimeMs,
    userId,
  });
};
