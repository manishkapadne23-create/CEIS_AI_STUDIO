import type { EngineeringAIProvider } from "../providerInterface";

const createUnavailableProvider = (
  id: EngineeringAIProvider["id"],
  label: string
): EngineeringAIProvider => ({
  id,
  label,
  isConfigured: () => false,
  complete: async () => {
    throw new Error(
      `${label} is not configured. Connect provider credentials in a future release.`
    );
  },
});

export const openAIProvider = createUnavailableProvider("openai", "OpenAI");
export const ollamaProvider = createUnavailableProvider("ollama", "Ollama");
export const geminiProvider = createUnavailableProvider("gemini", "Gemini");
export const claudeProvider = createUnavailableProvider("claude", "Claude");
export const azureOpenAIProvider = createUnavailableProvider(
  "azure-openai",
  "Azure OpenAI"
);
export const localLLMProvider = createUnavailableProvider(
  "local-llm",
  "Local LLM"
);
export const lmStudioProvider = createUnavailableProvider(
  "lm-studio",
  "LM Studio"
);

export { stubEngineeringAIProvider } from "./stubProvider";
