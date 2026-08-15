import { engineeringTree } from "../../data/engineeringTree";
import type { EngineeringNode } from "../../data/engineeringTree";
import { disciplineKnowledgeSchemaMap } from "../../knowledge/data/schemas/disciplineSchemaRegistry";
import { DISCIPLINE_DEFINITIONS } from "../../knowledge/data/disciplineManifest";

export interface NavigatorSpecialization {
  node: EngineeringNode;
  path: EngineeringNode[];
}

export const getDisciplineTreeNode = (
  disciplineName: string
): EngineeringNode | null =>
  engineeringTree.find((node) => node.name === disciplineName) ?? null;

const collectLeafSpecializations = (
  nodes: EngineeringNode[],
  path: EngineeringNode[],
  results: NavigatorSpecialization[]
) => {
  for (const node of nodes) {
    const currentPath = [...path, node];

    if (node.children?.length) {
      collectLeafSpecializations(node.children, currentPath, results);
      continue;
    }

    results.push({ node, path: currentPath });
  }
};

export const getNavigatorSpecializations = (
  disciplineId: string,
  disciplineName: string
): NavigatorSpecialization[] => {
  const disciplineNode = getDisciplineTreeNode(disciplineName);

  if (disciplineNode?.children?.length) {
    const results: NavigatorSpecialization[] = [];
    collectLeafSpecializations(
      disciplineNode.children,
      [disciplineNode],
      results
    );
    return results;
  }

  const schema = disciplineKnowledgeSchemaMap[disciplineId];

  if (schema) {
    return Object.values(schema.specializations).map((specialization) => ({
      node: { id: specialization.id, name: specialization.title },
      path: [
        { id: disciplineId, name: disciplineName },
        { id: specialization.id, name: specialization.title },
      ],
    }));
  }

  return [];
};

export const getDisciplineDefinitionByName = (disciplineName: string) =>
  DISCIPLINE_DEFINITIONS.find(
    (discipline) => discipline.name === disciplineName
  ) ?? null;
