import React from "react";
import { useNavigate } from "react-router-dom";
import type { KnowledgeFrameworkDisciplineTree } from "../types";
import { buildKnowledgeWorkspacePath } from "../knowledgeRoutes";
import KnowledgeCategoryFolderList from "./KnowledgeCategoryFolderList";

interface KnowledgeDisciplineHubProps {
  tree: KnowledgeFrameworkDisciplineTree;
}

const KnowledgeDisciplineHub: React.FC<KnowledgeDisciplineHubProps> = ({
  tree,
}) => {
  const navigate = useNavigate();
  const { discipline, disciplineCategories } = tree;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-100">
          Discipline Knowledge
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          Shared knowledge folders for {discipline.name}. Each specialization
          inherits the same structure.
        </p>
        <KnowledgeCategoryFolderList categories={disciplineCategories} />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-100">
          Specializations
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          Open a specialization workspace to browse its knowledge folders.
        </p>
        <ul className="flex flex-col gap-2">
          {discipline.specializations.map((specialization) => (
            <li key={specialization.id}>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    buildKnowledgeWorkspacePath(
                      discipline.id,
                      specialization.id
                    )
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-left transition-colors hover:border-cyan-500/40 hover:bg-slate-900/80"
              >
                <span className="text-sm font-medium text-slate-100">
                  {specialization.label}
                </span>
                <span className="font-mono text-[10px] text-slate-600">
                  {specialization.path}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default KnowledgeDisciplineHub;
