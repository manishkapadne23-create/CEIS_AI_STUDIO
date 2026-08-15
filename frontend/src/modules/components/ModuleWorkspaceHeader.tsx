import React from "react";
import type { EngineeringDisciplineWorkspaceConfig } from "../../config/disciplines";

interface ModuleWorkspaceHeaderProps {
  disciplineConfig: EngineeringDisciplineWorkspaceConfig;
  moduleTitle: string;
  moduleDescription: string;
  icon: string;
}

const ModuleWorkspaceHeader: React.FC<ModuleWorkspaceHeaderProps> = ({
  disciplineConfig,
  moduleTitle,
  moduleDescription,
  icon,
}) => (
  <header className="mb-6 border-b border-slate-800 pb-4">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">
      {disciplineConfig.workspaceLabel}
    </p>
    <nav
      aria-label="Module breadcrumb"
      className="mt-1 flex flex-wrap items-center gap-1.5 text-sm"
    >
      <span className="font-semibold text-white">{disciplineConfig.name}</span>
      <span className="text-slate-600" aria-hidden="true">
        /
      </span>
      <span className="font-medium text-cyan-300">{moduleTitle}</span>
    </nav>
    <div className="mt-3 flex items-start gap-3">
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <div>
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          {moduleTitle} Workspace
        </h2>
        <p className="mt-1 text-sm text-slate-400">{moduleDescription}</p>
      </div>
    </div>
  </header>
);

export default ModuleWorkspaceHeader;
