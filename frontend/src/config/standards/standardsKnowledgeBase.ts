import type {
  EngineeringStandardMetadata,
  StandardKnowledgePanelData,
} from "./types";
import { DISCIPLINE_STANDARDS_CATALOGS } from "./catalogRegistry";
import { getStandardsCatalogByDisciplineId } from "./getStandardsCatalog";

export const getStandardById = (
  standardId: string
): EngineeringStandardMetadata | null => {
  for (const catalog of DISCIPLINE_STANDARDS_CATALOGS) {
    const match = catalog.standards.find(
      (standard) => standard.id === standardId
    );

    if (match) {
      return match;
    }
  }

  return null;
};

export const resolveRelatedStandards = (
  standard: EngineeringStandardMetadata,
  catalogStandards: EngineeringStandardMetadata[]
): EngineeringStandardMetadata[] =>
  standard.relatedStandardIds
    .map((id) => catalogStandards.find((entry) => entry.id === id))
    .filter((entry): entry is EngineeringStandardMetadata => Boolean(entry));

export const buildStandardKnowledgePanelData = (
  standard: EngineeringStandardMetadata
): StandardKnowledgePanelData => {
  const catalog = getStandardsCatalogByDisciplineId(standard.disciplineId);
  const relatedStandards = catalog
    ? resolveRelatedStandards(standard, catalog.standards)
    : [];

  return {
    standard,
    summary: standard.shortDescription,
    scope: standard.scope,
    relatedStandards,
    latestRevision: standard.edition,
    importantNotes: standard.importantNotes,
  };
};

export const searchStandardsByFields = (
  standards: EngineeringStandardMetadata[],
  query: string,
  disciplineName?: string | null
): EngineeringStandardMetadata[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return standards;
  }

  return standards.filter((standard) => {
    const haystack = [
      standard.codeNumber,
      standard.title,
      standard.name,
      standard.shortDescription,
      standard.scope,
      standard.publisher,
      standard.category,
      standard.edition,
      disciplineName,
      ...standard.keywords,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
};
