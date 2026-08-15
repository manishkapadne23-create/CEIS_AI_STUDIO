import React, { useEffect, useState } from "react";
import type { EngineeringNode } from "../data/engineeringTree";
import { useEngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import { useKnowledgeModule } from "../knowledge/hooks/useKnowledgeModule";
import {
  applyWorkspaceFromPath,
  findNodePath,
  findNodePathByName,
  getAncestorIds,
  getWorkspaceSelectionName,
} from "../utils/engineeringTreeUtils";

export interface EngineeringKnowledgeTreeProps {
  nodes: EngineeringNode[];
}

interface KnowledgeTreeNodeProps {
  node: EngineeringNode;
  selectedId: string | null;
  specializationId: string | null;
  expandedIds: Set<string>;
  onToggleExpanded: (id: string) => void;
  onSelect: (node: EngineeringNode) => void;
  level: number;
}

const KnowledgeTreeNode: React.FC<KnowledgeTreeNodeProps> = ({
  node,
  selectedId,
  specializationId,
  expandedIds,
  onToggleExpanded,
  onSelect,
  level,
}) => {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isSpecializationHighlighted =
    specializationId === node.id;

  return (
    <li>
      <div
        className={`flex items-center gap-2 rounded-lg border px-2 py-2 text-sm transition ${
          isSpecializationHighlighted
            ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-sm shadow-cyan-500/20"
            : isSelected
              ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
              : "border-transparent bg-transparent text-white hover:border-slate-700 hover:bg-slate-900/60"
        }`}
        style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleExpanded(node.id)}
            aria-label={
              isExpanded
                ? `Collapse ${node.name}`
                : `Expand ${node.name}`
            }
            aria-expanded={isExpanded}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs text-slate-400 transition hover:bg-slate-800 hover:text-cyan-300"
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        ) : (
          <span
            className="inline-block h-6 w-6 shrink-0"
            aria-hidden="true"
          />
        )}

        <button
          type="button"
          onClick={() => onSelect(node)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {node.icon ? (
            <span className="text-base" aria-hidden="true">
              {node.icon}
            </span>
          ) : null}
          <span className="font-medium">{node.name}</span>
        </button>
      </div>

      {hasChildren && isExpanded ? (
        <ul className="mt-0.5 space-y-0.5 border-l border-slate-800 ml-5">
          {node.children!.map((child) => (
            <KnowledgeTreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              specializationId={specializationId}
              expandedIds={expandedIds}
              onToggleExpanded={onToggleExpanded}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

const EngineeringKnowledgeTree: React.FC<
  EngineeringKnowledgeTreeProps
> = ({ nodes }) => {
  const {
    workspace,
    setDomain,
    setBranch,
    setSpecialization,
  } = useEngineeringWorkspace();
  const { specializationNode } = useKnowledgeModule();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );

  const selectionName = getWorkspaceSelectionName(workspace);
  const specializationId = specializationNode?.id ?? null;

  useEffect(() => {
    const highlightName =
      workspace.specialization ?? selectionName;

    if (!highlightName || nodes.length === 0) {
      setSelectedId(null);
      return;
    }

    const path = findNodePathByName(nodes, highlightName);

    if (!path) {
      setSelectedId(null);
      return;
    }

    const node = path[path.length - 1];

    setSelectedId(node.id);
    setExpandedIds((previous) => {
      const next = new Set(previous);
      getAncestorIds(path).forEach((id) => next.add(id));
      return next;
    });
  }, [nodes, selectionName, workspace.specialization]);

  const handleToggleExpanded = (id: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleSelect = (node: EngineeringNode) => {
    const path = findNodePath(nodes, node.id);

    if (!path) {
      return;
    }

    setSelectedId(node.id);
    applyWorkspaceFromPath(path, {
      setDomain,
      setBranch,
      setSpecialization,
    });
  };

  if (nodes.length === 0) {
    return (
      <p className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">
        Knowledge tree is not available for this discipline yet.
      </p>
    );
  }

  return (
    <ul className="space-y-0.5" role="tree">
      {nodes.map((node) => (
        <KnowledgeTreeNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          specializationId={specializationId}
          expandedIds={expandedIds}
          onToggleExpanded={handleToggleExpanded}
          onSelect={handleSelect}
          level={0}
        />
      ))}
    </ul>
  );
};

export default EngineeringKnowledgeTree;
