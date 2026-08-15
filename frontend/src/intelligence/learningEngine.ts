import type {
  LearningResourceType,
  RecordInteractionInput,
  UsageRecord,
} from "./types";

const STORAGE_KEY = "sarathi.intelligence.learning";

let usageStore: UsageRecord[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    usageStore = raw ? (JSON.parse(raw) as UsageRecord[]) : [];
  } catch {
    usageStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usageStore.slice(0, 500)));
};

const upsertUsage = (
  type: LearningResourceType,
  resourceId: string,
  label: string,
  disciplineId: string | null,
  moduleId: UsageRecord["moduleId"]
): void => {
  hydrate();
  const key = `${type}:${resourceId}`;
  const existing = usageStore.find(
    (r) => `${r.type}:${r.resourceId}` === key
  );

  if (existing) {
    existing.count += 1;
    existing.lastUsedAt = Date.now();
    existing.label = label;
  } else {
    usageStore.push({
      id: crypto.randomUUID(),
      type,
      resourceId,
      label,
      disciplineId,
      moduleId,
      count: 1,
      lastUsedAt: Date.now(),
    });
  }
  persist();
};

const FAQ_PATTERNS = [
  /^(what|how|why|when|where|explain|define)\b/i,
  /\?$/,
];

export const recordInteraction = (input: RecordInteractionInput): void => {
  hydrate();

  if (input.sessionTopic) {
    upsertUsage(
      "faq",
      input.sessionTopic.toLowerCase().replace(/\s+/g, "-"),
      input.sessionTopic,
      input.disciplineId,
      input.moduleId
    );
  }

  if (FAQ_PATTERNS.some((p) => p.test(input.userMessage))) {
    const topic =
      input.userMessage.trim().slice(0, 80) || "general-question";
    upsertUsage("faq", topic.toLowerCase(), topic, input.disciplineId, input.moduleId);
  }

  if (input.moduleId) {
    upsertUsage(
      "module",
      input.moduleId,
      input.moduleId,
      input.disciplineId,
      input.moduleId
    );
  }

  for (const standard of input.standardsUsed ?? []) {
    upsertUsage("standard", standard, standard, input.disciplineId, "standards");
  }

  for (const calculator of input.calculatorsUsed ?? []) {
    upsertUsage(
      "calculator",
      calculator,
      calculator,
      input.disciplineId,
      "calculators"
    );
  }

  for (const workflow of input.workflowsUsed ?? []) {
    upsertUsage(
      "workflow",
      workflow,
      workflow,
      input.disciplineId,
      "professional-tools"
    );
  }

  if (/\b(document|drawing|pdf|upload)\b/i.test(input.userMessage)) {
    upsertUsage(
      "document",
      "document-query",
      "Document interaction",
      input.disciplineId,
      "documents"
    );
  }

  if (/\b(learn|tutorial|course|training)\b/i.test(input.userMessage)) {
    upsertUsage(
      "learning-resource",
      "learning-query",
      "Learning resource access",
      input.disciplineId,
      "learning-hub"
    );
  }

  if (/\b(tool|boq|report|template)\b/i.test(input.userMessage)) {
    upsertUsage(
      "professional-tool",
      "tool-query",
      "Professional tool usage",
      input.disciplineId,
      "professional-tools"
    );
  }
};

export const getFrequentByType = (
  type: LearningResourceType,
  limit = 8
): UsageRecord[] => {
  hydrate();
  return usageStore
    .filter((r) => r.type === type)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getAllUsageRecords = (): UsageRecord[] => {
  hydrate();
  return [...usageStore];
};

export const getTotalInteractions = (): number => {
  hydrate();
  return usageStore.reduce((sum, r) => sum + r.count, 0);
};
