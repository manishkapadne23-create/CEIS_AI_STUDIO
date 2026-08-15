import { stubEngineeringAIProvider } from "../futureProviders";
import {
  getDefaultEngineeringAIProvider,
  getEngineeringAIProvider,
  registerEngineeringAIProvider,
  type EngineeringAICompletionRequest,
  type EngineeringAICompletionResponse,
  type EngineeringAIProviderId,
} from "../providerInterface";
import { backendAIProvider, completeViaBackend, streamViaBackend } from "./backendProvider";
import type { NormalizedAIResponse, StreamChunk } from "./types";

let managerInitialized = false;

export const initializeProviderManager = (): void => {
  if (managerInitialized) {
    return;
  }

  registerEngineeringAIProvider(backendAIProvider);
  managerInitialized = true;
};

export const completeWithProviderFailover = async (
  request: EngineeringAICompletionRequest,
  preferredProviderId?: EngineeringAIProviderId,
  signal?: AbortSignal
): Promise<EngineeringAICompletionResponse> => {
  initializeProviderManager();

  if (
    preferredProviderId &&
    preferredProviderId !== "backend" &&
    preferredProviderId !== "stub"
  ) {
    const provider = getEngineeringAIProvider(preferredProviderId);
    if (provider?.isConfigured()) {
      try {
        return await provider.complete(request);
      } catch {
        // fall through to backend layer
      }
    }
  }

  try {
    const normalized = await completeViaBackend(request, signal);
    return {
      content: normalized.detailedResponse || normalized.rawContent,
      providerId: normalized.providerId,
      model: normalized.model,
      usedStub: false,
      normalized,
    };
  } catch {
    const stub = getDefaultEngineeringAIProvider();
    if (stub.id !== "stub") {
      return stub.complete(request);
    }
    return stubEngineeringAIProvider.complete(request);
  }
};

export const streamWithProviderFailover = (
  request: EngineeringAICompletionRequest,
  signal?: AbortSignal
): AsyncGenerator<StreamChunk> => streamViaBackend(request, signal);

export const getNormalizedResponse = async (
  request: EngineeringAICompletionRequest,
  signal?: AbortSignal
): Promise<NormalizedAIResponse> => completeViaBackend(request, signal);
