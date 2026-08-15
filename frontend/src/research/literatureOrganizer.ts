import type { ResearchWorkspace } from "./types";

const NOTES_KEY = "sarathi.research.notes";

export const organizeLiteratureNote = (
  workspaceId: string,
  note: string
): void => {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    const store: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    if (!store[workspaceId]) store[workspaceId] = [];
    store[workspaceId].unshift(note);
    store[workspaceId] = store[workspaceId].slice(0, 50);
    localStorage.setItem(NOTES_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
};

export const getLiteratureNotes = (workspaceId: string): string[] => {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    const store: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return store[workspaceId] ?? [];
  } catch {
    return [];
  }
};

export const classifyTopic = (topic: string): string => {
  const text = topic.toLowerCase();
  if (/review|survey|meta/i.test(text)) return "Literature Review";
  if (/experiment|lab|test/i.test(text)) return "Experimental Research";
  if (/simulation|model|cfd|fem/i.test(text)) return "Computational Research";
  if (/innovation|novel|new/i.test(text)) return "Innovation Research";
  if (/case\s+study|field/i.test(text)) return "Applied/Field Research";
  return "Fundamental Research";
};

export const buildResearchTimeline = (_workspace: ResearchWorkspace): string[] => [
  "Month 1-2: Literature review and problem definition",
  "Month 3-4: Methodology development and ethics/approval",
  "Month 5-8: Experimental/computational work",
  "Month 9-10: Data analysis and validation",
  "Month 11-12: Report writing and dissemination",
];

export const formatLiteratureSummary = (workspace: ResearchWorkspace): string =>
  [
    `Topic: ${workspace.topic}`,
    `Classification: ${classifyTopic(workspace.topic)}`,
    `Keywords: ${workspace.keywords.join(", ")}`,
    workspace.literatureNotes.length > 0
      ? `Notes (${workspace.literatureNotes.length}):\n${workspace.literatureNotes.slice(0, 5).map((n) => `- ${n}`).join("\n")}`
      : "No literature notes yet. Add notes during your review.",
    "",
    "Suggested timeline:",
    ...buildResearchTimeline(workspace).map((t) => `- ${t}`),
  ].join("\n");

export const suggestRelatedTopics = (topic: string, _disciplineId: string | null): string[] => {
  const base = topic.toLowerCase();
  const related: string[] = [];
  if (/concrete|cement/i.test(base)) related.push("Geopolymer concrete", "Self-healing concrete", "Recycled aggregates");
  if (/solar|pv/i.test(base)) related.push("Bifacial PV", "Perovskite cells", "Solar tracking systems");
  if (/ai|machine\s+learning/i.test(base)) related.push("Deep learning", "Digital twins", "Predictive maintenance");
  if (/water|treatment/i.test(base)) related.push("Membrane filtration", "Desalination", "Smart water networks");
  if (related.length === 0) {
    related.push(`Advanced ${topic}`, `${topic} optimization`, `Sustainable ${topic}`);
  }
  return related.slice(0, 5);
};
