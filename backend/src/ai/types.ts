export type AIProviderId =
  | "openai"
  | "azure-openai"
  | "gemini"
  | "claude"
  | "ollama"
  | "lm-studio"
  | "local-llm"
  | "custom";

export interface AIProviderConfig {
  id: AIProviderId;
  label: string;
  enabled: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
  retryCount: number;
  apiKeyEnvVar?: string;
  baseUrl?: string;
}

export interface AICompletionRequest {
  systemPrompt: string;
  userMessage: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
  disciplineId?: string | null;
  disciplineName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  moduleId?: string | null;
  moduleTitle?: string | null;
  projectContext?: string | null;
  language?: string;
  subscriptionPlan?: string;
  memorySummary?: string | null;
  knowledgeReferences?: string[];
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface NormalizedAIResponse {
  title: string;
  summary: string;
  detailedResponse: string;
  recommendations: string[];
  standards: string[];
  references: string[];
  followUpSuggestions: string[];
  rawContent: string;
  providerId: AIProviderId;
  model: string;
  usage: TokenUsage;
  responseTimeMs: number;
  usedFallback: boolean;
  fallbackChain: AIProviderId[];
}

export interface ProviderHealth {
  id: AIProviderId;
  label: string;
  status: "healthy" | "degraded" | "unavailable";
  configured: boolean;
  latencyMs?: number;
  message?: string;
}

export interface AIAdminSettings {
  primaryProvider: AIProviderId;
  secondaryProvider: AIProviderId;
  emergencyFallback: AIProviderId;
  fallbackOrder: AIProviderId[];
  defaultTemperature: number;
  defaultMaxTokens: number;
  defaultTimeoutMs: number;
  defaultRetryCount: number;
  providers: Record<AIProviderId, AIProviderConfig>;
}

export interface StreamChunk {
  type: "token" | "done" | "error";
  content?: string;
  response?: NormalizedAIResponse;
  error?: string;
}
