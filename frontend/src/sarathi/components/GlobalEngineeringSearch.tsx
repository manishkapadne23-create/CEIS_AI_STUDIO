import React, { useState } from "react";
import UserProfileMenu from "../../components/UserProfileMenu";
import { useGlobalEngineeringSearch } from "../hooks/useGlobalEngineeringSearch";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import type { EngineeringSearchResult } from "../types";

interface GlobalEngineeringSearchProps {
  onSelectResult: (result: EngineeringSearchResult) => void;
}

const typeIcons: Record<EngineeringSearchResult["type"], string> = {
  discipline: "🏗️",
  standard: "📜",
  calculator: "🔢",
  tool: "🛠️",
  workflow: "🔄",
  knowledge: "📚",
};

const GlobalEngineeringSearch: React.FC<GlobalEngineeringSearchProps> = ({
  onSelectResult,
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { activeDiscipline, searchScope, setSearchScope } =
    useSarathiWorkspace();

  const results = useGlobalEngineeringSearch(query, {
    disciplineId: activeDiscipline?.id ?? null,
    scope: searchScope,
  });

  return (
    <div className="relative border-b border-slate-800 bg-slate-900/90 px-4 py-3 sm:px-6">
      <div className="flex items-start gap-3 lg:gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchScope("workspace")}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                searchScope === "workspace"
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 text-slate-400 hover:bg-slate-900"
              }`}
            >
              {activeDiscipline
                ? `Workspace: ${activeDiscipline.name}`
                : "Current Workspace"}
            </button>
            <button
              type="button"
              onClick={() => setSearchScope("all")}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                searchScope === "all"
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 text-slate-400 hover:bg-slate-900"
              }`}
            >
              All Engineering
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              🔍
            </div>
            <div className="relative min-w-0 flex-1">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setIsFocused(false), 150);
                }}
                placeholder={
                  searchScope === "all"
                    ? "Search all engineering disciplines..."
                    : "Search within the active workspace..."
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                aria-label="Global engineering search"
              />

              {isFocused && query.trim() && results.length > 0 ? (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
                  <ul className="max-h-80 overflow-y-auto py-1">
                    {results.map((result) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onMouseDown={() => onSelectResult(result)}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-900"
                        >
                          <span className="text-lg" aria-hidden="true">
                            {typeIcons[result.type]}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-medium text-slate-100">
                              {result.title}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-slate-400">
                              {result.subtitle ?? result.disciplineName}
                            </span>
                          </span>
                          <span className="ml-auto shrink-0 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                            {result.type}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <UserProfileMenu className="hidden shrink-0 pt-1 lg:block" />
      </div>
    </div>
  );
};

export default GlobalEngineeringSearch;
