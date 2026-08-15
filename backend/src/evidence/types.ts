export type EvidenceCitationTypeId =
  | "engineering-standard"
  | "clause-reference"
  | "design-manual"
  | "specification"
  | "research-paper"
  | "company-knowledge"
  | "user-document"
  | "ai-generated";

export type EvidenceTrustLevelId =
  | "verified"
  | "high-confidence"
  | "medium-confidence"
  | "low-confidence"
  | "insufficient-evidence";

export type EvidenceSourceId =
  | "standards"
  | "technical-manuals"
  | "specifications"
  | "design-guides"
  | "research-papers"
  | "calculations"
  | "government-publications"
  | "user-documents"
  | "internal-knowledge-base";

export type KnowledgeClassification =
  | "verified-knowledge"
  | "ai-analysis"
  | "assumption"
  | "recommendation";

export interface EvidenceCitation {
  id: string;
  type: EvidenceCitationTypeId;
  typeLabel: string;
  title: string;
  reference: string;
  sourceId: EvidenceSourceId;
  sourceLabel: string;
  classification: KnowledgeClassification;
  confidence: number;
  expandable: boolean;
  sourceUri?: string | null;
  clauseRef?: string | null;
  relatedStandardIds?: string[];
  relatedCalculatorIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface EvidenceItem {
  id: string;
  label: string;
  sourceId: EvidenceSourceId;
  summary: string;
  citations: EvidenceCitation[];
}

export interface EvidenceConflict {
  id: string;
  type: string;
  label: string;
  description: string;
  references: string[];
}

export interface ReferenceGraphNode {
  id: string;
  type: string;
  label: string;
}

export interface ReferenceGraphEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface ReferenceGraph {
  nodes: ReferenceGraphNode[];
  edges: ReferenceGraphEdge[];
}

export interface EvidencePanelItem {
  citationId: string;
  title: string;
  type: EvidenceCitationTypeId;
  typeLabel: string;
  summary: string;
  canExpand: boolean;
  canOpenSource: boolean;
  relatedStandards: string[];
  relatedCalculators: string[];
  sourceUri?: string | null;
}

export interface StructuredEngineeringResponse {
  answer: string;
  evidence: EvidenceItem[];
  applicableStandards: EvidenceCitation[];
  assumptions: string[];
  limitations: string[];
  recommendations: string[];
}

export interface KnowledgeClassificationBundle {
  verifiedKnowledge: string[];
  aiAnalysis: string[];
  assumptions: string[];
  recommendations: string[];
}

export interface TrustAssessment {
  level: EvidenceTrustLevelId;
  label: string;
  score: number;
  rationale: string;
}

export interface EngineeringEvidencePackage {
  engine: "Engineering Evidence & Citation Engine";
  version: string;
  structuredResponse: StructuredEngineeringResponse;
  citations: EvidenceCitation[];
  classification: KnowledgeClassificationBundle;
  trust: TrustAssessment;
  conflicts: EvidenceConflict[];
  referenceGraph: ReferenceGraph;
  evidencePanel: EvidencePanelItem[];
  promptAugmentation: string;
  auditId: string | null;
}

export interface EvidenceEngineInput {
  userMessage: string;
  conversationId?: string | null;
  aiResponse: {
    title: string;
    summary: string;
    detailedResponse: string;
    recommendations: string[];
    standards: string[];
    references: string[];
    providerId: string;
    model: string;
  };
  orchestration?: {
    intent: { primaryIntent: string; confidence: number };
    context: {
      disciplineId: string | null;
      disciplineName: string | null;
      specializationId: string | null;
      specializationName: string | null;
      topic: string | null;
    };
    knowledgeReferences: string[];
    moduleContributions: Array<{
      moduleId: string;
      references: string[];
    }>;
  };
  actorId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}
