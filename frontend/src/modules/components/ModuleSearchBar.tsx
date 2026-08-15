import React from "react";
import { useSarathiWorkspace } from "../../sarathi/context/SarathiWorkspaceContext";

interface ModuleSearchBarProps {
  placeholder: string;
}

const ModuleSearchBar: React.FC<ModuleSearchBarProps> = ({ placeholder }) => {
  const { moduleSearchQuery, setModuleSearchQuery } = useSarathiWorkspace();

  return (
    <input
      type="search"
      value={moduleSearchQuery}
      onChange={(event) => setModuleSearchQuery(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
      aria-label={placeholder}
    />
  );
};

export default ModuleSearchBar;
