import React from "react";

import type { UniversalSearchGroup, UniversalSearchResult } from "../types";

interface SearchResultsGroupsProps {
  groups: UniversalSearchGroup[];
  onOpen: (result: UniversalSearchResult) => void;
  onBookmark: (result: UniversalSearchResult) => void;
  onCopyLink: (result: UniversalSearchResult) => void;
  onShare: (result: UniversalSearchResult) => void;
  compact?: boolean;
}

const SearchResultsGroups: React.FC<SearchResultsGroupsProps> = ({
  groups,
  onOpen,
  onBookmark,
  onCopyLink,
  onShare,
  compact = false,
}) => {
  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.id}>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              {group.icon}
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {group.label}
            </h2>
            <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-500">
              {group.results.length}
            </span>
          </div>

          <ul className="space-y-2">
            {group.results.map((result) => (
              <li
                key={result.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 transition hover:border-slate-700"
              >
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <button
                    type="button"
                    onClick={() => onOpen(result)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="font-medium text-white">{result.title}</p>
                    {result.subtitle ? (
                      <p className="mt-1 truncate text-sm text-slate-400">
                        {result.subtitle}
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full border border-slate-700 px-2 py-0.5 uppercase">
                        {result.type.replace("-", " ")}
                      </span>
                      {result.disciplineName ? (
                        <span>{result.disciplineName}</span>
                      ) : null}
                    </div>
                  </button>

                  {!compact ? (
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onOpen(result)}
                        className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-500"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => onBookmark(result)}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                      >
                        Bookmark
                      </button>
                      <button
                        type="button"
                        onClick={() => onCopyLink(result)}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                      >
                        Copy Link
                      </button>
                      <button
                        type="button"
                        onClick={() => onShare(result)}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                      >
                        Share
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default SearchResultsGroups;
