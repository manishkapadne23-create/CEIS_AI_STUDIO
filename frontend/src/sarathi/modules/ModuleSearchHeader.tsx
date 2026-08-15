import React from "react";

interface ModuleSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  onBack?: () => void;
  detailTitle?: string;
}

const ModuleSearchHeader: React.FC<ModuleSearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  onBack,
  detailTitle,
}) => (
  <div className="space-y-2">
    {onBack ? (
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-900"
        >
          ← Back
        </button>
        {detailTitle ? (
          <p className="truncate text-sm font-medium text-slate-200">
            {detailTitle}
          </p>
        ) : null}
      </div>
    ) : null}
    {searchPlaceholder ? (
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
      />
    ) : null}
  </div>
);

export default ModuleSearchHeader;
