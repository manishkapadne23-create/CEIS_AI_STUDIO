import type { KnowledgeNode } from "../types";

export const countKnowledgeNodes = (
  nodes: KnowledgeNode[]
): number =>
  nodes.reduce((total, node) => {
    const childCount = node.children
      ? countKnowledgeNodes(node.children)
      : 0;

    return total + 1 + childCount;
  }, 0);

export const findKnowledgeNodePath = (
  nodes: KnowledgeNode[],
  targetId: string,
  path: KnowledgeNode[] = []
): KnowledgeNode[] | null => {
  for (const node of nodes) {
    const currentPath = [...path, node];

    if (node.id === targetId) {
      return currentPath;
    }

    if (node.children?.length) {
      const childPath = findKnowledgeNodePath(
        node.children,
        targetId,
        currentPath
      );

      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
};

export const findKnowledgeNodeByName = (
  nodes: KnowledgeNode[],
  targetName: string,
  path: KnowledgeNode[] = []
): { node: KnowledgeNode; path: KnowledgeNode[] } | null => {
  for (const node of nodes) {
    const currentPath = [...path, node];

    if (node.name === targetName) {
      return { node, path: currentPath };
    }

    if (node.children?.length) {
      const match = findKnowledgeNodeByName(
        node.children,
        targetName,
        currentPath
      );

      if (match) {
        return match;
      }
    }
  }

  return null;
};

export const toDisciplineId = (disciplineName: string): string =>
  disciplineName
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
