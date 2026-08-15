import { getDisciplineKnowledgeIndex } from "./knowledgeRegistry";
import {
  buildKnowledgeRetrievalBundle,
  formatRelationsForPrompt,
} from "./knowledgeRelations";
import { searchKnowledgeNetwork } from "./knowledgeSearch";
import { getVersionSummary } from "./knowledgeVersioning";
import type {
  KnowledgeNetworkExtensionHooks,
  KnowledgeProviderInput,
  KnowledgeProviderResult,
} from "./types";

let extensionHooks: KnowledgeNetworkExtensionHooks = {};

export const setKnowledgeNetworkExtensionHooks = (
  hooks: KnowledgeNetworkExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getKnowledgeNetworkExtensionHooks =
  (): KnowledgeNetworkExtensionHooks => extensionHooks;

/** Retrieve relevant engineering knowledge for AI response generation. */
export const provideEngineeringKnowledge = (
  input: KnowledgeProviderInput
): KnowledgeProviderResult => {
  const searchResults = searchKnowledgeNetwork({
    query: input.userMessage,
    disciplineId: input.disciplineId,
    limit: 16,
  });

  const retrieval = buildKnowledgeRetrievalBundle(
    input.userMessage,
    input.disciplineId,
    input.disciplineName
  );

  const disciplineIndex = input.disciplineId
    ? getDisciplineKnowledgeIndex(input.disciplineId)
    : null;

  const versionSummary = getVersionSummary();

  const extensionNotes: string[] = [];
  if (extensionHooks.ragEnabled) {
    extensionNotes.push("RAG retrieval enabled");
  }
  if (extensionHooks.semanticSearchEnabled) {
    extensionNotes.push("Semantic search enabled");
  }
  if (extensionHooks.vectorDatabaseId) {
    extensionNotes.push(`Vector DB: ${extensionHooks.vectorDatabaseId}`);
  }
  if (extensionHooks.pmisKnowledgeLayerId) {
    extensionNotes.push(`PMIS knowledge: ${extensionHooks.pmisKnowledgeLayerId}`);
  }

  const promptAugmentation = [
    "========================================",
    "Engineering Knowledge Network (EKN)",
    "========================================",
    "Retrieve and apply relevant engineering knowledge before responding. Base answers on the knowledge repository, applicable standards, and engineering context.",
    "",
    input.sessionTopic ? `Session topic: ${input.sessionTopic}` : "",
    input.selectedStandardCode
      ? `Selected standard: ${input.selectedStandardCode}`
      : "",
    disciplineIndex
      ? `Discipline repository: ${disciplineIndex.disciplineName} (${disciplineIndex.entryCount} entries, ${disciplineIndex.categories.length} categories)`
      : "Discipline repository: not selected",
    "",
    "RETRIEVED KNOWLEDGE:",
    formatRelationsForPrompt(retrieval),
    "",
    "KNOWLEDGE INSTRUCTIONS:",
    "- Reference applicable standards and codes from retrieved knowledge",
    "- Suggest relevant calculators and workflows when appropriate",
    "- Link related topics, tools, templates, and learning resources",
    "- Use conversation memory and project context alongside knowledge repository",
    "- Cite engineering concepts with discipline-appropriate terminology",
    extensionNotes.length > 0
      ? `\nFuture capabilities: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    `EKN entries: ${searchResults.length}`,
    disciplineIndex ? `${disciplineIndex.disciplineName}: ${disciplineIndex.entryCount}` : "",
    `Standards: ${retrieval.standards.length}`,
    `Calculators: ${retrieval.calculators.length}`,
    `Workflows: ${retrieval.workflows.length}`,
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    retrieval,
    searchResults,
    disciplineIndex,
    versionSummary,
    promptAugmentation,
    summaryText,
    entryCount: searchResults.length,
  };
};

export const formatKnowledgeForPrompt = (
  result: KnowledgeProviderResult
): string => result.promptAugmentation;
