import { globalSearchEdm } from "../services/edmSearch.service.js";
import type { EoeOrchestratorResult } from "../orchestrator/types.js";
import type { EvidenceEngineInput, EvidenceItem } from "./types.js";

const STANDARD_PATTERN =
  /\b(IS|IRC|IEC|ASTM|BS|ISO|NBC|MORTH|ACI|AASHTO|API|ASME|EN)\s*[\d:./-]+[A-Za-z0-9./-]*/gi;

export const extractStandardReferences = (text: string): string[] => {
  const matches = text.match(STANDARD_PATTERN) ?? [];
  return [...new Set(matches.map((value) => value.trim()))];
};

export const collectEvidence = async (
  input: EvidenceEngineInput
): Promise<EvidenceItem[]> => {
  const combinedText = [
    input.userMessage,
    input.aiResponse.detailedResponse,
    input.aiResponse.summary,
    ...input.aiResponse.standards,
    ...input.aiResponse.references,
    ...(input.orchestration?.knowledgeReferences ?? []),
  ].join("\n");

  const standards = [
    ...new Set([
      ...input.aiResponse.standards,
      ...extractStandardReferences(combinedText),
      ...(input.orchestration?.moduleContributions.flatMap(
        (contribution) => contribution.references
      ) ?? []),
    ]),
  ];

  const items: EvidenceItem[] = [];

  if (standards.length > 0) {
    items.push({
      id: "evidence-standards",
      label: "Applicable Standards",
      sourceId: "standards",
      summary: `${standards.length} standard reference(s) identified.`,
      citations: [],
    });
  }

  if (input.orchestration?.knowledgeReferences.length) {
    items.push({
      id: "evidence-internal-kb",
      label: "Internal Knowledge Base",
      sourceId: "internal-knowledge-base",
      summary: `${input.orchestration.knowledgeReferences.length} knowledge base reference(s).`,
      citations: [],
    });
  }

  try {
    const edmResults = await globalSearchEdm({
      q: input.userMessage,
      disciplineId: input.orchestration?.context.disciplineId ?? undefined,
      limit: 5,
    });

    if (edmResults.length > 0) {
      items.push({
        id: "evidence-edm",
        label: "Engineering Digital Memory",
        sourceId: "internal-knowledge-base",
        summary: `${edmResults.length} EDM record(s) matched.`,
        citations: [],
      });
    }
  } catch {
    // EDM unavailable — continue without blocking evidence pipeline
  }

  const hasCalculations = /\b(calculate|calculation|formula|equation|mix design)\b/i.test(
    combinedText
  );
  if (hasCalculations) {
    items.push({
      id: "evidence-calculations",
      label: "Engineering Calculations",
      sourceId: "calculations",
      summary: "Calculation-related content detected in response.",
      citations: [],
    });
  }

  const hasManuals = /\b(manual|handbook|guide|code of practice)\b/i.test(combinedText);
  if (hasManuals) {
    items.push({
      id: "evidence-manuals",
      label: "Technical Manuals & Design Guides",
      sourceId: "technical-manuals",
      summary: "Design manual or guide references detected.",
      citations: [],
    });
  }

  return items;
};

export const collectOrchestrationKnowledge = (
  orchestration?: EoeOrchestratorResult | EvidenceEngineInput["orchestration"]
): string[] => {
  if (!orchestration) {
    return [];
  }

  if ("composedResponse" in orchestration) {
    return orchestration.composedResponse.knowledgeReferences;
  }

  return orchestration.knowledgeReferences ?? [];
};
