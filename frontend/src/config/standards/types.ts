export type EngineeringStandardPublicationStatus =
  | "active"
  | "latest-revision"
  | "new-standard"
  | "withdrawn"
  | "superseded";

/** Future-ready attachment slot — not used until PDF integration. */
export interface StandardAttachmentRef {
  id: string;
  label: string;
  type: "pdf" | "official-link";
  url?: string;
}

/** Future-ready revision record — populated when revision sync is enabled. */
export interface StandardRevisionRecord {
  edition: string;
  publishedAt?: string;
  summary?: string;
}

export interface EngineeringStandardMetadata {
  id: string;
  disciplineId: string;
  /** Display code or family identifier (e.g. IRC, IS 456). */
  codeNumber: string;
  /** Full standard title. */
  title: string;
  /** @deprecated Use codeNumber — kept for backward compatibility. */
  name: string;
  edition: string;
  publisher: string;
  category: string;
  keywords: string[];
  shortDescription: string;
  scope: string;
  relatedStandardIds: string[];
  importantNotes: string[];
  externalLink: string;
  status: EngineeringStandardPublicationStatus;
  isPopular?: boolean;
  isLatest?: boolean;
  /** Future: PDF attachment metadata only. */
  attachments?: StandardAttachmentRef[];
  /** Future: revision history from official sources. */
  revisionHistory?: StandardRevisionRecord[];
}

export interface DisciplineStandardsCatalog {
  disciplineId: string;
  disciplineName: string;
  standards: EngineeringStandardMetadata[];
}

export type StandardsFilterId =
  | "all"
  | "latest"
  | "popular"
  | "recently-used"
  | "favourite";

export type StandardsUpdateType =
  | "latest-revision"
  | "new-standard"
  | "withdrawn"
  | "superseded";

export interface StandardKnowledgePanelData {
  standard: EngineeringStandardMetadata;
  summary: string;
  scope: string;
  relatedStandards: EngineeringStandardMetadata[];
  latestRevision: string;
  importantNotes: string[];
}
