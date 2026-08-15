import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type { UniversalSearchEntityType } from "./types";

export type SearchScope = "all" | "workspace";

export interface UniversalSearchFilters {
  scope: SearchScope;
  disciplineId: string | null;
  moduleId: WorkspaceCategoryId | null;
  entityTypes: UniversalSearchEntityType[] | null;
  documentType: string | null;
  standardCode: string | null;
  calculatorId: string | null;
  templateCategory: string | null;
  dateFrom: number | null;
  dateTo: number | null;
  favoritesOnly: boolean;
  recentOnly: boolean;
  limit: number;
  dropdownLimit: number;
}

export const DEFAULT_SEARCH_FILTERS: UniversalSearchFilters = {
  scope: "all",
  disciplineId: null,
  moduleId: null,
  entityTypes: null,
  documentType: null,
  standardCode: null,
  calculatorId: null,
  templateCategory: null,
  dateFrom: null,
  dateTo: null,
  favoritesOnly: false,
  recentOnly: false,
  limit: 60,
  dropdownLimit: 12,
};

export const ENTITY_TYPE_FILTER_OPTIONS: Array<{
  id: UniversalSearchEntityType;
  label: string;
}> = [
  { id: "discipline", label: "Disciplines" },
  { id: "standard", label: "Standards" },
  { id: "document", label: "Documents" },
  { id: "calculator", label: "Calculators" },
  { id: "tool", label: "Tools" },
  { id: "learning", label: "Learning" },
  { id: "template", label: "Templates" },
  { id: "workflow", label: "Workflows" },
  { id: "conversation", label: "Conversations" },
  { id: "bookmark", label: "Bookmarks" },
  { id: "note", label: "Notes" },
  { id: "report", label: "Reports" },
  { id: "engineering-hub", label: "Engineering Hub" },
];

export const mergeSearchFilters = (
  base: UniversalSearchFilters,
  patch: Partial<UniversalSearchFilters>
): UniversalSearchFilters => ({ ...base, ...patch });

export const parseFiltersFromSearchParams = (
  params: URLSearchParams
): Partial<UniversalSearchFilters> => {
  const entityTypes = params.get("types");
  return {
    scope: params.get("scope") === "workspace" ? "workspace" : "all",
    disciplineId: params.get("discipline") || null,
    moduleId: (params.get("module") as WorkspaceCategoryId) || null,
    entityTypes: entityTypes
      ? (entityTypes.split(",") as UniversalSearchEntityType[])
      : null,
    favoritesOnly: params.get("favorites") === "1",
    recentOnly: params.get("recent") === "1",
  };
};

export const filtersToSearchParams = (
  query: string,
  filters: UniversalSearchFilters
): URLSearchParams => {
  const params = new URLSearchParams();
  if (query.trim()) {
    params.set("q", query.trim());
  }
  if (filters.scope === "workspace") {
    params.set("scope", "workspace");
  }
  if (filters.disciplineId) {
    params.set("discipline", filters.disciplineId);
  }
  if (filters.moduleId) {
    params.set("module", filters.moduleId);
  }
  if (filters.entityTypes?.length) {
    params.set("types", filters.entityTypes.join(","));
  }
  if (filters.favoritesOnly) {
    params.set("favorites", "1");
  }
  if (filters.recentOnly) {
    params.set("recent", "1");
  }
  return params;
};
