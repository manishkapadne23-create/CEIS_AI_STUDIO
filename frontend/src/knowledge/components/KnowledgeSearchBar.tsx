import React from "react";

export interface KnowledgeSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const KnowledgeSearchBar: React.FC<KnowledgeSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search knowledge topics",
}) => {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
      Search Knowledge
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      />
    </label>
  );
};

export default KnowledgeSearchBar;
