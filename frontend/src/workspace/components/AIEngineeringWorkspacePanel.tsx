import React, { useMemo, useState } from "react";
import { getStandardsRegistry } from "../../knowledge/standards/standardsRegistry";
import { useAIEngineeringWorkspace } from "../hooks/useAIEngineeringWorkspace";
import StandardsCodesDetail from "./StandardsCodesDetail";
import WorkspaceCategoryCard from "./WorkspaceCategoryCard";
import WorkspaceSectionDetail from "./WorkspaceSectionDetail";
import {
  getCategoryItemCount,
  resolveCategoryStatus,
  WORKSPACE_CATEGORY_DEFINITIONS,
  type WorkspaceCategoryId,
} from "../utils/workspaceCategoryConfig";

interface AIEngineeringWorkspacePanelProps {
  showHeader?: boolean;
}

const AIEngineeringWorkspacePanel: React.FC<
  AIEngineeringWorkspacePanelProps
> = ({ showHeader = true }) => {
  const workspaceData = useAIEngineeringWorkspace();
  const { discipline, sections, isPlaceholderDiscipline } = workspaceData;
  const [activeCategory, setActiveCategory] =
    useState<WorkspaceCategoryId | null>(null);

  const standardsCount = useMemo(() => {
    if (!discipline.id) {
      return 0;
    }

    const registry = getStandardsRegistry(discipline.id);

    return registry?.documents.length ?? 0;
  }, [discipline.id]);

  const activeDefinition = WORKSPACE_CATEGORY_DEFINITIONS.find(
    (category) => category.id === activeCategory
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {showHeader ? (
          <header className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              AI Engineering Workspace
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {discipline.name ?? "Select a Discipline"}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {discipline.branch ? (
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-slate-300">
                  Branch: {discipline.branch}
                </span>
              ) : null}
              {discipline.specialization ? (
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-300">
                  {discipline.specialization}
                </span>
              ) : null}
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-slate-400">
                {discipline.country}
              </span>
              {discipline.codes.length > 0 ? (
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-slate-400">
                  {discipline.codes.join(" · ")}
                </span>
              ) : null}
              {isPlaceholderDiscipline ? (
                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-slate-400">
                  Placeholder Data
                </span>
              ) : (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                  Live Data
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Knowledge Repository
                </p>
                <p className="mt-1 font-medium text-slate-200">
                  {discipline.knowledgeModuleName ?? "Not resolved"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Capability Registry
                </p>
                <p className="mt-1 font-medium text-slate-200">
                  {discipline.enabledCapabilities} /{" "}
                  {discipline.totalCapabilities} enabled
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 sm:col-span-2 lg:col-span-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Selected Discipline
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                  {discipline.knowledgeOverview ??
                    "Select a specialization to load knowledge context."}
                </p>
              </div>
            </div>
          </header>
        ) : null}

        {activeCategory === "standards" ? (
          <StandardsCodesDetail
            disciplineId={discipline.id}
            isPlaceholder={isPlaceholderDiscipline}
            onBack={() => setActiveCategory(null)}
          />
        ) : activeCategory && activeDefinition?.sectionKey ? (
          <WorkspaceSectionDetail
            section={sections[activeDefinition.sectionKey]}
            icon={activeDefinition.icon}
            onBack={() => setActiveCategory(null)}
          />
        ) : activeCategory &&
          (activeCategory === "documents" ||
            activeCategory === "learning-hub") ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-900"
            >
              ← Back
            </button>
            <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-white">
                {activeDefinition?.title}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                This category is coming soon for the active discipline.
              </p>
            </div>
          </div>
        ) : (
          <div className="workspace-card-grid">
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

              return (
                <div key={category.id} className="min-w-0">
                  <WorkspaceCategoryCard
                    icon={category.icon}
                    title={category.title}
                    description={category.description}
                    status={status}
                    itemCount={itemCount}
                    onOpen={() => setActiveCategory(category.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEngineeringWorkspacePanel;
