import { loadConflictPatterns } from "./loadEvidenceConfig.js";
import type { EvidenceCitation, EvidenceConflict } from "./types.js";

export const detectConflicts = (
  citations: EvidenceCitation[],
  responseText: string
): EvidenceConflict[] => {
  const config = loadConflictPatterns();
  const conflicts: EvidenceConflict[] = [];
  const standardTitles = citations
    .filter((citation) => citation.type === "engineering-standard")
    .map((citation) => citation.title);

  for (const pattern of config.patterns) {
    const matched = pattern.detectors.some((detector) =>
      new RegExp(detector, "i").test(responseText)
    );

    if (matched) {
      conflicts.push({
        id: `conflict-${pattern.id}`,
        type: pattern.id,
        label: pattern.label,
        description: pattern.description,
        references: standardTitles.slice(0, 4),
      });
    }
  }

  for (const pair of config.standardPairs) {
    const hasLeft = standardTitles.some((title) =>
      title.toUpperCase().includes(pair.left.toUpperCase())
    );
    const hasRight = standardTitles.some((title) =>
      title.toUpperCase().includes(pair.right.toUpperCase())
    );

    if (hasLeft && hasRight) {
      const pattern = config.patterns.find((entry) => entry.id === pair.conflictType);
      conflicts.push({
        id: `conflict-${pair.left}-${pair.right}`,
        type: pair.conflictType,
        label: pattern?.label ?? "Potential Conflict",
        description:
          pattern?.description ??
          `Both ${pair.left} and ${pair.right} referenced — verify applicability.`,
        references: [pair.left, pair.right],
      });
    }
  }

  const unique = new Map(conflicts.map((conflict) => [conflict.id, conflict]));
  return Array.from(unique.values());
};
