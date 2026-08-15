import React from "react";

import { ENTITY_TYPE_FILTER_OPTIONS } from "../searchFilters";
import type { UniversalSearchFilters } from "../searchFilters";
import { DISCIPLINE_DEFINITIONS } from "../../knowledge/data/disciplineManifest";

interface SearchFiltersBarProps {
  filters: UniversalSearchFilters;
  onChange: (patch: Partial<UniversalSearchFilters>) => void;
}

const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({
  filters,
  onChange,
}) => (
  <div className="flex flex-wrap gap-2">
    <select
      value={filters.scope}
      onChange={(event) =>
        onChange({
          scope: event.target.value as UniversalSearchFilters["scope"],
        })
      }
      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
      aria-label="Search scope"
    >
      <option value="all">All Engineering</option>
      <option value="workspace">Current Workspace</option>
    </select>

    <select
      value={filters.disciplineId ?? ""}
      onChange={(event) =>
        onChange({ disciplineId: event.target.value || null })
      }
      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
      aria-label="Filter by discipline"
    >
      <option value="">All Disciplines</option>
      {DISCIPLINE_DEFINITIONS.map((discipline) => (
        <option key={discipline.id} value={discipline.id}>
          {discipline.name}
        </option>
      ))}
    </select>

    <select
      value={filters.entityTypes?.[0] ?? ""}
      onChange={(event) =>
        onChange({
          entityTypes: event.target.value
            ? [event.target.value as NonNullable<UniversalSearchFilters["entityTypes"]>[number]]
            : null,
        })
      }
      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
      aria-label="Filter by type"
    >
      <option value="">All Types</option>
      {ENTITY_TYPE_FILTER_OPTIONS.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={() => onChange({ favoritesOnly: !filters.favoritesOnly })}
      className={`rounded-xl border px-3 py-2 text-sm transition ${
        filters.favoritesOnly
          ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
          : "border-slate-700 text-slate-300 hover:bg-slate-800"
      }`}
    >
      Favorites
    </button>

    <button
      type="button"
      onClick={() => onChange({ recentOnly: !filters.recentOnly })}
      className={`rounded-xl border px-3 py-2 text-sm transition ${
        filters.recentOnly
          ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
          : "border-slate-700 text-slate-300 hover:bg-slate-800"
      }`}
    >
      Recent
    </button>
  </div>
);

export default SearchFiltersBar;
