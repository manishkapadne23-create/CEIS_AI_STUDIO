import {
  formatGenerationSummary,
  generateDocument,
  getLatestGeneratedDocument,
} from "./documentGenerator";
import {
  exportDocument,
  formatExportOptionsForPrompt,
  resolveExportFormat,
  triggerDocumentDownload,
} from "./exportEngine";
import {
  findTemplateByTitle,
  formatLibrarySummaryForPrompt,
  listTemplatesForDiscipline,
  resolveDocumentTypeFromText,
} from "./templateLibrary";
import {
  favoriteTemplateByTitle,
  formatSearchResultsForPrompt,
  isTemplateQuery,
  listTemplatesForCurrentDiscipline,
  searchFromMessage,
  searchTemplates,
} from "./templateSearch";
import type {
  TemplateEngineInput,
  TemplateEngineResult,
  TemplateExtensionHooks,
} from "./types";

let extensionHooks: TemplateExtensionHooks = {};

export const setTemplateExtensionHooks = (
  hooks: TemplateExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getTemplateExtensionHooks = (): TemplateExtensionHooks =>
  extensionHooks;

const parseTemplateCommand = (
  message: string
): { action: string; payload: string } | null => {
  const generateMatch = message.match(
    /^(?:generate|create|draft)\s+(?:document|report|template)?\s*[:\-]?\s*(.+)$/i
  );
  if (generateMatch) return { action: "generate", payload: generateMatch[1].trim() };

  const showMatch = message.match(
    /^(?:show|view|describe)\s+template\s*[:\-]?\s*(.+)$/i
  );
  if (showMatch) return { action: "show", payload: showMatch[1].trim() };

  const favoriteMatch = message.match(
    /^favorite\s+template\s*[:\-]?\s*(.+)$/i
  );
  if (favoriteMatch) return { action: "favorite", payload: favoriteMatch[1].trim() };

  const listMatch = message.match(
    /^(?:list|show|browse)\s+templates?(?:\s+for\s+(.+))?$/i
  );
  if (listMatch) {
    return { action: "list", payload: listMatch[1]?.trim() ?? "" };
  }

  const searchMatch = message.match(
    /^(?:search|find)\s+templates?\s*(?:for\s+)?(.+)?$/i
  );
  if (searchMatch) {
    return { action: "search", payload: searchMatch[1]?.trim() ?? "" };
  }

  const exportMatch = message.match(
    /^export\s+(?:document\s+)?(?:as\s+)?(word|pdf|excel|markdown|print[\s-]?ready|docx|xlsx|md)$/i
  );
  if (exportMatch) {
    return { action: "export", payload: exportMatch[1].trim() };
  }

  return null;
};

const resolveTemplateForGeneration = (
  payload: string,
  disciplineId: string | null
) => {
  const byTitle = findTemplateByTitle(payload);
  if (byTitle) return byTitle;

  const docTypeId = resolveDocumentTypeFromText(payload);
  if (docTypeId && disciplineId) {
    const disciplineTemplates = listTemplatesForDiscipline(disciplineId);
    return (
      disciplineTemplates.find((t) => t.documentTypeId === docTypeId) ?? null
    );
  }

  if (docTypeId) {
    return findTemplateByTitle(payload) ?? findTemplateByTitle(docTypeId.replace(/-/g, " "));
  }

  return findTemplateByTitle(payload);
};

/** Run Engineering Templates & Report Generator for a user turn. */
export const runTemplateEngine = (
  input: TemplateEngineInput
): TemplateEngineResult => {
  let templateAction: string | null = null;
  let exportAction: string | null = null;
  let searchResult = null;
  let generatedDocument = null;

  const command = parseTemplateCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "generate": {
        const template = resolveTemplateForGeneration(
          command.payload,
          input.disciplineId
        );
        if (template) {
          generatedDocument = generateDocument({
            template,
            userInputs: input.userMessage,
            disciplineId: input.disciplineId,
            disciplineName: input.disciplineName,
            projectName: input.projectName,
            standards: input.selectedStandardCode
              ? [input.selectedStandardCode]
              : [],
            calculations: [],
          });
          templateAction = formatGenerationSummary(generatedDocument);
        } else {
          templateAction = `Template not found for: ${command.payload}. Try 'List templates' or 'Generate inspection report'.`;
        }
        break;
      }
      case "show": {
        const template = findTemplateByTitle(command.payload);
        if (template) {
          templateAction = [
            `Template: ${template.title}`,
            `Category: ${template.category}`,
            `Sections: ${template.sections.join(" → ")}`,
            `Description: ${template.description}`,
            `Standards hints: ${template.standardsHints.join("; ")}`,
          ].join("\n");
        } else {
          templateAction = `Template not found: ${command.payload}`;
        }
        break;
      }
      case "favorite": {
        templateAction =
          favoriteTemplateByTitle(command.payload) ??
          `Template not found: ${command.payload}`;
        break;
      }
      case "list": {
        if (command.payload) {
          searchResult = searchFromMessage(command.payload, input.disciplineId);
        } else {
          templateAction = listTemplatesForCurrentDiscipline(input.disciplineId);
          searchResult = searchTemplates({
            disciplineId: input.disciplineId ?? undefined,
            limit: 10,
          });
        }
        if (searchResult && !templateAction) {
          templateAction = formatSearchResultsForPrompt(searchResult);
        } else if (searchResult) {
          templateAction += `\n\n${formatSearchResultsForPrompt(searchResult)}`;
        }
        break;
      }
      case "search": {
        searchResult = searchFromMessage(
          command.payload || input.userMessage,
          input.disciplineId
        );
        templateAction = formatSearchResultsForPrompt(searchResult);
        break;
      }
      case "export": {
        const format = resolveExportFormat(command.payload);
        const latest = getLatestGeneratedDocument();
        if (format && latest) {
          const result = exportDocument(latest, format);
          triggerDocumentDownload(result.blob, result.filename);
          exportAction = result.message;
        } else if (!latest) {
          exportAction =
            "No document to export. Generate a document first with 'Generate [type]'.";
        }
        break;
      }
    }
  }

  if (!searchResult && isTemplateQuery(input.userMessage) && !templateAction) {
    searchResult = searchFromMessage(input.userMessage, input.disciplineId);
    templateAction = formatSearchResultsForPrompt(searchResult);
  }

  const active =
    isTemplateQuery(input.userMessage) ||
    templateAction !== null ||
    exportAction !== null ||
    generatedDocument !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.pmisReportTemplateId) {
    extensionNotes.push(`PMIS reports: ${extensionHooks.pmisReportTemplateId}`);
  }
  if (extensionHooks.tenderDocumentTemplateId) {
    extensionNotes.push(`Tender docs: ${extensionHooks.tenderDocumentTemplateId}`);
  }
  if (extensionHooks.contractDocumentTemplateId) {
    extensionNotes.push(`Contracts: ${extensionHooks.contractDocumentTemplateId}`);
  }
  if (extensionHooks.governmentFormatId) {
    extensionNotes.push(`Gov formats: ${extensionHooks.governmentFormatId}`);
  }
  if (extensionHooks.clientTemplateId) {
    extensionNotes.push(`Client templates: ${extensionHooks.clientTemplateId}`);
  }

  const promptAugmentation = [
    "========================================",
    "Engineering Templates & Report Generator",
    "========================================",
    "Generate professional engineering documents using AI, standards, calculations and project context.",
    "",
    formatLibrarySummaryForPrompt(),
    "",
    templateAction ? `TEMPLATE ACTION:\n${templateAction}` : "",
    exportAction ? `EXPORT:\n${exportAction}` : "",
    generatedDocument
      ? `\nGENERATED DOCUMENT READY:\nTitle: ${generatedDocument.title}\nSections: ${generatedDocument.tableOfContents.length}\nUse AI response to populate section content with engineering detail.`
      : "",
    "",
    "SMART FEATURES: Auto numbering | TOC | Revision history | Header/footer | Branding | Digital signature placeholder | References | Annexures",
    "",
    formatExportOptionsForPrompt(),
    "",
    "TEMPLATE COMMANDS:",
    "- List templates | Search templates [keyword]",
    "- Generate [document type] (e.g. Generate inspection report)",
    "- Show template [name] | Favorite template [name]",
    "- Export as PDF | Export as Word | Export as Markdown",
    extensionNotes.length > 0
      ? `\nFuture: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    active ? "templates-active" : "",
    generatedDocument ? "document-generated" : "",
    searchResult ? `${searchResult.totalCount} templates` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    active,
    searchResult,
    generatedDocument,
    templateAction,
    exportAction,
    promptAugmentation,
    summaryText,
  };
};

export const formatTemplateForPrompt = (
  result: TemplateEngineResult
): string => result.promptAugmentation;
