import { config } from "../config/index.js";
import type { AIAdminSettings, AIProviderConfig, AIProviderId } from "./types.js";

const DEFAULT_PROVIDER_CONFIG = (
  id: AIProviderId,
  label: string,
  model: string,
  apiKeyEnvVar?: string,
  baseUrl?: string
): AIProviderConfig => ({
  id,
  label,
  enabled: Boolean(apiKeyEnvVar ? process.env[apiKeyEnvVar] : baseUrl),
  model,
  temperature: Number(process.env.AI_TEMPERATURE ?? 0.7),
  maxTokens: Number(process.env.AI_MAX_TOKENS ?? 4096),
  timeoutMs: config.ai.timeoutMs,
  retryCount: config.ai.retryAttempts,
  apiKeyEnvVar,
  baseUrl,
});

const parseFallbackOrder = (): AIProviderId[] => {
  const raw = process.env.AI_FALLBACK_ORDER;
  if (raw) {
    return raw.split(",").map((s) => s.trim()) as AIProviderId[];
  }
  return ["openai", "gemini", "claude", "ollama", "lm-studio", "local-llm"];
};

export const loadAdminSettings = (): AIAdminSettings => ({
  primaryProvider: (process.env.AI_PRIMARY_PROVIDER ?? "openai") as AIProviderId,
  secondaryProvider: (process.env.AI_SECONDARY_PROVIDER ?? "gemini") as AIProviderId,
  emergencyFallback: (process.env.AI_EMERGENCY_FALLBACK ?? "ollama") as AIProviderId,
  fallbackOrder: parseFallbackOrder(),
  defaultTemperature: Number(process.env.AI_TEMPERATURE ?? 0.7),
  defaultMaxTokens: Number(process.env.AI_MAX_TOKENS ?? 4096),
  defaultTimeoutMs: config.ai.timeoutMs,
  defaultRetryCount: config.ai.retryAttempts,
  providers: {
    openai: DEFAULT_PROVIDER_CONFIG("openai", "OpenAI", process.env.OPENAI_MODEL ?? "gpt-4o-mini", "OPENAI_API_KEY"),
    "azure-openai": DEFAULT_PROVIDER_CONFIG(
      "azure-openai",
      "Azure OpenAI",
      process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-4o",
      "AZURE_OPENAI_API_KEY",
      process.env.AZURE_OPENAI_ENDPOINT
    ),
    gemini: DEFAULT_PROVIDER_CONFIG("gemini", "Google Gemini", process.env.GEMINI_MODEL ?? "gemini-1.5-flash", "GEMINI_API_KEY"),
    claude: DEFAULT_PROVIDER_CONFIG("claude", "Anthropic Claude", process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-20241022", "ANTHROPIC_API_KEY"),
    ollama: {
      ...DEFAULT_PROVIDER_CONFIG("ollama", "Ollama", config.ai.model, undefined, config.ai.ollamaUrl.replace("/api/generate", "")),
      enabled: true,
    },
    "lm-studio": DEFAULT_PROVIDER_CONFIG("lm-studio", "LM Studio", process.env.LM_STUDIO_MODEL ?? "local-model", undefined, process.env.LM_STUDIO_URL ?? "http://localhost:1234"),
    "local-llm": DEFAULT_PROVIDER_CONFIG("local-llm", "Local LLM", process.env.LOCAL_LLM_MODEL ?? "local", undefined, process.env.LOCAL_LLM_URL ?? "http://localhost:8080"),
    custom: DEFAULT_PROVIDER_CONFIG("custom", "Custom Model", process.env.CUSTOM_MODEL ?? "custom", "CUSTOM_API_KEY", process.env.CUSTOM_API_URL),
  },
});

export const getFailoverChain = (settings: AIAdminSettings): AIProviderId[] => {
  const chain: AIProviderId[] = [
    settings.primaryProvider,
    settings.secondaryProvider,
    settings.emergencyFallback,
    ...settings.fallbackOrder,
  ];
  return [...new Set(chain)];
};

export const getPublicAdminSettings = (settings: AIAdminSettings) => ({
  primaryProvider: settings.primaryProvider,
  secondaryProvider: settings.secondaryProvider,
  emergencyFallback: settings.emergencyFallback,
  fallbackOrder: settings.fallbackOrder,
  defaultTemperature: settings.defaultTemperature,
  defaultMaxTokens: settings.defaultMaxTokens,
  defaultTimeoutMs: settings.defaultTimeoutMs,
  defaultRetryCount: settings.defaultRetryCount,
  providers: Object.fromEntries(
    Object.entries(settings.providers).map(([id, p]) => [
      id,
      {
        id: p.id,
        label: p.label,
        enabled: p.enabled,
        model: p.model,
        configured: p.enabled,
      },
    ])
  ),
});
