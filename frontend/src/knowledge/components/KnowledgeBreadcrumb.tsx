import React from "react";
import type { KnowledgeNode } from "../types";

export interface KnowledgeBreadcrumbProps {
  rootLabel?: string;
  path: KnowledgeNode[];
  onNavigate?: (node: KnowledgeNode) => void;
}

const KnowledgeBreadcrumb: React.FC<KnowledgeBreadcrumbProps> = ({
  rootLabel = "Engineering",
  path,
  onNavigate,
}) => {
  return (
    <nav
      aria-label="Knowledge breadcrumb"
      className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li className="font-semibold text-white">{rootLabel}</li>
        {path.map((node) => (
          <li key={node.id} className="flex items-center gap-2">
            <span className="text-slate-500">&gt;</span>
            {onNavigate ? (
              <button
                type="button"
                onClick={() => onNavigate(node)}
                className="transition hover:text-cyan-300"
              >
                {node.name}
              </button>
            ) : (
              <span>{node.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default KnowledgeBreadcrumb;
