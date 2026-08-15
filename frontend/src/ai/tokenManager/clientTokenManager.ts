import type { NormalizedAIResponse, TokenUsage } from "../providerManager/types";

const usageHistory: TokenUsage[] = [];

export const recordClientTokenUsage = (usage: TokenUsage): void => {
  usageHistory.push(usage);
  if (usageHistory.length > 100) {
    usageHistory.shift();
  }
};

export const getClientTokenUsageSummary = (): {
  totalRequests: number;
  totalTokens: number;
  estimatedCostUsd: number;
} => {
  const totalTokens = usageHistory.reduce((sum, item) => sum + item.totalTokens, 0);
  const estimatedCostUsd = usageHistory.reduce(
    (sum, item) => sum + item.estimatedCostUsd,
    0
  );

  return {
    totalRequests: usageHistory.length,
    totalTokens,
    estimatedCostUsd: Math.round(estimatedCostUsd * 1_000_000) / 1_000_000,
  };
};

export const trackResponseUsage = (response: NormalizedAIResponse): void => {
  recordClientTokenUsage(response.usage);
};
