import React from "react";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { resolveStandardsWithKnowledge } from "../../knowledge/utils/resolveStandardsWithKnowledge";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";

const EngineeringAssistantSidebar: React.FC = () => {
  const workspaceData = useAIEngineeringWorkspace();
  const { workspace } = useEngineeringWorkspace();
  const { openStandard } = useSarathiWorkspace();
  const { discipline, sections } = workspaceData;

  const resolvedStandards = resolveStandardsWithKnowledge(workspace);
  const topStandards = resolvedStandards.standards.slice(0, 5);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-slate-800 bg-slate-950/80">
      <div className="border-b border-slate-800 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Engineering Assistant
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Context, expert profile, and quick references.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            AI Expert
          </p>
          <h3 className="mt-1 font-semibold text-white">
            {sections.aiExpert.items[0]?.title ?? "Engineering Expert"}
          </h3>
          <p className="mt-2 text-xs text-slate-400 line-clamp-4">
            {sections.aiExpert.items[0]?.description ??
              "Select a discipline to activate the AI expert profile."}
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Workspace Context
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            <li>Discipline: {discipline.name ?? "Not selected"}</li>
            <li>Specialization: {discipline.specialization ?? "—"}</li>
            <li>
              Capabilities: {discipline.enabledCapabilities}/
              {discipline.totalCapabilities}
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Standards
          </p>
          <ul className="mt-2 space-y-2">
            {topStandards.length > 0 ? (
              topStandards.map((standard) => (
                <li key={standard.id}>
                  <button
                    type="button"
                    onClick={() => openStandard(standard)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300"
                  >
                    <span className="font-medium">{standard.code}</span>
                    <span className="mt-1 block text-slate-500">
                      {standard.title}
                    </span>
                  </button>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-500">
                No standards resolved for the current workspace.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Active Workflows
          </p>
          <ul className="mt-2 space-y-2">
            {sections.workflows.items.slice(0, 4).map((workflow) => (
              <li
                key={workflow.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-300"
              >
                <span className="font-medium text-slate-200">
                  {workflow.title}
                </span>
                {workflow.badge ? (
                  <span className="mt-1 block text-slate-500">
                    {workflow.badge}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
};

export default EngineeringAssistantSidebar;
