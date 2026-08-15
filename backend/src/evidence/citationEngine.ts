import { loadCitationTypes, loadEvidenceSources } from "./loadEvidenceConfig.js";
import type {
  EvidenceCitation,
  EvidenceCitationTypeId,
  EvidenceEngineInput,
  EvidenceItem,
  EvidenceSourceId,
  KnowledgeClassification,
} from "./types.js";
import { extractStandardReferences } from "./evidenceCollector.js";

let citationCounter = 0;
const nextCitationId = () => `cite-${++citationCounter}`;

const inferCitationType = (
  reference: string,
  sourceId: EvidenceSourceId
): EvidenceCitationTypeId => {
  if (/\b(IS|IRC|IEC|ASTM|BS|ISO|NBC|MORTH|ACI|AASHTO)\b/i.test(reference)) {
    return "engineering-standard";
  }
  if (/\bclause\b|\bsection\b|\barticle\b/i.test(reference)) {
    return "clause-reference";
  }
  if (sourceId === "specifications") {
    return "specification";
  }
  if (sourceId === "research-papers") {
    return "research-paper";
  }
  if (sourceId === "user-documents") {
    return "user-document";
  }
  if (sourceId === "internal-knowledge-base") {
    return "company-knowledge";
  }
  if (/\bmanual\b|\bhandbook\b|\bguide\b/i.test(reference)) {
    return "design-manual";
  }
  return "ai-generated";
};

const classifyKnowledge = (
  citationType: EvidenceCitationTypeId
): KnowledgeClassification => {
  if (
    citationType === "engineering-standard" ||
    citationType === "clause-reference" ||
    citationType === "design-manual" ||
    citationType === "specification" ||
    citationType === "research-paper" ||
    citationType === "company-knowledge" ||
    citationType === "user-document"
  ) {
    return "verified-knowledge";
  }
  return "ai-analysis";
};

export const buildCitations = (
  input: EvidenceEngineInput,
  evidenceItems: EvidenceItem[]
): EvidenceCitation[] => {
  citationCounter = 0;
  const citationTypes = loadCitationTypes();
  const evidenceSources = loadEvidenceSources();
  const citations: EvidenceCitation[] = [];

  const standardRefs = [
    ...new Set([
      ...input.aiResponse.standards,
      ...extractStandardReferences(input.aiResponse.detailedResponse),
      ...extractStandardReferences(input.userMessage),
    ]),
  ];

  for (const standard of standardRefs) {
    const type = inferCitationType(standard, "standards");
    const typeConfig = citationTypes.find((entry) => entry.id === type);
    const sourceConfig = evidenceSources.find((entry) => entry.id === "standards");

    citations.push({
      id: nextCitationId(),
      type,
      typeLabel: typeConfig?.label ?? "Engineering Standard",
      title: standard,
      reference: standard,
      sourceId: "standards",
      sourceLabel: sourceConfig?.label ?? "Applicable Standards",
      classification: classifyKnowledge(type),
      confidence: typeConfig?.trustWeight ?? 0.9,
      expandable: true,
      clauseRef: null,
      relatedStandardIds: [],
      relatedCalculatorIds: [],
    });
  }

  for (const reference of input.aiResponse.references) {
    const type = inferCitationType(reference, "internal-knowledge-base");
    const typeConfig = citationTypes.find((entry) => entry.id === type);

    citations.push({
      id: nextCitationId(),
      type,
      typeLabel: typeConfig?.label ?? "Reference",
      title: reference,
      reference,
      sourceId: "internal-knowledge-base",
      sourceLabel: "Internal Knowledge Base",
      classification: classifyKnowledge(type),
      confidence: typeConfig?.trustWeight ?? 0.7,
      expandable: true,
    });
  }

  for (const knowledgeRef of input.orchestration?.knowledgeReferences ?? []) {
    citations.push({
      id: nextCitationId(),
      type: "company-knowledge",
      typeLabel: "Company Knowledge",
      title: knowledgeRef,
      reference: knowledgeRef,
      sourceId: "internal-knowledge-base",
      sourceLabel: "Internal Knowledge Base",
      classification: "verified-knowledge",
      confidence: 0.8,
      expandable: true,
    });
  }

  if (citations.length === 0 && evidenceItems.length === 0) {
    citations.push({
      id: nextCitationId(),
      type: "ai-generated",
      typeLabel: "AI Generated",
      title: "AI Engineering Analysis",
      reference: input.aiResponse.summary,
      sourceId: "calculations",
      sourceLabel: "Engineering Calculations",
      classification: "ai-analysis",
      confidence: 0.4,
      expandable: false,
    });
  }

  for (const item of evidenceItems) {
    item.citations = citations.filter((citation) => citation.sourceId === item.sourceId);
  }

  return citations;
};

export const buildEvidencePromptAugmentation = (): string =>
  [
    "========================================",
    "Engineering Evidence & Citation Engine (EECE)",
    "========================================",
    "Structure every response with these sections:",
    "1. Answer",
    "2. Evidence",
    "3. Applicable Standards",
    "4. Engineering Assumptions",
    "5. Limitations",
    "6. Recommendations",
    "",
    "Clearly distinguish:",
    "- Verified Engineering Knowledge (standards, manuals, specifications)",
    "- AI Analysis (reasoning and interpretation)",
    "- Engineering Assumptions (explicit assumptions made)",
    "- Engineering Recommendations (actionable guidance)",
    "",
    "Cite standards using full reference (e.g. IS 456:2000, IRC 37:2018).",
    "State limitations when evidence is incomplete.",
  ].join("\n");
