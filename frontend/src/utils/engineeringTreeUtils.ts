import type { EngineeringNode } from "../data/engineeringTree";

export function findNodePath(
  nodes: EngineeringNode[],
  targetId: string,
  path: EngineeringNode[] = []
): EngineeringNode[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node];

    if (node.id === targetId) {
      return currentPath;
    }

    if (node.children?.length) {
      const childPath = findNodePath(
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
}

export function findNodePathByName(
  nodes: EngineeringNode[],
  targetName: string,
  path: EngineeringNode[] = []
): EngineeringNode[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node];

    if (node.name === targetName) {
      return currentPath;
    }

    if (node.children?.length) {
      const childPath = findNodePathByName(
        node.children,
        targetName,
        currentPath
      );

      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
}

export function searchTreeByQuery(
  nodes: EngineeringNode[],
  query: string
): { node: EngineeringNode; path: EngineeringNode[] } | null {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return null;
  }

  const search = (
    currentNodes: EngineeringNode[],
    path: EngineeringNode[] = []
  ): { node: EngineeringNode; path: EngineeringNode[] } | null => {
    for (const node of currentNodes) {
      const currentPath = [...path, node];

      if (node.name.toLowerCase().includes(normalizedQuery)) {
        return { node, path: currentPath };
      }

      if (node.children?.length) {
        const match = search(node.children, currentPath);

        if (match) {
          return match;
        }
      }
    }

    return null;
  };

  return search(nodes);
}

export function getAncestorIds(path: EngineeringNode[]): string[] {
  return path.slice(0, -1).map((node) => node.id);
}

export function applyWorkspaceFromPath(
  path: EngineeringNode[],
  setters: {
    setDomain: (domain: string | null) => void;
    setBranch: (branch: string | null) => void;
    setSpecialization: (specialization: string | null) => void;
  }
): void {
  if (path.length === 0) {
    return;
  }

  setters.setDomain(path[0].name);

  if (path.length === 1) {
    setters.setBranch(null);
    setters.setSpecialization(null);
    return;
  }

  if (path.length === 2) {
    setters.setBranch(null);
    setters.setSpecialization(path[1].name);
    return;
  }

  setters.setBranch(path[1].name);
  setters.setSpecialization(path[path.length - 1].name);
}

export function getWorkspaceSelectionName(workspace: {
  domain: string | null;
  branch: string | null;
  specialization: string | null;
}): string | null {
  return (
    workspace.specialization ??
    workspace.branch ??
    workspace.domain
  );
}
