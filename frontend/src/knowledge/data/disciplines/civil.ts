import type { EngineeringNode } from "../../../data/engineeringTree";
import { engineeringTree } from "../../../data/engineeringTree";
import type { KnowledgeModule, KnowledgeNode } from "../../types";

const toKnowledgeNodes = (
  nodes: EngineeringNode[]
): KnowledgeNode[] =>
  nodes.map((node) => ({
    id: node.id,
    name: node.name,
    icon: node.icon,
    children: node.children
      ? toKnowledgeNodes(node.children)
      : undefined,
  }));

export const civilKnowledgeModule: KnowledgeModule = {
  id: "civil-engineering",
  disciplineId: "civil-engineering",
  disciplineName: "Civil Engineering",
  version: "1.0.0",
  rootNodes: toKnowledgeNodes(
    engineeringTree.filter((node) => node.id === "civil-engineering")
  ),
  metadata: {
    description: "Civil engineering knowledge hierarchy.",
    tags: ["civil", "infrastructure"],
    lastUpdated: "2026-07-30",
  },
};
