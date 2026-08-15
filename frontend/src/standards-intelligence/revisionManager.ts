import { getAllStandardsAcrossDisciplines } from "../config/standards";
import type { EngineeringStandardMetadata, StandardRevisionRecord } from "../config/standards/types";

export interface RevisionComparison {
  standardId: string;
  codeNumber: string;
  fromEdition: string;
  toEdition: string;
  summary: string;
  changes: string[];
}

export const getRevisionHistory = (
  standardId: string
): StandardRevisionRecord[] => {
  const standard = getAllStandardsAcrossDisciplines().find(
    (entry) => entry.id === standardId
  );
  return standard?.revisionHistory ?? [];
};

export const compareRevisions = (
  standardId: string,
  fromEdition?: string,
  toEdition?: string
): RevisionComparison | null => {
  const standard = getAllStandardsAcrossDisciplines().find(
    (entry) => entry.id === standardId
  );
  if (!standard) return null;

  const history = standard.revisionHistory ?? [];
  const resolvedFrom = fromEdition ?? history[0]?.edition ?? standard.edition;
  const resolvedTo = toEdition ?? standard.edition;

  const fromRecord = history.find((entry) => entry.edition === resolvedFrom);
  const toRecord = history.find((entry) => entry.edition === resolvedTo);

  const changes: string[] = [];
  if (fromRecord?.summary) changes.push(`From ${resolvedFrom}: ${fromRecord.summary}`);
  if (toRecord?.summary) changes.push(`To ${resolvedTo}: ${toRecord.summary}`);
  if (standard.status === "superseded") {
    changes.push("This standard has been superseded; verify latest applicable edition.");
  }
  if (standard.status === "withdrawn") {
    changes.push("This standard is withdrawn; do not use for new work.");
  }

  return {
    standardId: standard.id,
    codeNumber: standard.codeNumber,
    fromEdition: resolvedFrom,
    toEdition: resolvedTo,
    summary: `Revision comparison for ${standard.codeNumber}: ${resolvedFrom} → ${resolvedTo}`,
    changes: changes.length > 0 ? changes : ["No detailed revision notes in catalog; consult official publisher document."],
  };
};

export const getLatestRevisionNote = (standard: EngineeringStandardMetadata): string => {
  if (standard.status === "latest-revision" || standard.status === "new-standard") {
    return `${standard.codeNumber} (${standard.edition}) is the latest catalogued revision.`;
  }
  if (standard.status === "superseded") {
    return `${standard.codeNumber} has been superseded. Check related standards for current guidance.`;
  }
  if (standard.status === "withdrawn") {
    return `${standard.codeNumber} is withdrawn and should not be applied to new projects.`;
  }
  return `${standard.codeNumber} edition ${standard.edition} is active in the Sarathi catalog.`;
};
