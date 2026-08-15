import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type UniversalSearchEntityType =
  | "discipline"
  | "standard"
  | "calculator"
  | "tool"
  | "workflow"
  | "knowledge"
  | "document"
  | "template"
  | "conversation"
  | "bookmark"
  | "note"
  | "report"
  | "learning"
  | "engineering-hub";

export type UniversalSearchGroupId =
  | "standards"
  | "documents"
  | "calculators"
  | "learning"
  | "reports"
  | "conversations"
  | "templates"
  | "tools"
  | "workflows"
  | "bookmarks"
  | "notes"
  | "disciplines"
  | "engineering-hub";

export interface UniversalSearchResult {
  id: string;
  type: UniversalSearchEntityType;
  group: UniversalSearchGroupId;
  title: string;
  subtitle?: string;
  disciplineId: string | null;
  disciplineName: string | null;
  resourceId?: string;
  moduleId?: WorkspaceCategoryId | null;
  score: number;
  matchedTerms?: string[];
  isFavorite?: boolean;
  isRecent?: boolean;
  deepLink?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface UniversalSearchGroup {
  id: UniversalSearchGroupId;
  label: string;
  icon: string;
  results: UniversalSearchResult[];
}

export interface UniversalSearchResponse {
  query: string;
  normalizedQuery: string;
  groups: UniversalSearchGroup[];
  totalCount: number;
  relatedSearches: string[];
  suggestedDisciplines: string[];
  fromCache: boolean;
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: number;
  pinned: boolean;
  resultCount?: number;
}

/** Future-ready search capabilities (semantic, vector, OCR, voice, etc.) */
export interface SearchCapabilities {
  keyword: boolean;
  partialMatch: boolean;
  exactMatch: boolean;
  abbreviations: boolean;
  codeNumbers: boolean;
  naturalLanguage: boolean;
  semantic: boolean;
  vector: boolean;
  ocr: boolean;
  drawing: boolean;
  image: boolean;
  voice: boolean;
}

export const SEARCH_CAPABILITIES: SearchCapabilities = {
  keyword: true,
  partialMatch: true,
  exactMatch: true,
  abbreviations: true,
  codeNumbers: true,
  naturalLanguage: true,
  semantic: false,
  vector: false,
  ocr: false,
  drawing: false,
  image: false,
  voice: false,
};
