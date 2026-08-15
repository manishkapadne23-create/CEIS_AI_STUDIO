export type BackendAIProviderId =
  | "openai"
  | "azure-openai"
  | "gemini"
  | "claude"
  | "ollama"
  | "lm-studio"
  | "local-llm"
  | "custom";

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
  providerId: BackendAIProviderId;
  model: string;
  usage: TokenUsage;
  responseTimeMs: number;
  usedFallback: boolean;
  fallbackChain: BackendAIProviderId[];
}

export interface ProviderHealth {
  id: BackendAIProviderId;
  label: string;
  status: "healthy" | "degraded" | "unavailable";
  configured: boolean;
  latencyMs?: number;
  message?: string;
}

export interface AICompleteRequest {
  message: string;
  systemPrompt?: string;
  domainId?: string | null;
  domainName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  moduleId?: string | null;
  moduleTitle?: string | null;
  projectContext?: string | null;
  language?: string;
  subscriptionPlan?: string;
  memorySummary?: string | null;
  knowledgeReferences?: string[];
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface StreamChunk {
  type: "token" | "done" | "error";
  content?: string;
  response?: NormalizedAIResponse;
  error?: string;
}
