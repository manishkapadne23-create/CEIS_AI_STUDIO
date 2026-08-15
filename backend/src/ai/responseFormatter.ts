import type { AIProviderId, NormalizedAIResponse, TokenUsage } from "./types.js";

const extractSection = (content: string, header: string): string => {
  const regex = new RegExp(`(?:^|\\n)#+\\s*${header}[:\\s]*([\\s\\S]*?)(?=\\n#+|$)`, "i");
  const match = content.match(regex);
  return match?.[1]?.trim() ?? "";
};

const extractBullets = (text: string): string[] =>
  text
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter((l) => l.length > 0);

export const normalizeAIResponse = (
  rawContent: string,
  providerId: AIProviderId,
  model: string,
  usage: TokenUsage,
  responseTimeMs: number,
  usedFallback: boolean,
  fallbackChain: AIProviderId[],
  userMessage: string,
  disciplineName?: string | null
): NormalizedAIResponse => {
  const summary =
    extractSection(rawContent, "Summary") ||
    rawContent.split("\n").find((l) => l.trim().length > 20)?.trim() ||
    rawContent.slice(0, 300);

  const recommendations = extractBullets(
    extractSection(rawContent, "Recommendations") ||
      extractSection(rawContent, "Practical Recommendations")
  );

  const standards = extractBullets(
    extractSection(rawContent, "Standards") ||
      extractSection(rawContent, "Applicable Standards")
  );

  const references = extractBullets(extractSection(rawContent, "References"));

  const followUp = extractBullets(
    extractSection(rawContent, "Follow-up") ||
      extractSection(rawContent, "Follow up Suggestions")
  );

  const title = disciplineName
    ? `${disciplineName} — Engineering Guidance`
    : "Sarathi AI Engineering Response";

  if (recommendations.length === 0 && rawContent.length > 100) {
    recommendations.push("Review the detailed response and validate against project specifications.");
  }

  if (followUp.length === 0) {
    followUp.push("Would you like a more detailed calculation or standard reference?");
  }

  return {
    title,
    summary,
    detailedResponse: rawContent,
    recommendations,
    standards,
    references,
    followUpSuggestions: followUp,
    rawContent,
    providerId,
    model,
    usage,
    responseTimeMs,
    usedFallback,
    fallbackChain,
  };
};

export const formatNormalizedAsMarkdown = (response: NormalizedAIResponse): string =>
  [
    `# ${response.title}`,
    "",
    `## Summary\n${response.summary}`,
    "",
    `## Detailed Response\n${response.detailedResponse}`,
    response.recommendations.length > 0
      ? `## Recommendations\n${response.recommendations.map((r) => `- ${r}`).join("\n")}`
      : "",
    response.standards.length > 0
      ? `## Standards\n${response.standards.map((s) => `- ${s}`).join("\n")}`
      : "",
    response.references.length > 0
      ? `## References\n${response.references.map((r) => `- ${r}`).join("\n")}`
      : "",
    response.followUpSuggestions.length > 0
      ? `## Follow-up Suggestions\n${response.followUpSuggestions.map((f) => `- ${f}`).join("\n")}`
      : "",
    "",
    `---`,
    `*Provider: ${response.providerId} | Model: ${response.model} | Tokens: ${response.usage.totalTokens} | ${response.responseTimeMs}ms*`,
  ]
    .filter(Boolean)
    .join("\n");
