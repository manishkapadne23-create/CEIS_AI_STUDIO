import React from "react";
import type { KnowledgeNode } from "../types";

export interface KnowledgeTreePanelProps {
  nodes: KnowledgeNode[];
  selectedNodeId?: string | null;
  emptyMessage?: string;
}

const KnowledgeTreePanel: React.FC<KnowledgeTreePanelProps> = ({
  nodes,
  selectedNodeId = null,
  emptyMessage = "No knowledge nodes available for this discipline.",
}) => {
  if (nodes.length === 0) {
    return (
      <p className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-1" role="tree">
      {nodes.map((node) => (
        <li
          key={node.id}
          className={`rounded-lg border px-3 py-2 text-sm ${
            selectedNodeId === node.id
              ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
              : "border-slate-800 bg-slate-950/70 text-white"
          }`}
        >
          {node.name}
        </li>
      ))}
    </ul>
  );
};

export default KnowledgeTreePanel;
