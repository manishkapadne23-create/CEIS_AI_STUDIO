import {
  getAllStandardsAcrossDisciplines,
  searchStandardsByFields,
} from "../config/standards";
import type { EngineeringStandardMetadata } from "../config/standards/types";
import { getAllStandardClauses } from "./clauseCatalog";
import { parseClauseReference } from "./clauseParser";
import { resolvePublisherFromText } from "./publisherRegistry";
import type { ClauseSearchFilters, StandardClause } from "./types";

const normalize = (value: string): string => value.toLowerCase().trim();

const matchesYear = (standard: EngineeringStandardMetadata, year?: string | null): boolean => {
  if (!year) return true;
  return standard.edition.includes(year) || standard.codeNumber.includes(year);
};

const matchesRevision = (standard: EngineeringStandardMetadata, revision?: string | null): boolean => {
  if (!revision) return true;
  const normalized = normalize(revision);
  return (
    normalize(standard.edition).includes(normalized) ||
    (standard.revisionHistory?.some((entry) =>
      normalize(entry.edition).includes(normalized)
    ) ?? false)
  );
};

export const searchClauses = (
  query: string,
  filters: ClauseSearchFilters = {}
): StandardClause[] => {
  const normalized = normalize(query);
  const parsed = parseClauseReference(query);
  const publisher = filters.publisher ?? resolvePublisherFromText(query);

  return getAllStandardClauses().filter((clause) => {
    if (filters.mandatoryOnly && !clause.isMandatory) return false;
    if (filters.category && normalize(clause.category) !== normalize(filters.category)) {
      return false;
    }
    if (parsed.clauseNumber && !clause.clauseNumber.includes(parsed.clauseNumber)) {
      return false;
    }
    if (parsed.standardCode && !normalize(clause.standardCode).includes(normalize(parsed.standardCode))) {
      return false;
    }
    if (publisher && !normalize(clause.standardCode).includes(publisher)) {
      return false;
    }
    if (!normalized) return true;
    return (
      normalize(clause.title).includes(normalized) ||
      normalize(clause.summary).includes(normalized) ||
      normalize(clause.standardCode).includes(normalized) ||
      clause.keywords.some((keyword) => normalize(keyword).includes(normalized))
    );
  });
};

export const smartSearchStandards = (
  query: string,
  filters: ClauseSearchFilters = {}
): EngineeringStandardMetadata[] => {
  const publisher = filters.publisher ?? resolvePublisherFromText(query);
  const parsed = parseClauseReference(query);

  const allStandards = getAllStandardsAcrossDisciplines().filter((standard) => {
    if (filters.disciplineId && standard.disciplineId !== filters.disciplineId) {
      return false;
    }
    if (filters.category && normalize(standard.category) !== normalize(filters.category)) {
      return false;
    }
    if (publisher && !normalize(standard.publisher).includes(publisher)) {
      return false;
    }
    return true;
  });

  const searchQuery = parsed.standardCode ?? query;
  const standards = searchStandardsByFields(allStandards, searchQuery);

  return standards.filter(
    (standard) =>
      matchesYear(standard, filters.publicationYear) &&
      matchesRevision(standard, filters.revision)
  );
};

export const smartSearch = (
  query: string,
  filters: ClauseSearchFilters = {}
): { standards: EngineeringStandardMetadata[]; clauses: StandardClause[] } => ({
  standards: smartSearchStandards(query, filters),
  clauses: searchClauses(query, filters),
});
