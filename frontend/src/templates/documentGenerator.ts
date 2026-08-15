import { assembleDocument, formatDocumentPreview } from "./reportBuilder";
import { recordTemplateUsage } from "./templateSearch";
import type {
  DocumentGenerationInput,
  GeneratedDocument,
} from "./types";

const STORAGE_KEY = "sarathi.templates.generated";

let generatedStore: GeneratedDocument[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    generatedStore = raw ? (JSON.parse(raw) as GeneratedDocument[]) : [];
  } catch {
    generatedStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(generatedStore.slice(0, 100)));
};

const extractCalculations = (userInputs: string): string[] => {
  const calculations: string[] = [];
  if (/\bcalculate|computation|design\s+load\b/i.test(userInputs)) {
    calculations.push("Engineering calculation referenced in user inputs");
  }
  if (/\bIRC|IS\s+\d+|ASTM|BS\s+\d+/i.test(userInputs)) {
    const standards = userInputs.match(/\b(?:IRC|IS|ASTM|BS)\s*[\w-]+/gi);
    if (standards) {
      calculations.push(`Standards-based calculation per ${standards[0]}`);
    }
  }
  return calculations;
};

/** Generate a professional engineering document from a template. */
export const generateDocument = (
  input: DocumentGenerationInput
): GeneratedDocument => {
  const calculations =
    input.calculations.length > 0
      ? input.calculations
      : extractCalculations(input.userInputs);

  const standards =
    input.standards.length > 0
      ? input.standards
      : input.template.standardsHints;

  const document = assembleDocument(input.template, {
    userInputs: input.userInputs,
    disciplineName: input.disciplineName ?? input.template.disciplineName,
    projectName: input.projectName,
    standards,
    calculations,
  });

  hydrate();
  generatedStore.unshift(document);
  persist();
  recordTemplateUsage(input.template.id);

  return document;
};

export const getGeneratedDocument = (
  documentId: string
): GeneratedDocument | null => {
  hydrate();
  return generatedStore.find((d) => d.id === documentId) ?? null;
};

export const getLatestGeneratedDocument = (): GeneratedDocument | null => {
  hydrate();
  return generatedStore[0] ?? null;
};

export const listGeneratedDocuments = (): GeneratedDocument[] => {
  hydrate();
  return generatedStore.slice(0, 20);
};

export const formatGenerationSummary = (doc: GeneratedDocument): string =>
  formatDocumentPreview(doc);
