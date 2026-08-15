import React from "react";
import type { EngineeringNode } from "../data/engineeringTree";
import EngineeringKnowledgeTree from "./EngineeringKnowledgeTree";

export interface EngineeringExplorerProps {
  nodes: EngineeringNode[];
}

const EngineeringExplorer: React.FC<EngineeringExplorerProps> = ({
  nodes,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Engineering Knowledge Tree
      </p>
      <EngineeringKnowledgeTree nodes={nodes} />
    </div>
  );
};

export default EngineeringExplorer;
