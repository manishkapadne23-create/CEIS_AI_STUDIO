import React, { useMemo } from "react";
import { getDisciplineStandardsCount } from "../../config/standards";
import { useDisciplineWorkspaceConfig } from "../../config/disciplines/useDisciplineWorkspaceConfig";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import {
  getCategoryItemCount,
  resolveCategoryStatus,
  WORKSPACE_CATEGORY_DEFINITIONS,
  type WorkspaceCategoryId,
} from "../../workspace/utils/workspaceCategoryConfig";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";

const CompactModuleNav: React.FC = () => {
  const workspaceData = useAIEngineeringWorkspace();
  const { discipline } = workspaceData;
  const disciplineConfig = useDisciplineWorkspaceConfig();
  const {
    activeModuleId,
    openModule,
    isWorkspaceActive,
  } = useSarathiWorkspace();

  const standardsCount = useMemo(() => {
    if (!discipline.id) {
      return 0;
    }

    return getDisciplineStandardsCount(discipline.id);
  }, [discipline.id]);

  if (!isWorkspaceActive || !disciplineConfig) {
    return null;
  }

  const handleModuleClick = (moduleId: WorkspaceCategoryId) => {
    openModule(moduleId);
  };

  return (
    <div className="shrink-0 border-b border-slate-800/80 bg-slate-950/60">
      <div className="px-3 py-1.5 sm:px-4">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {WORKSPACE_CATEGORY_DEFINITIONS.map((category) => {
            const itemCount = getCategoryItemCount(
              category,
              workspaceData,
              standardsCount
            );
            const status = resolveCategoryStatus(
              category,
              workspaceData,
              itemCount
            );
            const isActive = activeModuleId === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleModuleClick(category.id)}
                aria-pressed={isActive}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left transition ${
                  isActive
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200"
                    : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <span className="text-base" aria-hidden="true">
                  {category.icon}
                </span>
                <span className="whitespace-nowrap text-xs font-medium sm:text-sm">
                  {category.title}
                </span>
                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                    status === "active"
                      ? "border-emerald-500/30 text-emerald-300"
                      : "border-slate-600 text-slate-500"
                  }`}
                >
                  {status === "active" ? "live" : "soon"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompactModuleNav;
