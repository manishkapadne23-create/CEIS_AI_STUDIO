import React from "react";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import {
  WORKSPACE_CATEGORY_DEFINITIONS,
} from "../../workspace/utils/workspaceCategoryConfig";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import ModulePreviewContent from "./ModulePreviewContent";

const ModulePreviewPanel: React.FC = () => {
  const { previewModuleId } = useSarathiWorkspace();
  const { discipline } = useAIEngineeringWorkspace();

  const activeDefinition = previewModuleId
    ? WORKSPACE_CATEGORY_DEFINITIONS.find(
        (category) => category.id === previewModuleId
      )
    : null;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-slate-800 bg-slate-950/80">
      <div className="shrink-0 border-b border-slate-800 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Module Preview
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {activeDefinition
            ? activeDefinition.title
            : "Hover a module to preview"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {previewModuleId ? (
          <ModulePreviewContent moduleId={previewModuleId} />
        ) : (
          <div className="space-y-4">
            <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Workspace Context
              </p>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                <li>Discipline: {discipline.name ?? "Not selected"}</li>
                <li>Branch: {discipline.branch ?? "—"}</li>
                <li>Specialization: {discipline.specialization ?? "—"}</li>
                <li>
                  Capabilities: {discipline.enabledCapabilities}/
                  {discipline.totalCapabilities}
                </li>
              </ul>
            </section>
            <p className="text-xs text-slate-500">
              Hover Standards, Calculators, Tools, or other modules to see a
              quick preview here while you chat with Sarathi AI.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ModulePreviewPanel;
