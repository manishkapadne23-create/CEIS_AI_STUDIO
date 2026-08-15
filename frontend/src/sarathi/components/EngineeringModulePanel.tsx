import React, { useMemo } from "react";
import { getDisciplineStandardsCount } from "../../config/standards";
import { getDisciplineModuleConfigForCategory } from "../../config/disciplines/getDisciplineModuleConfigForCategory";
import { useDisciplineWorkspaceConfig } from "../../config/disciplines/useDisciplineWorkspaceConfig";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import {
  getCategoryItemCount,
  resolveCategoryStatus,
  WORKSPACE_CATEGORY_DEFINITIONS,
} from "../../workspace/utils/workspaceCategoryConfig";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import EngineeringModuleWorkspace from "../modules/EngineeringModuleWorkspace";
import ModulePreviewContent from "./ModulePreviewContent";

const EngineeringModulePanel: React.FC = () => {
  const {
    activeModuleId,
    previewModuleId,
    closeModule,
    isModulePanelCollapsed,
    toggleModulePanelCollapsed,
  } = useSarathiWorkspace();
  const workspaceData = useAIEngineeringWorkspace();
  const { discipline } = workspaceData;
  const disciplineConfig = useDisciplineWorkspaceConfig();

  const displayModuleId = activeModuleId ?? previewModuleId;
  const activeDefinition = displayModuleId
    ? WORKSPACE_CATEGORY_DEFINITIONS.find(
        (category) => category.id === displayModuleId
      )
    : null;

  const standardsCount = useMemo(() => {
    if (!discipline.id) {
      return 0;
    }

    return getDisciplineStandardsCount(discipline.id);
  }, [discipline.id]);

  const itemCount = activeDefinition
    ? getCategoryItemCount(activeDefinition, workspaceData, standardsCount)
    : 0;

  const status = activeDefinition
    ? resolveCategoryStatus(activeDefinition, workspaceData, itemCount)
    : "coming-soon";

  const activeModuleConfig = displayModuleId
    ? getDisciplineModuleConfigForCategory(disciplineConfig, displayModuleId)
    : null;

  const panelTitle =
    activeModuleConfig?.title ??
    activeDefinition?.title ??
    "Preview";

  if (isModulePanelCollapsed) {
    return (
      <aside className="flex h-full min-h-0 w-full flex-col items-center border-l border-slate-800 bg-slate-950/80 py-3 transition-[width] duration-300 ease-in-out">
        <button
          type="button"
          onClick={toggleModulePanelCollapsed}
          aria-expanded={false}
          aria-label="Expand module preview panel"
          title="Expand preview panel"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:border-slate-700 hover:bg-slate-900 hover:text-cyan-300"
        >
          <span aria-hidden="true">◀</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-l border-slate-800 bg-slate-950/80 transition-[width] duration-300 ease-in-out">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {activeDefinition?.icon ? (
            <span className="text-base" aria-hidden="true">
              {activeDefinition.icon}
            </span>
          ) : null}
          <span className="truncate text-sm font-medium text-slate-200">
            {panelTitle}
          </span>
          {activeDefinition ? (
            <span
              className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                status === "active"
                  ? "border-emerald-500/30 text-emerald-300"
                  : "border-slate-600 text-slate-500"
              }`}
            >
              {status === "active" ? "live" : "soon"}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {activeModuleId ? (
            <button
              type="button"
              onClick={closeModule}
              className="rounded-lg border border-slate-700 px-2 py-1 text-[10px] text-slate-400 hover:bg-slate-900"
            >
              Close
            </button>
          ) : null}
          <button
            type="button"
            onClick={toggleModulePanelCollapsed}
            aria-expanded
            aria-label="Collapse module preview panel"
            title="Collapse preview panel"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:bg-slate-900 hover:text-cyan-300"
          >
            <span aria-hidden="true">▶</span>
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
        {activeModuleId ? (
          <EngineeringModuleWorkspace moduleId={activeModuleId} />
        ) : displayModuleId ? (
          <ModulePreviewContent moduleId={displayModuleId} />
        ) : (
          <p className="text-xs text-slate-500">
            Select a module to preview details.
          </p>
        )}
      </div>
    </aside>
  );
};

export default EngineeringModulePanel;
