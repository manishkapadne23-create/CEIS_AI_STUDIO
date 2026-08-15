import type { EngineeringStandardMetadata } from "../config/standards/types";
import type { RevisionComparison } from "./revisionManager";
import type { StandardClause, StandardsIntelligenceReports } from "./types";

export const buildStandardSummaryReport = (
  standard: EngineeringStandardMetadata
): string =>
  [
    `## ${standard.codeNumber} — ${standard.title}`,
    `**Publisher:** ${standard.publisher} | **Edition:** ${standard.edition} | **Status:** ${standard.status}`,
    "",
    "### Scope",
    standard.scope,
    "",
    "### Key points",
    ...standard.importantNotes.map((note) => `- ${note}`),
    "",
    "### Keywords",
    standard.keywords.join(", "),
  ].join("\n");

export const buildClauseSummaryReport = (
  clause: StandardClause,
  standard?: EngineeringStandardMetadata | null
): string =>
  [
    `## Clause ${clause.clauseNumber} — ${clause.title}`,
    `**Standard:** ${clause.standardCode}`,
    standard ? `**Edition:** ${standard.edition}` : "",
    clause.isMandatory ? "**Mandatory requirement**" : "Guidance / informative",
    "",
    clause.summary,
  ]
    .filter(Boolean)
    .join("\n");

export const buildComparisonReport = (
  standards: EngineeringStandardMetadata[],
  revision?: RevisionComparison | null
): string => {
  if (revision) {
    return [
      `## Revision Comparison: ${revision.codeNumber}`,
      `**${revision.fromEdition}** → **${revision.toEdition}**`,
      "",
      ...revision.changes.map((change) => `- ${change}`),
    ].join("\n");
  }

  if (standards.length < 2) {
    return "Provide at least two standards or a revision pair to generate a comparison report.";
  }

  return [
    "## Standard Comparison",
    ...standards.map(
      (standard) =>
        `### ${standard.codeNumber}\n- ${standard.title}\n- Scope: ${standard.shortDescription}\n- Edition: ${standard.edition}`
    ),
  ].join("\n\n");
};

export const buildComplianceNotes = (
  standards: EngineeringStandardMetadata[],
  mandatoryClauses: StandardClause[]
): string =>
  [
    "## Compliance Notes",
    "",
    "### Applicable standards",
    ...standards.map((standard) => `- ${standard.codeNumber}: ${standard.title} (${standard.edition})`),
    "",
    "### Mandatory clauses (catalogued)",
    ...(mandatoryClauses.length > 0
      ? mandatoryClauses.map(
          (clause) => `- ${clause.standardCode} §${clause.clauseNumber}: ${clause.title}`
        )
      : ["- No mandatory clauses indexed; verify against official document."]),
    "",
    "_Always confirm against the latest official publisher edition and project-specific requirements._",
  ].join("\n");

export const buildEngineeringReferences = (
  standards: EngineeringStandardMetadata[]
): string =>
  standards
    .map(
      (standard) =>
        `- [${standard.codeNumber}](${standard.externalLink}) — ${standard.title} (${standard.publisher})`
    )
    .join("\n");

export const buildStandardsReports = (input: {
  standard?: EngineeringStandardMetadata | null;
  clause?: StandardClause | null;
  standards?: EngineeringStandardMetadata[];
  mandatoryClauses?: StandardClause[];
  revision?: RevisionComparison | null;
}): StandardsIntelligenceReports => ({
  standardSummary: input.standard
    ? buildStandardSummaryReport(input.standard)
    : "No standard selected for summary.",
  clauseSummary: input.clause
    ? buildClauseSummaryReport(input.clause, input.standard)
    : "No clause selected for summary.",
  comparisonReport: buildComparisonReport(input.standards ?? [], input.revision),
  complianceNotes: buildComplianceNotes(
    input.standards ?? (input.standard ? [input.standard] : []),
    input.mandatoryClauses ?? []
  ),
  engineeringReferences: buildEngineeringReferences(
    input.standards ?? (input.standard ? [input.standard] : [])
  ),
});
