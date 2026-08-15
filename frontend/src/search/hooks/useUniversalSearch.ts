import { useEffect, useMemo, useState } from "react";

import { addSearchHistoryEntry } from "../searchHistory";
import { runDropdownSearch, runUniversalSearch } from "../searchEngine";
import {
  DEFAULT_SEARCH_FILTERS,
  mergeSearchFilters,
  type UniversalSearchFilters,
} from "../searchFilters";
import { getSearchSuggestions } from "../searchSuggestions";
import type { UniversalSearchResponse, UniversalSearchResult } from "../types";

const DEBOUNCE_MS = 200;

export const useUniversalSearch = (
  query: string,
  options?: Partial<UniversalSearchFilters> & {
    mode?: "dropdown" | "page";
    recordHistory?: boolean;
  }
) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isSearching, setIsSearching] = useState(false);

  const filters = useMemo(
    () => mergeSearchFilters(DEFAULT_SEARCH_FILTERS, options ?? {}),
    [options]
  );

  useEffect(() => {
    setIsSearching(true);
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const response: UniversalSearchResponse = useMemo(
    () => runUniversalSearch(debouncedQuery, filters),
    [debouncedQuery, filters]
  );

  useEffect(() => {
    if (options?.recordHistory && debouncedQuery.trim()) {
      addSearchHistoryEntry(debouncedQuery, response.totalCount);
    }
  }, [debouncedQuery, options?.recordHistory, response.totalCount]);

  const dropdownResults: UniversalSearchResult[] = useMemo(
    () => runDropdownSearch(debouncedQuery, filters),
    [debouncedQuery, filters]
  );

  const suggestions = useMemo(
    () => getSearchSuggestions(debouncedQuery, 8),
    [debouncedQuery]
  );

  return {
    response,
    dropdownResults,
    suggestions,
    isSearching,
    filters,
  };
};
