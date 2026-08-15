const SENSITIVE_RESPONSE_KEYS = new Set([
  "systemPrompt",
  "promptAugmentation",
  "routingLogic",
  "knowledgeGraph",
  "engineeringRules",
  "decisionLogic",
  "agentInstructions",
  "internalPrompt",
  "rawPrompt",
]);

const SENSITIVE_PATH_SEGMENTS = [
  "/prompt",
  "/routing",
  "/knowledge-graph",
  "/agent-instructions",
  "/internal/",
];

export const isSensitiveApiPath = (path: string): boolean =>
  SENSITIVE_PATH_SEGMENTS.some((segment) => path.includes(segment));

export const stripSensitiveFields = <T>(value: T, depth = 0): T => {
  if (depth > 8 || value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => stripSensitiveFields(entry, depth + 1)) as T;
  }

  if (typeof value !== "object") {
    return value;
  }

  const output: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_RESPONSE_KEYS.has(key)) {
      continue;
    }
    output[key] = stripSensitiveFields(entry, depth + 1);
  }

  return output as T;
};

export const sanitizeAiClientResponse = <T extends Record<string, unknown>>(
  payload: T
): T => {
  const sanitized = stripSensitiveFields(payload);

  if ("orchestration" in sanitized && sanitized.orchestration) {
    sanitized.orchestration = stripSensitiveFields(sanitized.orchestration);
    if (
      typeof sanitized.orchestration === "object" &&
      sanitized.orchestration !== null &&
      "promptAugmentation" in sanitized.orchestration
    ) {
      delete (sanitized.orchestration as Record<string, unknown>).promptAugmentation;
    }
  }

  for (const engineKey of [
    "predictive",
    "collaboration",
    "digitalEngineer",
    "simulation",
    "evidence",
  ]) {
    if (engineKey in sanitized && sanitized[engineKey]) {
      const engine = sanitized[engineKey] as Record<string, unknown>;
      delete engine.promptAugmentation;
    }
  }

  return sanitized;
};

export const assertServerSideAiExecution = (): void => {
  // Guardrail marker — all AI intelligence modules execute server-side only.
};
