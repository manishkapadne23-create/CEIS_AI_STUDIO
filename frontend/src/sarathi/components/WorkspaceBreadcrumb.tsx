import React from "react";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";

const WorkspaceBreadcrumb: React.FC = () => {
  const { activeDiscipline, isWorkspaceActive } = useSarathiWorkspace();
  const { workspace } = useEngineeringWorkspace();

  if (!isWorkspaceActive || !activeDiscipline) {
    return null;
  }

  const segments = [
    activeDiscipline.name,
    workspace.branch,
    workspace.specialization,
  ].filter(Boolean);

  return (
    <div className="shrink-0 border-b border-slate-800/80 bg-slate-900/40 px-4 py-2 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/80">
        Active Workspace
      </p>
      <nav
        aria-label="Workspace breadcrumb"
        className="mt-0.5 flex flex-wrap items-center gap-1 text-sm text-slate-300"
      >
        {segments.map((segment, index) => (
          <React.Fragment key={`${segment}-${index}`}>
            {index > 0 ? (
              <span className="text-slate-600" aria-hidden="true">
                /
              </span>
            ) : null}
            <span
              className={
                index === segments.length - 1
                  ? "font-medium text-white"
                  : "text-slate-400"
              }
            >
              {segment}
            </span>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default WorkspaceBreadcrumb;
