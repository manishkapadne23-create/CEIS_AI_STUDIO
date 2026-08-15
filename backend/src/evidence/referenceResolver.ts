import type { EvidenceCitation, EvidencePanelItem } from "./types.js";

const CALCULATOR_BINDINGS: Record<string, string[]> = {
  "IS 456": ["concrete-mix-calculator", "structural-design-calculator"],
  "IRC 37": ["pavement-design-calculator", "traffic-load-calculator"],
  "IRC 58": ["bridge-load-calculator"],
  M40: ["concrete-mix-calculator"],
};

export const resolveRelatedCalculators = (citation: EvidenceCitation): string[] => {
  const matches = Object.entries(CALCULATOR_BINDINGS)
    .filter(([key]) => citation.title.toUpperCase().includes(key.toUpperCase()))
    .flatMap(([, calculators]) => calculators);

  return [...new Set(matches)];
};

export const resolveRelatedStandards = (
  citation: EvidenceCitation,
  allCitations: EvidenceCitation[]
): string[] =>
  allCitations
    .filter(
      (entry) =>
        entry.id !== citation.id && entry.type === "engineering-standard"
    )
    .map((entry) => entry.title)
    .slice(0, 5);

export const buildEvidencePanel = (
  citations: EvidenceCitation[]
): EvidencePanelItem[] =>
  citations.map((citation) => ({
    citationId: citation.id,
    title: citation.title,
    type: citation.type,
    typeLabel: citation.typeLabel,
    summary: `${citation.sourceLabel} — ${citation.classification.replace(/-/g, " ")}`,
    canExpand: citation.expandable,
    canOpenSource: Boolean(citation.sourceUri),
    relatedStandards: resolveRelatedStandards(citation, citations),
    relatedCalculators: resolveRelatedCalculators(citation),
    sourceUri: citation.sourceUri ?? null,
  }));
