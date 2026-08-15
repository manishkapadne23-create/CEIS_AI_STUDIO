import React from "react";

import type { SearchSuggestion } from "../searchSuggestions";
import type { UniversalSearchResult } from "../types";

interface SearchDropdownProps {
  query: string;
  results: UniversalSearchResult[];
  suggestions: SearchSuggestion[];
  isSearching: boolean;
  onSelectResult: (result: UniversalSearchResult) => void;
  onSelectSuggestion: (text: string) => void;
  onViewAll: () => void;
}

const typeIcons: Record<string, string> = {
  discipline: "🏗️",
  standard: "📜",
  calculator: "🔢",
  tool: "🛠️",
  workflow: "🔄",
  knowledge: "📚",
  document: "📄",
  template: "📋",
  conversation: "💬",
  bookmark: "🔖",
  note: "📝",
  report: "📊",
  learning: "🎓",
  "engineering-hub": "📰",
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  query,
  results,
  suggestions,
  isSearching,
  onSelectResult,
  onSelectSuggestion,
  onViewAll,
}) => {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
      {isSearching ? (
        <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>
      ) : null}

      {!hasQuery && suggestions.length > 0 ? (
        <div className="border-b border-slate-800 px-4 py-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
            Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                type="button"
                onMouseDown={() => onSelectSuggestion(suggestion.text)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-900"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {hasQuery && results.length > 0 ? (
        <>
          <ul className="max-h-80 overflow-y-auto py-1">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  onMouseDown={() => onSelectResult(result)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-900"
                >
                  <span className="text-lg" aria-hidden="true">
                    {typeIcons[result.type] ?? "🔍"}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-slate-100">
                      {result.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-400">
                      {result.subtitle ?? result.disciplineName ?? result.type}
                    </span>
                  </span>
                  <span className="ml-auto shrink-0 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                    {result.type.replace("-", " ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-800 px-4 py-2">
            <button
              type="button"
              onMouseDown={onViewAll}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-cyan-300 hover:bg-slate-900"
            >
              View all results for &quot;{query.trim()}&quot;
            </button>
          </div>
        </>
      ) : null}

      {hasQuery && !isSearching && results.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-slate-300">No results found</p>
          <button
            type="button"
            onMouseDown={onViewAll}
            className="mt-3 text-sm text-cyan-300 hover:text-cyan-200"
          >
            Search entire platform
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SearchDropdown;
