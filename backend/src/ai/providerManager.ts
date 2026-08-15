import { aiLogger, auditLogger } from "../infrastructure/logger/index.js";
import { withRetry } from "../infrastructure/retry/index.js";
import { getFailoverChain, loadAdminSettings } from "./adminSettings.js";
import { buildPrompt } from "./promptEngine.js";
import { providerAdapters, getAdapter } from "./providerRegistry.js";
import { formatNormalizedAsMarkdown, normalizeAIResponse } from "./responseFormatter.js";
import { buildTokenUsage, recordTokenUsage } from "./tokenManager.js";
import type {
  AICompletionRequest,
  AIProviderId,
  NormalizedAIResponse,
  ProviderHealth,
} from "./types.js";

const FALLBACK_CONTENT = `Sarathi AI is temporarily unable to reach any configured AI provider.

Your engineering context has been preserved. Please try again shortly, or ensure at least one provider (Ollama, OpenAI, Gemini, or Claude) is configured on the server.

While offline, Sarathi AI modules (workflows, standards, calculators, estimation, tender intelligence, etc.) remain available through the chat interface.`;

export const checkProviderHealth = async (): Promise<ProviderHealth[]> => {
  const settings = loadAdminSettings();
  const results: ProviderHealth[] = [];

  for (const adapter of providerAdapters) {
    const config = settings.providers[adapter.id];
    if (!config) continue;

    const start = Date.now();
    try {
      const healthy = await adapter.healthCheck(config);
      results.push({
        id: config.id,
        label: config.label,
        status: healthy ? "healthy" : "unavailable",
        configured: adapter.isConfigured(config),
        latencyMs: Date.now() - start,
      });
    } catch (error) {
      results.push({
        id: config.id,
        label: config.label,
        status: "unavailable",
        configured: adapter.isConfigured(config),
        message: error instanceof Error ? error.message : "Health check failed",
      });
    }
  }

  return results;
};

export const completeWithFailover = async (
  request: AICompletionRequest,
  userId?: string
): Promise<NormalizedAIResponse> => {
  const settings = loadAdminSettings();
  const chain = getFailoverChain(settings);
  const attempted: AIProviderId[] = [];
  const startTime = Date.now();

  for (let i = 0; i < chain.length; i++) {
    const providerId = chain[i];
    const config = settings.providers[providerId];
    const adapter = getAdapter(providerId);

    if (!adapter || !config?.enabled) continue;
    if (!adapter.isConfigured(config)) continue;

    attempted.push(providerId);

    try {
      const providerStart = Date.now();
      const result = await withRetry(
        () => adapter.complete(request, config),
        { attempts: config.retryCount, delayMs: 1000 }
      );

      if (!result.content?.trim()) {
        throw new Error("Empty response from provider");
      }

      const { fullPrompt } = buildPrompt(request);
      const usage = buildTokenUsage(
        providerId,
        fullPrompt,
        result.content,
        result.inputTokens,
        result.outputTokens
      );
      const responseTimeMs = Date.now() - providerStart;

      recordTokenUsage(providerId, usage, responseTimeMs, userId);

      auditLogger.info("ai.completion", {
        providerId,
        model: result.model,
        usedFallback: i > 0,
        fallbackChain: attempted,
        tokens: usage.totalTokens,
        responseTimeMs,
        userId,
      });

      if (i > 0) {
        aiLogger.info("Failover succeeded", { providerId, attempted });
      }

      return normalizeAIResponse(
        result.content,
        providerId,
        result.model,
        usage,
        responseTimeMs,
        i > 0,
        attempted,
        request.userMessage,
        request.disciplineName
      );
    } catch (error) {
      aiLogger.error("Provider failed", {
        providerId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const usage = buildTokenUsage("ollama", request.userMessage, FALLBACK_CONTENT);
  return normalizeAIResponse(
    FALLBACK_CONTENT,
    "ollama",
    "fallback",
    usage,
    Date.now() - startTime,
    true,
    attempted,
    request.userMessage,
    request.disciplineName
  );
};

export const completeToMarkdown = async (
  request: AICompletionRequest,
  userId?: string
): Promise<{ markdown: string; response: NormalizedAIResponse }> => {
  const response = await completeWithFailover(request, userId);
  return {
    markdown: formatNormalizedAsMarkdown(response),
    response,
  };
};
