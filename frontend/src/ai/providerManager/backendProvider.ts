import { injectAIContext } from "../contextInjector/injectAIContext";
import type {
  EngineeringAICompletionRequest,
  EngineeringAIProvider,
} from "../providerInterface";
import { trackResponseUsage } from "../tokenManager/clientTokenManager";
import { getAiApiBaseUrl } from "./config";
import type {
  NormalizedAIResponse,
  ProviderHealth,
  StreamChunk,
} from "./types";

interface CompleteApiResponse {
  success: boolean;
  data?: {
    markdown: string;
    response: NormalizedAIResponse;
  };
  error?: { message: string };
}

export const fetchProviderHealth = async (): Promise<ProviderHealth[]> => {
  const response = await fetch(`${getAiApiBaseUrl()}/providers/health`);
  if (!response.ok) {
    throw new Error("Unable to fetch provider health.");
  }

  const payload = (await response.json()) as {
    data?: { providers: ProviderHealth[] };
  };
  return payload.data?.providers ?? [];
};

export const completeViaBackend = async (
  request: EngineeringAICompletionRequest,
  signal?: AbortSignal
): Promise<NormalizedAIResponse> => {
  const body = injectAIContext(request);
  const response = await fetch(`${getAiApiBaseUrl()}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`AI completion failed (${response.status}).`);
  }

  const payload = (await response.json()) as CompleteApiResponse;
  if (!payload.data?.response) {
    throw new Error(payload.error?.message ?? "Invalid AI response payload.");
  }

  trackResponseUsage(payload.data.response);
  return payload.data.response;
};

export const streamViaBackend = async function* (
  request: EngineeringAICompletionRequest,
  signal?: AbortSignal
): AsyncGenerator<StreamChunk> {
  const body = injectAIContext(request);
  const response = await fetch(`${getAiApiBaseUrl()}/complete/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`AI stream failed (${response.status}).`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) {
        continue;
      }

      const chunk = JSON.parse(line.slice(6)) as StreamChunk;
      if (chunk.type === "done" && chunk.response) {
        trackResponseUsage(chunk.response);
      }
      yield chunk;
    }
  }
};

export const backendAIProvider: EngineeringAIProvider = {
  id: "backend",
  label: "Sarathi AI Provider Layer",
  isConfigured: () => true,
  complete: async (request) => {
    const normalized = await completeViaBackend(request);
    return {
      content: normalized.detailedResponse || normalized.rawContent,
      providerId: normalized.providerId,
      model: normalized.model,
      usedStub: false,
      normalized,
    };
  },
};
