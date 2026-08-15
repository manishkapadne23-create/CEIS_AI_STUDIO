import React from "react";
import { Link } from "react-router-dom";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { APP_ROUTES } from "../../navigation/routeConfig";
import { resolveModuleContent } from "../data/content/resolveModuleContent";
import { useKnowledgeModule } from "../hooks/useKnowledgeModule";
import KnowledgeModuleSectionView from "./KnowledgeModuleSectionView";

const KnowledgeModulePanel: React.FC = () => {
  const { module, specialization } = useKnowledgeModule();
  const { workspace } = useEngineeringWorkspace();

  const content = resolveModuleContent(
    module,
    specialization,
    workspace.codes
  );

  if (!content) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {content.panelBadgeLabel}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {content.title}
          </h2>
          {module?.disciplineName ? (
            <p className="mt-2 text-sm text-slate-400">
              {module.disciplineName}
              {specialization ? ` · ${specialization}` : ""}
            </p>
          ) : null}
          <Link
            to={APP_ROUTES.knowledgeGraph}
            className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300"
          >
            Explore in Knowledge Graph →
          </Link>
        </header>

        {content.sections.map((section) => (
          <KnowledgeModuleSectionView
            key={section.id}
            section={section}
          />
        ))}
      </div>
    </div>
  );
};

export default KnowledgeModulePanel;
