import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { KnowledgeFrameworkSpecializationWorkspace } from "../types";
import {
  buildKnowledgeDisciplinePath,
  buildKnowledgeCategoryPath,
} from "../knowledgeRoutes";
import KnowledgeCategoryFolderList from "./KnowledgeCategoryFolderList";

interface KnowledgeSpecializationWorkspaceProps {
  workspace: KnowledgeFrameworkSpecializationWorkspace;
}

const KnowledgeSpecializationWorkspace: React.FC<
  KnowledgeSpecializationWorkspaceProps
> = ({ workspace }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const selectedCategory = workspace.categories.find(
    (category) => category.id === selectedCategoryId
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-slate-500">
          Knowledge Workspace
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-100">
          {workspace.specializationName}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {workspace.disciplineName} · {workspace.categories.length} knowledge
          folders
        </p>
        <p className="mt-2 font-mono text-[10px] text-slate-600">
          {workspace.path}
        </p>
        <Link
          to={buildKnowledgeDisciplinePath(workspace.disciplineId)}
          className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300"
        >
          ← Back to {workspace.disciplineName}
        </Link>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Knowledge Folders
        </h3>
        <KnowledgeCategoryFolderList
          categories={workspace.categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </section>

      {selectedCategory ? (
        <section className="rounded-xl border border-dashed border-slate-700 bg-slate-950/30 px-4 py-6 text-center">
          <p className="text-sm font-medium text-slate-300">
            {selectedCategory.label}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Folder ready for documents. Storage path:
          </p>
          <p className="mt-1 font-mono text-[10px] text-slate-600">
            {buildKnowledgeCategoryPath(
              workspace.disciplineId,
              workspace.specializationId,
              selectedCategory.id
            )}
          </p>
        </section>
      ) : (
        <p className="text-center text-xs text-slate-500">
          Select a folder to view its workspace path. Documents will be added
          in a future sprint.
        </p>
      )}
    </div>
  );
};

export default KnowledgeSpecializationWorkspace;
