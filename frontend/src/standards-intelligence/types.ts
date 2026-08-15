import type { EngineeringStandardMetadata } from "../config/standards/types";

export type StandardsPublisherId =
  | "is"
  | "irc"
  | "morth"
  | "nbc"
  | "astm"
  | "aashto"
  | "aci"
  | "asce"
  | "iso"
  | "iec"
  | "ieee"
  | "api"
  | "asme"
  | "bs"
  | "en"
  | "other";

export type StandardsAssistantAction =
  | "explain-standard"
  | "summarize-standard"
  | "explain-clause"
  | "compare-clauses"
  | "compare-standards"
  | "compare-revisions"
  | "applicability-guidance"
  | "related-standards"
  | "mandatory-requirements"
  | "locate-definitions";

export interface ParsedClauseReference {
  standardCode: string | null;
  clauseNumber: string | null;
  raw: string;
}

export interface StandardClause {
  id: string;
  standardId: string;
  standardCode: string;
  clauseNumber: string;
  title: string;
  summary: string;
  isMandatory: boolean;
  category: string;
  keywords: string[];
  definitionTerms?: string[];
}

export interface ClauseSearchFilters {
  disciplineId?: string | null;
  publisher?: StandardsPublisherId | null;
  category?: string | null;
  publicationYear?: string | null;
  revision?: string | null;
  mandatoryOnly?: boolean;
}

export interface StandardRelationshipLink {
  type:
    | "calculator"
    | "template"
    | "document"
    | "report"
    | "topic"
    | "workflow"
    | "ai-expert"
    | "standard";
  id: string;
  title: string;
  route?: string;
}

export interface ComplianceSupportBundle {
  applicableStandards: EngineeringStandardMetadata[];
  mandatoryClauses: StandardClause[];
  recommendedReferences: EngineeringStandardMetadata[];
  crossReferences: EngineeringStandardMetadata[];
  revisionNotes: string[];
}

export interface StandardsIntelligenceReports {
  standardSummary: string;
  clauseSummary: string;
  comparisonReport: string;
  complianceNotes: string;
  engineeringReferences: string;
}

export interface StandardsIntelligenceInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  selectedStandardCode?: string | null;
  selectedStandardId?: string | null;
  moduleSearchQuery?: string | null;
}

export interface StandardsIntelligenceResult {
  active: boolean;
  userIntent: StandardsAssistantAction | "general-standards" | null;
  matchedStandards: EngineeringStandardMetadata[];
  matchedClauses: StandardClause[];
  parsedClause: ParsedClauseReference | null;
  compliance: ComplianceSupportBundle | null;
  relationships: StandardRelationshipLink[];
  reports: StandardsIntelligenceReports | null;
  promptAugmentation: string;
  summaryText: string;
}

export interface FavoriteClauseBookmark {
  id: string;
  standardId: string;
  clauseId: string;
  label: string;
  createdAt: number;
}

/** Future-ready capabilities */
export interface StandardsIntelligenceCapabilities {
  ocr: boolean;
  aiClauseExtraction: boolean;
  automaticRevisionTracking: boolean;
  pmisCompliance: boolean;
}

export const STANDARDS_INTELLIGENCE_CAPABILITIES: StandardsIntelligenceCapabilities = {
  ocr: false,
  aiClauseExtraction: false,
  automaticRevisionTracking: false,
  pmisCompliance: false,
};
