import { loadReferenceGraphRules } from "./loadEvidenceConfig.js";
import type { EvidenceCitation, ReferenceGraph } from "./types.js";

export const buildReferenceGraph = (
  citations: EvidenceCitation[],
  primaryIntent?: string
): ReferenceGraph => {
  const rules = loadReferenceGraphRules();
  const intentNodes =
    (primaryIntent && rules.intentBindings[primaryIntent]) || rules.nodeTypes;

  const nodes = intentNodes.map((type, index) => {
    const relatedCitation = citations[index];
    return {
      id: `${type}-${index + 1}`,
      type,
      label: relatedCitation?.title ?? type.replace(/-/g, " "),
    };
  });

  const edges = rules.relations
    .filter(
      (relation) =>
        nodes.some((node) => node.type === relation.from) &&
        nodes.some((node) => node.type === relation.to)
    )
    .map((relation) => {
      const fromNode = nodes.find((node) => node.type === relation.from);
      const toNode = nodes.find((node) => node.type === relation.to);
      return {
        from: fromNode?.id ?? relation.from,
        to: toNode?.id ?? relation.to,
        relationship: relation.relationship,
      };
    });

  return { nodes, edges };
};
