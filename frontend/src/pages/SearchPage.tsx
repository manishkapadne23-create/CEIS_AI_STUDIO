import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import HubPageContent from "../components/HubPageContent";
import AppShell from "../layout/AppShell";
import { useChatSession } from "../navigation/ChatSessionContext";
import { useSarathiWorkspace } from "../sarathi/context/SarathiWorkspaceContext";
import { resolveStandardsWithKnowledge } from "../knowledge/utils/resolveStandardsWithKnowledge";
import { useEngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import SearchFiltersBar from "../search/components/SearchFiltersBar";
import SearchResultsGroups from "../search/components/SearchResultsGroups";
import {
  bookmarkSearchResult,
  copySearchResultLink,
  executeSearchResultAction,
  shareSearchResult,
} from "../search/searchActions";
import {
  DEFAULT_SEARCH_FILTERS,
  filtersToSearchParams,
  mergeSearchFilters,
  parseFiltersFromSearchParams,
} from "../search/searchFilters";
import {
  clearSearchHistory,
  getSearchHistory,
  pinSearchHistoryEntry,
  removeSearchHistoryEntry,
} from "../search/searchHistory";
import { useUniversalSearch } from "../search/hooks/useUniversalSearch";
import type { UniversalSearchResult } from "../search/types";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(() =>
    mergeSearchFilters(
      DEFAULT_SEARCH_FILTERS,
      parseFiltersFromSearchParams(searchParams)
    )
  );
  const [historyVersion, setHistoryVersion] = useState(0);

  const { activeDiscipline, selectDiscipline, openModule, openStandard } =
    useSarathiWorkspace();
  const { selectChat } = useChatSession();
  const { workspace } = useEngineeringWorkspace();

  const searchFilters = useMemo(
    () =>
      mergeSearchFilters(filters, {
        disciplineId:
          filters.scope === "workspace"
            ? filters.disciplineId ?? activeDiscipline?.id ?? null
            : filters.disciplineId,
      }),
    [activeDiscipline?.id, filters]
  );

  const { response, isSearching } = useUniversalSearch(query, {
    ...searchFilters,
    recordHistory: true,
    mode: "page",
  });

  const history = useMemo(
    () => getSearchHistory(),
    [historyVersion, response.totalCount]
  );

  const refreshHistory = () => setHistoryVersion((value) => value + 1);

  const syncUrl = useCallback(
    (nextQuery: string, nextFilters = filters) => {
      const params = filtersToSearchParams(nextQuery, nextFilters);
      setSearchParams(params, { replace: true });
    },
    [filters, setSearchParams]
  );

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    syncUrl(query, filters);
  };

  const openResult = (result: UniversalSearchResult) => {
    executeSearchResultAction(result, {
      navigate,
      selectDiscipline,
      openModule,
      selectChat,
      openStandardByResource: (_disciplineId, resourceId) => {
        const disciplineName =
          result.disciplineName ??
          activeDiscipline?.name ??
          workspace.domain ??
          "Engineering";
        const resolved = resolveStandardsWithKnowledge({
          ...workspace,
          domain: disciplineName,
        });
        const standard = resolved.standards.find((entry) => entry.id === resourceId);
        if (standard) {
          openStandard(standard);
        }
      },
    });
  };

  return (
    <AppShell>
      <HubPageContent
        title="Universal Search"
        description="Search disciplines, standards, documents, calculators, conversations, templates, workflows, and more across Sarathi AI."
      >
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              🔍
            </div>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search engineering knowledge, IS codes, calculators, documents..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
              data-voice-search-ready="true"
              aria-label="Universal engineering search"
            />
          </div>

          <SearchFiltersBar
            filters={filters}
            onChange={(patch) => {
              const next = mergeSearchFilters(filters, patch);
              setFilters(next);
              syncUrl(query, next);
            }}
          />
        </form>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            {isSearching ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
                Searching platform...
              </div>
            ) : null}

            {!isSearching && query.trim() && response.totalCount === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center">
                <p className="text-lg font-medium text-white">No results found</p>
                <p className="mt-2 text-slate-400">
                  Try a different keyword, code number, or discipline filter.
                </p>
                {response.relatedSearches.length > 0 ? (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Related searches
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {response.relatedSearches.map((term: string) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setQuery(term);
                            syncUrl(term, filters);
                          }}
                          className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-800"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {response.suggestedDisciplines.length > 0 ? (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Suggested disciplines
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {response.suggestedDisciplines.map((discipline: string) => (
                        <button
                          key={discipline}
                          type="button"
                          onClick={() => {
                            setQuery(discipline);
                            syncUrl(discipline, filters);
                          }}
                          className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-800"
                        >
                          {discipline}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {!isSearching && response.totalCount > 0 ? (
              <div className="mb-4 text-sm text-slate-400">
                {response.totalCount} result{response.totalCount === 1 ? "" : "s"}
                {response.fromCache ? " · cached" : ""}
              </div>
            ) : null}

            <SearchResultsGroups
              groups={response.groups}
              onOpen={openResult}
              onBookmark={(result) => {
                bookmarkSearchResult(result);
                refreshHistory();
              }}
              onCopyLink={(result) => {
                void copySearchResultLink(result);
              }}
              onShare={(result) => {
                void shareSearchResult(result);
              }}
            />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Recent Searches</h2>
                <button
                  type="button"
                  onClick={() => {
                    clearSearchHistory();
                    refreshHistory();
                  }}
                  className="text-xs text-slate-400 hover:text-cyan-300"
                >
                  Clear
                </button>
              </div>
              <ul className="space-y-2">
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(entry.query);
                        syncUrl(entry.query, filters);
                      }}
                      className="min-w-0 flex-1 truncate text-left text-sm text-slate-300 hover:text-white"
                    >
                      {entry.query}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        pinSearchHistoryEntry(entry.id, !entry.pinned);
                        refreshHistory();
                      }}
                      className={`text-xs ${entry.pinned ? "text-cyan-300" : "text-slate-500"}`}
                      aria-label={entry.pinned ? "Unpin search" : "Pin search"}
                    >
                      {entry.pinned ? "★" : "☆"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeSearchHistoryEntry(entry.id);
                        refreshHistory();
                      }}
                      className="text-xs text-slate-500 hover:text-red-300"
                      aria-label="Remove search"
                    >
                      ×
                    </button>
                  </li>
                ))}
                {history.length === 0 ? (
                  <li className="text-sm text-slate-500">No search history yet.</li>
                ) : null}
              </ul>
            </div>
          </aside>
        </div>
      </HubPageContent>
    </AppShell>
  );
};

export default SearchPage;
