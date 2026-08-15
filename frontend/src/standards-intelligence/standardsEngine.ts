import { getAllStandardsAcrossDisciplines, getStandardById } from "../config/standards";
import type { EngineeringStandardMetadata } from "../config/standards/types";
import { getClausesForStandard } from "./clauseCatalog";
import {
  inferStandardsAssistantAction,
  isStandardsIntelligenceQuery,
  parseClauseReference,
} from "./clauseParser";
import { smartSearch } from "./clauseSearch";
import { buildComplianceRelationships } from "./relationshipEngine";
import { compareRevisions, getLatestRevisionNote } from "./revisionManager";
import { buildStandardsReports } from "./standardsReports";
import type {
  ComplianceSupportBundle,
  StandardsIntelligenceInput,
  StandardsIntelligenceResult,
} from "./types";

const buildComplianceBundle = (
  standards: EngineeringStandardMetadata[],
  mandatoryClauses: ReturnType<typeof smartSearch>["clauses"]
): ComplianceSupportBundle => {
  const crossReferences = standards.flatMap((standard) =>
    (standard.relatedStandardIds ?? [])
      .map((id) => getStandardById(id))
      .filter((entry): entry is EngineeringStandardMetadata => Boolean(entry))
  );

  return {
    applicableStandards: standards,
    mandatoryClauses: mandatoryClauses.filter((clause) => clause.isMandatory),
    recommendedReferences: standards.filter((standard) => standard.isPopular),
    crossReferences,
    revisionNotes: standards.map(getLatestRevisionNote),
  };
};

const formatPromptAugmentation = (
  input: StandardsIntelligenceInput,
  result: Omit<StandardsIntelligenceResult, "promptAugmentation" | "summaryText" | "active">
): string => {
  const lines = [
    "========================================",
    "Engineering Standards Intelligence (ESIE)",
    "========================================",
    `Discipline: ${input.disciplineName ?? "General"}`,
    `User intent: ${result.userIntent ?? "general-standards"}`,
  ];

  if (result.parsedClause?.standardCode) {
    lines.push(`Parsed standard: ${result.parsedClause.standardCode}`);
  }
  if (result.parsedClause?.clauseNumber) {
    lines.push(`Parsed clause: ${result.parsedClause.clauseNumber}`);
  }

  if (result.matchedStandards.length > 0) {
    lines.push("", "Matched standards:");
    for (const standard of result.matchedStandards.slice(0, 5)) {
      lines.push(
        `- ${standard.codeNumber} (${standard.edition}): ${standard.shortDescription}`
      );
    }
  }

  if (result.matchedClauses.length > 0) {
    lines.push("", "Matched clauses:");
    for (const clause of result.matchedClauses.slice(0, 5)) {
      lines.push(
        `- ${clause.standardCode} §${clause.clauseNumber} ${clause.title}: ${clause.summary}`
      );
    }
  }

  if (result.compliance) {
    lines.push("", "Compliance context:");
    lines.push(
      `- Applicable: ${result.compliance.applicableStandards.map((s) => s.codeNumber).join(", ")}`
    );
    lines.push(
      `- Mandatory clauses indexed: ${result.compliance.mandatoryClauses.length}`
    );
  }

  if (result.reports) {
    lines.push("", "Report excerpts:");
    lines.push(result.reports.standardSummary.slice(0, 600));
    if (result.reports.clauseSummary.length > 20) {
      lines.push(result.reports.clauseSummary.slice(0, 400));
    }
  }

  if (result.relationships.length > 0) {
    lines.push("", "Related workspace links:");
    for (const link of result.relationships.slice(0, 6)) {
      lines.push(`- [${link.type}] ${link.title}`);
    }
  }

  lines.push(
    "",
    "Instructions: Explain engineering standards clearly. Cite clause numbers when known.",
    "Distinguish mandatory (shall) vs recommended (should) requirements.",
    "Flag when official publisher documents must be consulted for final compliance."
  );

  return lines.join("\n");
};

export const runStandardsIntelligenceEngine = (
  input: StandardsIntelligenceInput
): StandardsIntelligenceResult => {
  const inactive: StandardsIntelligenceResult = {
    active: false,
    userIntent: null,
    matchedStandards: [],
    matchedClauses: [],
    parsedClause: null,
    compliance: null,
    relationships: [],
    reports: null,
    promptAugmentation: "",
    summaryText: "",
  };

  const message = input.userMessage.trim();
  const moduleQuery = input.moduleSearchQuery?.trim() ?? "";
  const combined = [message, moduleQuery].filter(Boolean).join(" ");

  const isStandardsModule = input.selectedStandardId || input.selectedStandardCode;
  const shouldActivate =
    isStandardsIntelligenceQuery(combined) ||
    Boolean(isStandardsModule) ||
    /\bstandards?\s*&\s*codes?\b/i.test(combined);

  if (!shouldActivate) {
    return inactive;
  }

  const userIntent = inferStandardsAssistantAction(combined);
  const parsedClause = parseClauseReference(combined);
  const searchQuery =
    parsedClause.standardCode ?? input.selectedStandardCode ?? combined;

  const searchResults = smartSearch(searchQuery, {
    disciplineId: input.disciplineId,
    mandatoryOnly: userIntent === "mandatory-requirements",
  });

  let matchedStandards = searchResults.standards;
  let matchedClauses = searchResults.clauses;

  if (input.selectedStandardId) {
    const selected = getStandardById(input.selectedStandardId);
    if (selected && !matchedStandards.some((s) => s.id === selected.id)) {
      matchedStandards = [selected, ...matchedStandards];
    }
    matchedClauses = [
      ...getClausesForStandard(input.selectedStandardId),
      ...matchedClauses,
    ];
  }

  if (matchedStandards.length === 0 && input.disciplineId) {
    matchedStandards = getAllStandardsAcrossDisciplines()
      .filter((standard) => standard.disciplineId === input.disciplineId)
      .slice(0, 5);
  }

  const primaryStandard = matchedStandards[0] ?? null;
  const primaryClause = matchedClauses[0] ?? null;
  const revision =
    primaryStandard && userIntent === "compare-revisions"
      ? compareRevisions(primaryStandard.id)
      : null;

  const compliance = buildComplianceBundle(matchedStandards, matchedClauses);
  const relationships = primaryStandard
    ? buildComplianceRelationships(matchedStandards)
    : [];

  const reports = buildStandardsReports({
    standard: primaryStandard,
    clause: primaryClause,
    standards: matchedStandards,
    mandatoryClauses: compliance.mandatoryClauses,
    revision,
  });

  const partialResult = {
    userIntent,
    matchedStandards,
    matchedClauses,
    parsedClause,
    compliance,
    relationships,
    reports,
  };

  const summaryText = primaryStandard
    ? `ESIE: ${primaryStandard.codeNumber} — ${matchedClauses.length} clause(s), ${relationships.length} related link(s)`
    : `ESIE: ${matchedStandards.length} standard(s) matched`;

  return {
    active: true,
    ...partialResult,
    promptAugmentation: formatPromptAugmentation(input, partialResult),
    summaryText,
  };
};

export { isStandardsIntelligenceQuery, inferStandardsAssistantAction };
