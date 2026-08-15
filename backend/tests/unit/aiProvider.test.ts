import { describe, expect, it } from "vitest";

import { getFailoverChain, loadAdminSettings } from "../../src/ai/adminSettings.js";
import { buildPrompt } from "../../src/ai/promptEngine.js";
import { normalizeAIResponse } from "../../src/ai/responseFormatter.js";
import { buildTokenUsage } from "../../src/ai/tokenManager.js";
import { getAdapter, providerAdapters } from "../../src/ai/providerRegistry.js";

describe("AI Provider Layer", () => {
  it("loads admin settings with provider configs", () => {
    const settings = loadAdminSettings();
    expect(settings.primaryProvider).toBeTruthy();
    expect(settings.providers.openai).toBeDefined();
    expect(settings.providers.ollama.enabled).toBe(true);
  });

  it("builds failover chain without duplicates", () => {
    const settings = loadAdminSettings();
    const chain = getFailoverChain(settings);
    expect(chain.length).toBe(new Set(chain).size);
    expect(chain[0]).toBe(settings.primaryProvider);
  });

  it("builds structured prompts with discipline context", () => {
    const prompt = buildPrompt({
      systemPrompt: "Module-specific guidance",
      userMessage: "Design a footing",
      disciplineName: "Civil Engineering",
      disciplineId: "civil",
    });

    expect(prompt.systemPrompt).toContain("Civil Engineering");
    expect(prompt.fullPrompt).toContain("Design a footing");
  });

  it("normalizes provider responses into standard sections", () => {
    const usage = buildTokenUsage("openai", "input", "output");
    const normalized = normalizeAIResponse(
      "## Summary\nTest summary\n\n## Recommendations\n- Item one",
      "openai",
      "gpt-4o-mini",
      usage,
      120,
      false,
      ["openai"],
      "test question",
      "Civil Engineering"
    );

    expect(normalized.title).toContain("Civil Engineering");
    expect(normalized.summary).toContain("Test summary");
    expect(normalized.recommendations).toContain("Item one");
    expect(normalized.followUpSuggestions.length).toBeGreaterThan(0);
  });

  it("registers all supported provider adapters", () => {
    expect(providerAdapters.length).toBeGreaterThanOrEqual(6);
    expect(getAdapter("openai")?.id).toBe("openai");
    expect(getAdapter("gemini")?.id).toBe("gemini");
    expect(getAdapter("claude")?.id).toBe("claude");
    expect(getAdapter("ollama")?.id).toBe("ollama");
  });
});
