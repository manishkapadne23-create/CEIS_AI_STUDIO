import React, { useMemo } from "react";
import {
  getDisciplineStandardsCount,
  getStandardsCatalogByDisciplineId,
} from "../../config/standards";import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import {
  getCategoryItemCount,
  resolveCategoryStatus,
  WORKSPACE_CATEGORY_DEFINITIONS,
  type WorkspaceCategoryId,
} from "../../workspace/utils/workspaceCategoryConfig";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";

interface ModulePreviewContentProps {
  moduleId: WorkspaceCategoryId;
}

const ModulePreviewContent: React.FC<ModulePreviewContentProps> = ({
  moduleId,
}) => {
  const workspaceData = useAIEngineeringWorkspace();
  const { openStandardKnowledge } = useSarathiWorkspace();
  const { discipline, sections, isPlaceholderDiscipline } = workspaceData;

  const definition = WORKSPACE_CATEGORY_DEFINITIONS.find(    (category) => category.id === moduleId
  );

  const standardsCount = useMemo(() => {
    if (!discipline.id) {
      return 0;
    }

    return getDisciplineStandardsCount(discipline.id);
  }, [discipline.id]);

  const itemCount = definition
    ? getCategoryItemCount(definition, workspaceData, standardsCount)
    : 0;
  const status = definition
    ? resolveCategoryStatus(definition, workspaceData, itemCount)
    : "coming-soon";

  const standardsCatalog = getStandardsCatalogByDisciplineId(discipline.id);

  if (!definition) {
    return null;
  }

  if (moduleId === "standards") {
    const topStandards = standardsCatalog?.standards.slice(0, 6) ?? [];

    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-500">
          Select a standard to view details.
        </p>
        <ul className="space-y-2">
          {topStandards.map((standard) => (
            <li key={standard.id}>
              <button
                type="button"
                onClick={() => openStandardKnowledge(standard)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs hover:border-cyan-500/40"
              >
                <span className="font-medium text-slate-200">
                  {standard.codeNumber}
                </span>
                <span className="mt-0.5 block line-clamp-1 text-slate-500">
                  {standard.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const sectionItems = definition.sectionKey
    ? sections[definition.sectionKey].items.slice(0, 6)
    : [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            status === "active"
              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
              : "border-slate-600 bg-slate-800/60 text-slate-400"
          }`}
        >
          {status === "active" ? "Active" : "Coming Soon"}
        </span>
        {itemCount > 0 ? (
          <span className="text-xs text-slate-500">{itemCount} items</span>
        ) : null}
      </div>
      <p className="text-xs text-slate-500">
        {sectionItems.length > 0
          ? "Select an item to preview."
          : isPlaceholderDiscipline
            ? "Content will activate as discipline data expands."
            : "No items available yet."}
      </p>
      {sectionItems.length > 0 ? (
        <ul className="space-y-2">
          {sectionItems.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs"
            >
              <p className="line-clamp-2 font-medium text-slate-200">
                {item.title}
              </p>
              {item.description ? (
                <p className="mt-1 line-clamp-2 text-slate-500">
                  {item.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default ModulePreviewContent;
