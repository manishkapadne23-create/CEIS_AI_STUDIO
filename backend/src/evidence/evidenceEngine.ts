import { buildEvidencePromptAugmentation, buildCitations } from "./citationEngine.js";
import { detectConflicts } from "./conflictDetector.js";
import { collectEvidence } from "./evidenceCollector.js";
import { recordEvidenceAudit } from "./auditLogger.js";
import { buildReferenceGraph } from "./referenceGraph.js";
import { buildEvidencePanel } from "./referenceResolver.js";
import { assessTrust } from "./trustEngine.js";
import type {
  EngineeringEvidencePackage,
  EvidenceEngineInput,
  KnowledgeClassificationBundle,
} from "./types.js";

const extractSection = (content: string, header: string): string => {
  const regex = new RegExp(
    `(?:^|\\n)#+\\s*${header}[:\\s]*([\\s\\S]*?)(?=\\n#+|$)`,
    "i"
  );
  const match = content.match(regex);
  return match?.[1]?.trim() ?? "";
};

const extractBullets = (text: string): string[] =>
  text
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter((line) => line.length > 0);

const buildClassification = (
  input: EvidenceEngineInput,
  citations: ReturnType<typeof buildCitations>
): KnowledgeClassificationBundle => {
  const assumptions =
    extractBullets(
      extractSection(input.aiResponse.detailedResponse, "Engineering Assumptions") ||
        extractSection(input.aiResponse.detailedResponse, "Assumptions")
    ) || [];

  const recommendations =
    input.aiResponse.recommendations.length > 0
      ? input.aiResponse.recommendations
      : extractBullets(
          extractSection(input.aiResponse.detailedResponse, "Recommendations")
        );

  return {
    verifiedKnowledge: citations
      .filter((citation) => citation.classification === "verified-knowledge")
      .map((citation) => citation.title),
    aiAnalysis: citations
      .filter((citation) => citation.classification === "ai-analysis")
      .map((citation) => citation.title),
    assumptions:
      assumptions.length > 0
        ? assumptions
        : ["Standard engineering assumptions apply unless project data specifies otherwise."],
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ["Validate all guidance against project specifications and local codes."],
  };
};

export const runEngineeringEvidenceEngine = async (
  input: EvidenceEngineInput
): Promise<EngineeringEvidencePackage> => {
  const evidenceItems = await collectEvidence(input);
  const citations = buildCitations(input, evidenceItems);
  const classification = buildClassification(input, citations);

  const structuredResponse = {
    answer: input.aiResponse.summary || input.aiResponse.detailedResponse.slice(0, 500),
    evidence: evidenceItems,
    applicableStandards: citations.filter(
      (citation) =>
        citation.type === "engineering-standard" ||
        citation.type === "clause-reference"
    ),
    assumptions: classification.assumptions,
    limitations:
      extractBullets(
        extractSection(input.aiResponse.detailedResponse, "Limitations")
      ) || [
        "AI-generated guidance must be verified by a qualified engineer.",
        "Local codes and project-specific conditions may override general guidance.",
      ],
    recommendations: classification.recommendations,
  };

  const trust = assessTrust(citations, evidenceItems);
  const conflicts = detectConflicts(
    citations,
    input.aiResponse.detailedResponse
  );
  const referenceGraph = buildReferenceGraph(
    citations,
    input.orchestration?.intent.primaryIntent
  );
  const evidencePanel = buildEvidencePanel(citations);

  const evidencePackage: EngineeringEvidencePackage = {
    engine: "Engineering Evidence & Citation Engine",
    version: "1.0.0",
    structuredResponse,
    citations,
    classification,
    trust,
    conflicts,
    referenceGraph,
    evidencePanel,
    promptAugmentation: buildEvidencePromptAugmentation(),
    auditId: null,
  };

  try {
    const audit = await recordEvidenceAudit({
      conversationId: input.conversationId,
      userMessage: input.userMessage,
      aiProvider: input.aiResponse.providerId,
      aiModel: input.aiResponse.model,
      evidence: evidencePackage,
      actorId: input.actorId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    evidencePackage.auditId = audit.id;
  } catch {
    // Audit failure must not block response delivery
  }

  return evidencePackage;
};

export { buildEvidencePromptAugmentation };
