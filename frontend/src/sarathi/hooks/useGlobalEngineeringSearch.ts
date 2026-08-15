import { useMemo } from "react";
import { searchEngineeringKnowledge } from "../../knowledge/engine";
import type { EngineeringSearchResult } from "../types";

export const searchEngineeringCatalog = (
  query: string,
  options?: {
    disciplineId?: string | null;
    scope?: "all" | "workspace";
    categoryId?: string | null;
    moduleId?: string | null;
  }
): EngineeringSearchResult[] =>
  searchEngineeringKnowledge(query, {
    disciplineId: options?.disciplineId,
    scope: options?.scope,
    categoryId: options?.categoryId as never,
    moduleId: options?.moduleId as never,
  });

export const useGlobalEngineeringSearch = (
  query: string,
  options?: {
    disciplineId?: string | null;
    scope?: "all" | "workspace";
    categoryId?: string | null;
    moduleId?: string | null;
  }
) =>
  useMemo(
    () => searchEngineeringCatalog(query, options),
    [
      query,
      options?.disciplineId,
      options?.scope,
      options?.categoryId,
      options?.moduleId,
    ]
  );
