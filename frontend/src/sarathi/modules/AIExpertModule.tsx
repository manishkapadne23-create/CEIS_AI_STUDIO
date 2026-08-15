import React, { useMemo } from "react";
import { resolveEngineeringAIExpertProfile } from "../../ai/expert/resolveExpertProfile";
import { resolveDisciplineExpertIntelligence } from "../../ai/expertIntelligence";
import { resolveExpertRuntimeContext } from "../../ai/contextEngine";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";

const AIExpertModule: React.FC = () => {
  const { workspace } = useEngineeringWorkspace();
  const { discipline } = useAIEngineeringWorkspace();
  const { activeModuleId } = useSarathiWorkspace();
  const expert = resolveEngineeringAIExpertProfile(workspace);

  const intelligence = useMemo(() => {
    const runtimeContext = resolveExpertRuntimeContext({
      workspaceDomain: workspace.domain,
      workspaceBranch: workspace.branch,
      workspaceSpecialization: workspace.specialization,
      workspaceCountry: workspace.country,
      workspaceCodes: workspace.codes,
      activeModuleId: activeModuleId ?? "ai-expert",
      activeDisciplineId: discipline.id,
      activeDisciplineName: discipline.name ?? workspace.domain,
      conversationId: "ai-expert-panel",
      userMessage: "",
      conversationHistory: [],
    });

    return resolveDisciplineExpertIntelligence(runtimeContext, "");
  }, [
    workspace,
    activeModuleId,
    discipline.id,
    discipline.name,
  ]);

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-500">
          Active mode
        </p>
        <p className="mt-1 text-sm text-cyan-300">
          {intelligence.activeExpertMode.label}
        </p>
        <p className="mt-1 text-xs text-slate-400">{expert.responseStyle}</p>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-500">
          Expert modes
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {intelligence.availableExpertModes.map((mode) => (
            <span
              key={mode.id}
              className={`rounded-full border px-2 py-0.5 text-[10px] ${
                mode.id === intelligence.activeExpertMode.id
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 text-slate-500"
              }`}
            >
              {mode.label}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-500">
          Capabilities
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {intelligence.capabilities.map((capability) => (
            <span
              key={capability.id}
              className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400"
            >
              {capability.label}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-500">
          Output formats
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {intelligence.availableOutputFormats.map((format) => (
            <span
              key={format.id}
              className={`rounded-full border px-2 py-0.5 text-[10px] ${
                format.id === intelligence.outputFormat.id
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 text-slate-500"
              }`}
            >
              {format.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AIExpertModule;
