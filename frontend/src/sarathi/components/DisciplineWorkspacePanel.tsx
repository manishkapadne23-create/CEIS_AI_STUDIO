import React from "react";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import { resolveStandardsWithKnowledge } from "../../knowledge/utils/resolveStandardsWithKnowledge";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import WorkspacePanelSection from "../../workspace/components/WorkspacePanelSection";

const DisciplineWorkspacePanel: React.FC = () => {
  const workspaceData = useAIEngineeringWorkspace();
  const { workspace } = useEngineeringWorkspace();
  const { openStandard } = useSarathiWorkspace();
  const { discipline, sections } = workspaceData;

  const handleStandardClick = (standardId: string) => {
    const resolved = resolveStandardsWithKnowledge(workspace);
    const standard = resolved.standards.find(
      (entry) => entry.id === standardId
    );

    if (standard) {
      openStandard(standard);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Discipline Workspace
        </p>
        <h3 className="mt-1 text-lg font-semibold text-white">
          {discipline.name}
        </h3>
        {discipline.specialization ? (
          <p className="mt-1 text-sm text-cyan-300">
            {discipline.specialization}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-slate-400 line-clamp-3">
          {discipline.knowledgeOverview ??
            "Registry-driven workspace for the selected discipline."}
        </p>
      </div>

      <WorkspacePanelSection section={sections.aiExpert} />

      <WorkspacePanelSection section={sections.standards} />
      <ul className="mt-2 space-y-1 px-1">
        {sections.standards.items.map((item) => (
          <li key={`open-${item.id}`}>
            <button
              type="button"
              onClick={() => handleStandardClick(item.id)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/5"
            >
              View {item.title}
            </button>
          </li>
        ))}
      </ul>

      <WorkspacePanelSection section={sections.calculators} />
      <WorkspacePanelSection section={sections.professionalTools} />
      <WorkspacePanelSection section={sections.workflows} />
    </div>
  );
};

export default DisciplineWorkspacePanel;
