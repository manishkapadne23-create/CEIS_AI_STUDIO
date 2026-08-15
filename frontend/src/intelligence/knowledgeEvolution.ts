import type { KnowledgeEvolutionEntry, KnowledgeEvolutionStatus, LearningResourceType } from "./types";

const STORAGE_KEY = "sarathi.intelligence.knowledge-evolution";

let evolutionStore: KnowledgeEvolutionEntry[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    evolutionStore = raw ? (JSON.parse(raw) as KnowledgeEvolutionEntry[]) : [];
  } catch {
    evolutionStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(evolutionStore.slice(0, 100)));
};

export const registerKnowledgeEvolution = (
  title: string,
  type: LearningResourceType,
  status: KnowledgeEvolutionStatus,
  note: string,
  version = "1.0.0"
): KnowledgeEvolutionEntry => {
  hydrate();
  const entry: KnowledgeEvolutionEntry = {
    id: crypto.randomUUID(),
    title,
    type,
    status,
    version,
    updatedAt: Date.now(),
    note,
  };
  evolutionStore.unshift(entry);
  persist();
  return entry;
};

export const listKnowledgeEvolution = (
  status?: KnowledgeEvolutionStatus
): KnowledgeEvolutionEntry[] => {
  hydrate();
  if (!status) return [...evolutionStore];
  return evolutionStore.filter((e) => e.status === status);
};

export const syncKnowledgeFromMessage = (message: string): void => {
  if (/\bnew\s+standard\b/i.test(message)) {
    registerKnowledgeEvolution(
      "New standard reference",
      "standard",
      "new",
      "Detected from user interaction"
    );
  }
  if (/\bupdated\s+(standard|code|practice)\b/i.test(message)) {
    registerKnowledgeEvolution(
      "Updated engineering knowledge",
      "standard",
      "updated",
      "Knowledge update detected"
    );
  }
  if (/\b(retired|deprecated|superseded)\b/i.test(message)) {
    registerKnowledgeEvolution(
      "Retired knowledge",
      "standard",
      "retired",
      "Deprecated knowledge flagged"
    );
  }
};

export const formatKnowledgeEvolutionForPrompt = (): string => {
  hydrate();
  const recent = evolutionStore.slice(0, 6);

  if (recent.length === 0) {
    return "Knowledge evolution: no recent updates tracked.";
  }

  return [
    "Recent knowledge evolution:",
    ...recent.map(
      (e) =>
        `- [${e.status}] ${e.title} (${e.type}) v${e.version}: ${e.note}`
    ),
  ].join("\n");
};
