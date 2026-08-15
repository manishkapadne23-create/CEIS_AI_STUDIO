import { getAllStandardsAcrossDisciplines } from "../config/standards";
import type { EngineeringStandardMetadata } from "../config/standards/types";
import type { StandardClause } from "./types";

let cachedClauses: StandardClause[] | null = null;

const buildClausesForStandard = (
  standard: EngineeringStandardMetadata
): StandardClause[] => {
  const clauses: StandardClause[] = [
    {
      id: `${standard.id}-scope`,
      standardId: standard.id,
      standardCode: standard.codeNumber,
      clauseNumber: "1.0",
      title: "Scope",
      summary: standard.scope,
      isMandatory: true,
      category: "scope",
      keywords: ["scope", "application", ...standard.keywords],
    },
    {
      id: `${standard.id}-general`,
      standardId: standard.id,
      standardCode: standard.codeNumber,
      clauseNumber: "2.0",
      title: "General Requirements",
      summary: standard.shortDescription,
      isMandatory: true,
      category: "general",
      keywords: standard.keywords,
    },
  ];

  standard.importantNotes.forEach((note, index) => {
    clauses.push({
      id: `${standard.id}-note-${index}`,
      standardId: standard.id,
      standardCode: standard.codeNumber,
      clauseNumber: `${3 + index}.0`,
      title: `Requirement ${index + 1}`,
      summary: note,
      isMandatory: /mandatory|shall|must|required/i.test(note),
      category: "requirement",
      keywords: standard.keywords,
    });
  });

  if (standard.revisionHistory?.length) {
    for (const revision of standard.revisionHistory) {
      clauses.push({
        id: `${standard.id}-rev-${revision.edition}`,
        standardId: standard.id,
        standardCode: standard.codeNumber,
        clauseNumber: "Rev",
        title: `Revision ${revision.edition}`,
        summary: revision.summary ?? `Edition ${revision.edition}`,
        isMandatory: false,
        category: "revision",
        keywords: ["revision", revision.edition],
      });
    }
  }

  return clauses;
};

export const getAllStandardClauses = (): StandardClause[] => {
  if (cachedClauses) {
    return cachedClauses;
  }
  cachedClauses = getAllStandardsAcrossDisciplines().flatMap(buildClausesForStandard);
  return cachedClauses;
};

export const getClausesForStandard = (standardId: string): StandardClause[] =>
  getAllStandardClauses().filter((clause) => clause.standardId === standardId);

export const getFrequentlyUsedClauses = (limit = 8): StandardClause[] =>
  getAllStandardClauses().filter((clause) => clause.isMandatory).slice(0, limit);

export const invalidateClauseCatalog = (): void => {
  cachedClauses = null;
};
