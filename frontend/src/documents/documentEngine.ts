import {
  getActiveDocuments,
  getDocumentMemorySummary,
  linkDocumentToProject,
  saveDocument,
} from "./documentMemory";
import {
  formatDocumentLinksForPrompt,
  linkDocumentToResources,
} from "./documentLinker";
import {
  buildDocumentAnalysisPrompt,
  detectDocumentChatIntent,
  isDocumentIntelligenceQuery,
} from "./documentSummarizer";
import { buildDocumentRecord, parseUploadCommand } from "./documentParser";
import { searchDocuments } from "./documentSearch";
import { formatVersionSummary, recordDocumentVersion } from "./documentVersioning";
import type {
  DocumentEngineInput,
  DocumentEngineResult,
  DocumentIntelligenceExtensionHooks,
  DocumentIntelligencePayload,
  EngineeringDocumentRecord,
} from "./types";

let extensionHooks: DocumentIntelligenceExtensionHooks = {};

export const setDocumentIntelligenceExtensionHooks = (
  hooks: DocumentIntelligenceExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getDocumentIntelligenceExtensionHooks =
  (): DocumentIntelligenceExtensionHooks => extensionHooks;

const handleDocumentRegistration = (
  input: DocumentEngineInput
): EngineeringDocumentRecord | null => {
  const uploadCommand = parseUploadCommand(input.userMessage);
  if (!uploadCommand) return null;

  const document = buildDocumentRecord({
    name: uploadCommand.fileName,
    disciplineId: input.disciplineId,
    disciplineName: input.disciplineName,
    projectId: input.projectId,
    projectName: input.projectName,
  });

  saveDocument(document);
  recordDocumentVersion(document, "Initial upload");

  if (input.projectId && input.projectName) {
    linkDocumentToProject(document.id, input.projectId, input.projectName);
  }

  return document;
};

/** Run Engineering Document Intelligence for a user turn. */
export const runDocumentIntelligenceEngine = (
  input: DocumentEngineInput
): DocumentEngineResult => {
  const inactive: DocumentEngineResult = {
    active: false,
    payload: null,
    searchResults: [],
    registeredDocument: null,
    promptAugmentation: "",
    summaryText: getDocumentMemorySummary(),
  };

  const registeredDocument = handleDocumentRegistration(input);

  const documentQueryActive =
    isDocumentIntelligenceQuery(input.userMessage) ||
    registeredDocument !== null ||
    (input.activeDocumentIds?.length ?? 0) > 0;

  if (!documentQueryActive) {
    return inactive;
  }

  const activeDocuments = getActiveDocuments(input.activeDocumentIds);
  const searchResults = searchDocuments({
    query: input.userMessage,
    disciplineId: input.disciplineId,
    projectId: input.projectId,
    limit: 8,
  });

  const documentsForAnalysis =
    activeDocuments.length > 0
      ? activeDocuments
      : searchResults.map((result) => result.document).slice(0, 3);

  const detectedIntent = detectDocumentChatIntent(input.userMessage);

  const linkedResources = documentsForAnalysis.flatMap((doc) =>
    linkDocumentToResources(doc)
  );

  const versionSummary = documentsForAnalysis
    .map((doc) => `${doc.name}:\n${formatVersionSummary(doc)}`)
    .join("\n\n");

  const analysisInstructions = buildDocumentAnalysisPrompt(
    detectedIntent,
    documentsForAnalysis.map((doc) => doc.name)
  );

  const payload: DocumentIntelligencePayload = {
    activeDocuments: documentsForAnalysis,
    detectedIntent,
    linkedResources,
    versionSummary,
    analysisInstructions,
  };

  const extensionNotes: string[] = [];
  if (extensionHooks.ocrEnabled) extensionNotes.push("OCR enabled");
  if (extensionHooks.drawingIntelligenceEnabled) {
    extensionNotes.push("Drawing intelligence enabled");
  }
  if (extensionHooks.bimIntegrationEnabled) extensionNotes.push("BIM integration enabled");
  if (extensionHooks.gisIntegrationEnabled) extensionNotes.push("GIS integration enabled");
  if (extensionHooks.contractIntelligenceEnabled) {
    extensionNotes.push("Contract intelligence enabled");
  }
  if (extensionHooks.tenderIntelligenceEnabled) {
    extensionNotes.push("Tender intelligence enabled");
  }
  if (extensionHooks.pmisDocumentId) {
    extensionNotes.push(`PMIS document: ${extensionHooks.pmisDocumentId}`);
  }

  const documentDetails = documentsForAnalysis
    .map(
      (doc) =>
        [
          `Document: ${doc.name}`,
          `Format: ${doc.format} | Category: ${doc.category} | Version: ${doc.version}`,
          `Discipline: ${doc.disciplineName ?? "general"}`,
          `Projects: ${doc.projectNames.join(", ") || "none"}`,
          `Keywords: ${doc.keywords.join(", ")}`,
          `Standards: ${doc.standardsReferenced.join(", ") || "none detected"}`,
          doc.drawingNumber ? `Drawing No: ${doc.drawingNumber}` : "",
          doc.contentPreview
            ? `Preview: ${doc.contentPreview.slice(0, 400)}`
            : "",
        ]
          .filter(Boolean)
          .join("\n")
    )
    .join("\n\n");

  const promptAugmentation = [
    "========================================",
    "Engineering Document Intelligence (EDI)",
    "========================================",
    "Understand and assist with engineering documents — not just store them.",
    "",
    getDocumentMemorySummary(),
    registeredDocument
      ? `New document registered: ${registeredDocument.name} (${registeredDocument.format})`
      : "",
    "",
    "ACTIVE DOCUMENTS:",
    documentDetails || "No documents matched — assist based on query context.",
    "",
    "DOCUMENT AI TASK:",
    analysisInstructions,
    "",
    "VERSIONING:",
    versionSummary || "No version history.",
    "",
    "DOCUMENT LINKS:",
    formatDocumentLinksForPrompt(linkedResources),
    "",
    "EDI INSTRUCTIONS:",
    "- Summarize, explain terms, extract tables/specs/quantities/standards",
    "- Identify risks and missing information",
    "- Generate executive summary, technical summary, review notes as requested",
    "- Relate document content to linked standards, calculators, workflows, and tools",
    extensionNotes.length > 0
      ? `\nFuture capabilities: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    `EDI: ${detectedIntent}`,
    `Documents: ${documentsForAnalysis.length}`,
    `Search hits: ${searchResults.length}`,
    registeredDocument ? `Registered: ${registeredDocument.name}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    active: true,
    payload,
    searchResults,
    registeredDocument,
    promptAugmentation,
    summaryText,
  };
};

export const formatDocumentIntelligenceForPrompt = (
  result: DocumentEngineResult
): string => result.promptAugmentation;
