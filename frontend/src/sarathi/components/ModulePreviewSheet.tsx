import React from "react";
import {
  WORKSPACE_CATEGORY_DEFINITIONS,
} from "../../workspace/utils/workspaceCategoryConfig";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import EngineeringModuleWorkspace from "../modules/EngineeringModuleWorkspace";
import ModulePreviewContent from "./ModulePreviewContent";
import WorkspacePanelHeader from "./WorkspacePanelHeader";

const ModulePreviewSheet: React.FC = () => {
  const {
    previewModuleId,
    activeModuleId,
    isMobilePreviewOpen,
    setMobilePreviewOpen,
    closeModule,
  } = useSarathiWorkspace();

  const displayModuleId = activeModuleId ?? previewModuleId;

  if (!isMobilePreviewOpen || !displayModuleId) {
    return null;
  }

  const definition = WORKSPACE_CATEGORY_DEFINITIONS.find(
    (category) => category.id === displayModuleId
  );

  const handleClose = () => {
    setMobilePreviewOpen(false);

    if (activeModuleId) {
      closeModule();
    }
  };

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close module preview"
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-preview-sheet-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl border border-slate-700 bg-slate-950 shadow-2xl"
      >
        <WorkspacePanelHeader
          label={activeModuleId ? "Active Module" : "Module Preview"}
          title={definition?.title ?? "Engineering Module"}
          description={definition?.description}
          icon={definition?.icon}
          action={
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300"
            >
              Close
            </button>
          }
        />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          {activeModuleId ? (
            <EngineeringModuleWorkspace moduleId={activeModuleId} />
          ) : (
            <ModulePreviewContent moduleId={displayModuleId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulePreviewSheet;
