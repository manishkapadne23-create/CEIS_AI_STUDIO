import axios from "axios";
import OpenAI from "openai";

import { aiLogger } from "../infrastructure/logger/index.js";
import type { AIProviderConfig, AIProviderId } from "./types.js";
import { buildPrompt } from "./promptEngine.js";
import type { AICompletionRequest } from "./types.js";
import { buildTokenUsage } from "./tokenManager.js";

export interface ProviderCompletionResult {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface AIProviderAdapter {
  id: AIProviderId;
  label: string;
  isConfigured: (config: AIProviderConfig) => boolean;
  complete: (
    request: AICompletionRequest,
    config: AIProviderConfig
  ) => Promise<ProviderCompletionResult>;
  healthCheck: (config: AIProviderConfig) => Promise<boolean>;
}

const getApiKey = (config: AIProviderConfig): string | undefined =>
  config.apiKeyEnvVar ? process.env[config.apiKeyEnvVar] : undefined;

export const openaiAdapter: AIProviderAdapter = {
  id: "openai",
  label: "OpenAI",
  isConfigured: (config) => Boolean(getApiKey(config)),
  complete: async (request, config) => {
    const client = new OpenAI({ apiKey: getApiKey(config) });
    const { systemPrompt, userMessage } = buildPrompt(request);
    const response = await client.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        ...(request.conversationHistory ?? []).slice(-10).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ],
    });
    const content = response.choices[0]?.message?.content ?? "";
    return {
      content,
      model: response.model,
      inputTokens: response.usage?.prompt_tokens,
      outputTokens: response.usage?.completion_tokens,
    };
  },
  healthCheck: async (config) => {
    try {
      const client = new OpenAI({ apiKey: getApiKey(config) });
      await client.models.list();
      return true;
    } catch {
      return false;
    }
  },
};

export const geminiAdapter: AIProviderAdapter = {
  id: "gemini",
  label: "Google Gemini",
  isConfigured: (config) => Boolean(getApiKey(config)),
  complete: async (request, config) => {
    const key = getApiKey(config)!;
    const { fullPrompt } = buildPrompt(request);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${key}`;
    const response = await axios.post(
      url,
      { contents: [{ parts: [{ text: fullPrompt }] }] },
      { timeout: config.timeoutMs }
    );
    const content =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const usage = buildTokenUsage("gemini", fullPrompt, content);
    return { content, model: config.model, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens };
  },
  healthCheck: async (config) => Boolean(getApiKey(config)),
};

export const claudeAdapter: AIProviderAdapter = {
  id: "claude",
  label: "Anthropic Claude",
  isConfigured: (config) => Boolean(getApiKey(config)),
  complete: async (request, config) => {
    const key = getApiKey(config)!;
    const { systemPrompt, userMessage } = buildPrompt(request);
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: config.model,
        max_tokens: config.maxTokens,
        system: systemPrompt,
        messages: [
          ...(request.conversationHistory ?? []).slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        timeout: config.timeoutMs,
      }
    );
    const content = response.data?.content?.[0]?.text ?? "";
    return {
      content,
      model: config.model,
      inputTokens: response.data?.usage?.input_tokens,
      outputTokens: response.data?.usage?.output_tokens,
    };
  },
  healthCheck: async (config) => Boolean(getApiKey(config)),
};

export const ollamaAdapter: AIProviderAdapter = {
  id: "ollama",
  label: "Ollama",
  isConfigured: () => true,
  complete: async (request, config) => {
    const { fullPrompt } = buildPrompt(request);
    const baseUrl = config.baseUrl ?? "http://localhost:11434";
    const response = await axios.post(
      `${baseUrl}/api/generate`,
      { model: config.model, prompt: fullPrompt, stream: false },
      { timeout: config.timeoutMs }
    );
    return { content: response.data?.response ?? "", model: config.model };
  },
  healthCheck: async (config) => {
    try {
      const baseUrl = config.baseUrl ?? "http://localhost:11434";
      await axios.get(`${baseUrl}/api/tags`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },
};

const openAiCompatibleAdapter = (
  id: AIProviderId,
  label: string,
  defaultUrl: string
): AIProviderAdapter => ({
  id,
  label,
  isConfigured: (config) => Boolean(config.baseUrl),
  complete: async (request, config) => {
    const baseUrl = (config.baseUrl ?? defaultUrl).replace(/\/$/, "");
    const { systemPrompt, userMessage } = buildPrompt(request);
    const response = await axios.post(
      `${baseUrl}/v1/chat/completions`,
      {
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: getApiKey(config) ? { Authorization: `Bearer ${getApiKey(config)}` } : {},
        timeout: config.timeoutMs,
      }
    );
    const content = response.data?.choices?.[0]?.message?.content ?? "";
    return {
      content,
      model: config.model,
      inputTokens: response.data?.usage?.prompt_tokens,
      outputTokens: response.data?.usage?.completion_tokens,
    };
  },
  healthCheck: async (config) => {
    try {
      const baseUrl = (config.baseUrl ?? defaultUrl).replace(/\/$/, "");
      await axios.get(`${baseUrl}/v1/models`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },
});

export const azureOpenaiAdapter: AIProviderAdapter = {
  id: "azure-openai",
  label: "Azure OpenAI",
  isConfigured: (config) => Boolean(getApiKey(config) && config.baseUrl),
  complete: async (request, config) => {
    const key = getApiKey(config)!;
    const endpoint = config.baseUrl!.replace(/\/$/, "");
    const { systemPrompt, userMessage } = buildPrompt(request);
    const url = `${endpoint}/openai/deployments/${config.model}/chat/completions?api-version=2024-02-15-preview`;
    const response = await axios.post(
      url,
      {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      },
      {
        headers: { "api-key": key, "content-type": "application/json" },
        timeout: config.timeoutMs,
      }
    );
    const content = response.data?.choices?.[0]?.message?.content ?? "";
    return {
      content,
      model: config.model,
      inputTokens: response.data?.usage?.prompt_tokens,
      outputTokens: response.data?.usage?.completion_tokens,
    };
  },
  healthCheck: async (config) => Boolean(getApiKey(config) && config.baseUrl),
};

export const lmStudioAdapter = openAiCompatibleAdapter(
  "lm-studio",
  "LM Studio",
  "http://localhost:1234"
);

export const localLlmAdapter = openAiCompatibleAdapter(
  "local-llm",
  "Local LLM",
  "http://localhost:8080"
);

export const customAdapter: AIProviderAdapter = {
  ...openAiCompatibleAdapter("custom", "Custom Model", "http://localhost:8080"),
};

export const providerAdapters: AIProviderAdapter[] = [
  openaiAdapter,
  azureOpenaiAdapter,
  geminiAdapter,
  claudeAdapter,
  ollamaAdapter,
  lmStudioAdapter,
  localLlmAdapter,
  customAdapter,
];

export const getAdapter = (id: AIProviderId): AIProviderAdapter | undefined =>
  providerAdapters.find((a) => a.id === id);
