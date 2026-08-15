import { getKnowledgeEntry } from "./knowledgeRegistry";
import { searchKnowledgeNetwork } from "./knowledgeSearch";
import type {
  KnowledgeEntry,
  KnowledgeRelation,
  KnowledgeRelationType,
  KnowledgeRetrievalBundle,
} from "./types";

const RELATION_LIMIT = 4;

const addRelation = (
  relations: KnowledgeRelation[],
  topicId: string,
  entry: KnowledgeEntry,
  relationType: KnowledgeRelationType
): void => {
  if (relations.some((r) => r.relatedId === entry.id)) return;

  relations.push({
    topicId,
    relatedId: entry.id,
    relationType,
    label: entry.title,
  });
};

const mapEntryToRelationType = (
  entry: KnowledgeEntry
): KnowledgeRelationType => {
  switch (entry.category) {
    case "engineering-standards":
      return "standard";
    case "engineering-formulae":
      return "calculator";
    case "engineering-workflows":
      return "workflow";
    case "engineering-templates":
      return "template";
    case "engineering-checklists":
      return "report";
    case "engineering-research":
      return "learning-resource";
    default:
      if (entry.moduleId === "documents") return "document";
      if (entry.moduleId === "learning-hub") return "learning-resource";
      if (entry.moduleId === "professional-tools") return "professional-tool";
      return "related-topic";
  }
};

export const buildKnowledgeRelations = (
  topicEntry: KnowledgeEntry,
  disciplineId: string | null
): KnowledgeRelation[] => {
  const relations: KnowledgeRelation[] = [];
  const query = `${topicEntry.title} ${topicEntry.description}`;

  const relatedResults = searchKnowledgeNetwork({
    query,
    disciplineId,
    limit: 20,
  }).filter((result) => result.entry.id !== topicEntry.id);

  for (const result of relatedResults) {
    const relationType = mapEntryToRelationType(result.entry);
    addRelation(relations, topicEntry.id, result.entry, relationType);
    if (relations.length >= RELATION_LIMIT * 3) break;
  }

  return relations;
};

export const buildKnowledgeRetrievalBundle = (
  query: string,
  disciplineId: string | null,
  disciplineName: string | null
): KnowledgeRetrievalBundle => {
  const searchResults = searchKnowledgeNetwork({
    query,
    disciplineId,
    limit: 16,
  });

  const topicEntries = searchResults
    .slice(0, 6)
    .map((result) => result.entry);

  const relations: KnowledgeRelation[] = [];
  for (const topic of topicEntries.slice(0, 2)) {
    relations.push(...buildKnowledgeRelations(topic, disciplineId));
  }

  const byCategory = (category: KnowledgeEntry["category"]) =>
    searchResults
      .filter((r) => r.entry.category === category)
      .map((r) => r.entry)
      .slice(0, RELATION_LIMIT);

  const standards = byCategory("engineering-standards");
  const calculators = byCategory("engineering-formulae");
  const workflows = byCategory("engineering-workflows");
  const tools = searchResults
    .filter((r) => r.entry.moduleId === "professional-tools")
    .map((r) => r.entry)
    .slice(0, RELATION_LIMIT);
  const learningResources = searchResults
    .filter((r) => r.entry.moduleId === "learning-hub")
    .map((r) => r.entry)
    .slice(0, RELATION_LIMIT);

  const relatedTopics = searchResults
    .filter(
      (r) =>
        r.entry.category === "engineering-concepts" ||
        r.entry.category === "engineering-design"
    )
    .map((r) => r.entry)
    .slice(0, RELATION_LIMIT);

  if (topicEntries.length === 0 && disciplineId) {
    topicEntries.push({
      id: `topic-${disciplineId}`,
      title: disciplineName ?? disciplineId,
      description: `General ${disciplineName ?? "engineering"} knowledge context`,
      category: "engineering-concepts",
      disciplineId,
      disciplineName: disciplineName ?? disciplineId,
      keywords: [disciplineName ?? disciplineId],
      status: "active",
      version: "1.0.0",
      updatedAt: Date.now(),
    });
  }

  return {
    topicEntries,
    relations,
    standards,
    calculators,
    workflows,
    tools,
    learningResources,
    relatedTopics,
  };
};

export const formatRelationsForPrompt = (
  bundle: KnowledgeRetrievalBundle
): string => {
  const sections: string[] = [];

  const formatEntries = (label: string, entries: KnowledgeEntry[]) => {
    if (entries.length === 0) return;
    sections.push(
      `${label}:\n${entries.map((e) => `  - ${e.title}: ${e.description}`).join("\n")}`
    );
  };

  formatEntries("Topics", bundle.topicEntries);
  formatEntries("Standards", bundle.standards);
  formatEntries("Calculators / Formulae", bundle.calculators);
  formatEntries("Workflows", bundle.workflows);
  formatEntries("Professional Tools", bundle.tools);
  formatEntries("Learning Resources", bundle.learningResources);
  formatEntries("Related Topics", bundle.relatedTopics);

  if (bundle.relations.length > 0) {
    sections.push(
      "Knowledge Links:\n" +
        bundle.relations
          .slice(0, 10)
          .map((r) => {
            const entry = getKnowledgeEntry(r.relatedId);
            return `  - ${r.relationType}: ${r.label}${entry ? ` (${entry.category})` : ""}`;
          })
          .join("\n")
    );
  }

  return sections.join("\n\n");
};
