import type { EngineeringAIProvider, EngineeringAIProviderId } from "./types";

const providers = new Map<EngineeringAIProviderId, EngineeringAIProvider>();

export const registerEngineeringAIProvider = (
  provider: EngineeringAIProvider
): void => {
  providers.set(provider.id, provider);
};

export const getEngineeringAIProvider = (
  providerId: EngineeringAIProviderId
): EngineeringAIProvider | undefined => providers.get(providerId);

export const listEngineeringAIProviders = (): EngineeringAIProvider[] =>
  Array.from(providers.values());

export const getDefaultEngineeringAIProvider = (): EngineeringAIProvider => {
  const backend = providers.get("backend");
  if (backend) {
    return backend;
  }

  const stub = providers.get("stub");

  if (!stub) {
    throw new Error("Engineering AI stub provider is not registered.");
  }

  return stub;
};
