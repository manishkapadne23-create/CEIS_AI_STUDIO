import type {
  DisciplineStandardsCatalog,
  EngineeringStandardMetadata,
  EngineeringStandardPublicationStatus,
} from "./types";

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9+]+/g, "-").replace(/^-|-$/g, "");

export interface CreateStandardEntryInput {
  codeNumber: string;
  title: string;
  publisher: string;
  category: string;
  shortDescription: string;
  edition: string;
  externalLink: string;
  keywords?: string[];
  relatedCodes?: string[];
  scope?: string;
  importantNotes?: string[];
  status?: EngineeringStandardPublicationStatus;
  isPopular?: boolean;
  isLatest?: boolean;
}

const buildKeywords = (
  entry: CreateStandardEntryInput,
  disciplineName: string
): string[] => {
  const base = [
    entry.codeNumber,
    entry.title,
    entry.publisher,
    entry.category,
    disciplineName,
    ...(entry.keywords ?? []),
  ];

  return [...new Set(base.map((value) => value.trim()).filter(Boolean))];
};

export const createStandardEntry = (
  disciplineId: string,
  disciplineName: string,
  entry: CreateStandardEntryInput
): EngineeringStandardMetadata => ({
  id: `${disciplineId}-${slugify(entry.codeNumber)}`,
  disciplineId,
  codeNumber: entry.codeNumber,
  title: entry.title,
  name: entry.codeNumber,
  edition: entry.edition,
  publisher: entry.publisher,
  category: entry.category,
  keywords: buildKeywords(entry, disciplineName),
  shortDescription: entry.shortDescription,
  scope:
    entry.scope ??
    `Covers ${entry.title} practice within ${disciplineName.toLowerCase()}.`,
  relatedStandardIds: [],
  importantNotes:
    entry.importantNotes ??
    [
      "Metadata reference only — no copyrighted documents stored.",
      "Verify latest edition with the official publisher before design use.",
    ],
  externalLink: entry.externalLink,
  status: entry.status ?? "active",
  isPopular: entry.isPopular,
  isLatest: entry.isLatest,
});

const resolveRelatedStandardIds = (
  entries: EngineeringStandardMetadata[],
  relatedCodes: string[] | undefined
): string[] => {
  if (!relatedCodes?.length) {
    return [];
  }

  const byCode = new Map(
    entries.map((entry) => [entry.codeNumber.toLowerCase(), entry.id])
  );

  return relatedCodes
    .map((code) => byCode.get(code.toLowerCase()))
    .filter((id): id is string => Boolean(id));
};

export const createDisciplineStandardsCatalog = (
  disciplineId: string,
  disciplineName: string,
  entries: CreateStandardEntryInput[]
): DisciplineStandardsCatalog => {
  const standards = entries.map((entry) =>
    createStandardEntry(disciplineId, disciplineName, entry)
  );

  const standardsWithRelations = standards.map((standard, index) => ({
    ...standard,
    relatedStandardIds: resolveRelatedStandardIds(
      standards,
      entries[index]?.relatedCodes
    ),
  }));

  return {
    disciplineId,
    disciplineName,
    standards: standardsWithRelations,
  };
};
