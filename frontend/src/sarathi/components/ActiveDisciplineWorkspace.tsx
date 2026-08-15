import React from "react";
import AIEngineeringWorkspacePanel from "../../workspace/components/AIEngineeringWorkspacePanel";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";

const ActiveDisciplineWorkspace: React.FC = () => {
  const { activeDiscipline } = useSarathiWorkspace();
  const { workspace } = useEngineeringWorkspace();

  const title =
    workspace.specialization ??
    activeDiscipline?.name ??
    "Engineering Workspace";

  return (
    <div className="flex min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-800 bg-slate-900/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Active Workspace
        </p>
        <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
          {title}
        </h2>
        {activeDiscipline ? (
          <p className="mt-1 text-sm text-slate-400">
            {activeDiscipline.name}
            {workspace.branch ? ` · ${workspace.branch}` : ""}
            {workspace.specialization ? ` · ${workspace.specialization}` : ""}
          </p>
        ) : null}
      </div>

      <div>
        <AIEngineeringWorkspacePanel showHeader={false} />
      </div>
    </div>
  );
};

export default ActiveDisciplineWorkspace;
