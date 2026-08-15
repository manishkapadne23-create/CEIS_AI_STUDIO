import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";

export type GraphEntityType =
  | "discipline"
  | "topic"
  | "standard"
  | "clause"
  | "calculator"
  | "formula"
  | "professional-tool"
  | "template"
  | "report"
  | "document"
  | "workflow"
  | "ai-agent"
  | "material"
  | "equipment"
  | "software"
  | "project"
  | "learning-resource";

export type GraphRelationshipType =
  | "related-standard"
  | "related-calculator"
  | "related-document"
  | "related-template"
  | "related-report"
  | "related-workflow"
  | "related-ai-expert"
  | "related-learning-resource"
  | "related-material"
  | "related-equipment"
  | "related-technology"
  | "governed-by"
  | "calculated-with"
  | "implements"
  | "references"
  | "depends-on"
  | "similar-to"
  | "next-topic";

export type GraphSearchMode =
  | "semantic"
  | "relationship"
  | "dependency"
  | "topic"
  | "cross-reference";

export interface GraphEntity {
  id: string;
  type: GraphEntityType;
  label: string;
  description: string;
  disciplineId: string | null;
  disciplineName: string | null;
  moduleId?: WorkspaceCategoryId;
  resourceId?: string;
  keywords: string[];
  route?: string;
}

export interface GraphRelationship {
  id: string;
  fromId: string;
  toId: string;
  type: GraphRelationshipType;
  label: string;
  weight: number;
}

export interface EngineeringKnowledgeGraphIndex {
  entities: GraphEntity[];
  relationships: GraphRelationship[];
  builtAt: number;
}

export interface GraphSearchOptions {
  query: string;
  disciplineId?: string | null;
  mode?: GraphSearchMode;
  entityTypes?: GraphEntityType[] | null;
  limit?: number;
}

export interface GraphSearchResult {
  entity: GraphEntity;
  score: number;
  matchedTerms: string[];
  relatedEntities: GraphEntity[];
}

export interface GraphRecommendation {
  category: GraphEntityType | "next-topic";
  title: string;
  description: string;
  entityId: string;
  moduleId?: WorkspaceCategoryId;
  resourceId?: string;
  route?: string;
  priority: number;
}

export interface GraphContextBundle {
  topicEntities: GraphEntity[];
  standards: GraphEntity[];
  calculators: GraphEntity[];
  workflows: GraphEntity[];
  templates: GraphEntity[];
  documents: GraphEntity[];
  reports: GraphEntity[];
  aiAgents: GraphEntity[];
  learningResources: GraphEntity[];
  materials: GraphEntity[];
  equipment: GraphEntity[];
  relationships: GraphRelationship[];
  similarConversations: string[];
}

export interface GraphExplorerPath {
  rootEntity: GraphEntity;
  steps: Array<{
    entity: GraphEntity;
    relationship: GraphRelationship;
  }>;
}

export interface KnowledgeGraphInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  activeModuleId?: WorkspaceCategoryId | null;
  sessionTopic?: string | null;
  selectedStandardCode?: string | null;
}

export interface KnowledgeGraphResult {
  active: boolean;
  searchMode: GraphSearchMode | null;
  matchedEntities: GraphEntity[];
  recommendations: GraphRecommendation[];
  context: GraphContextBundle | null;
  explorerPaths: GraphExplorerPath[];
  graphSummary: string;
  promptAugmentation: string;
  summaryText: string;
}

/** Future-ready capabilities */
export interface KnowledgeGraphCapabilities {
  vectorDatabase: boolean;
  rag: boolean;
  ontology: boolean;
  enterpriseKnowledge: boolean;
  pmisKnowledgeLayer: boolean;
  digitalTwin: boolean;
  interactiveVisualization: boolean;
}

export const KNOWLEDGE_GRAPH_CAPABILITIES: KnowledgeGraphCapabilities = {
  vectorDatabase: false,
  rag: false,
  ontology: false,
  enterpriseKnowledge: false,
  pmisKnowledgeLayer: false,
  digitalTwin: false,
  interactiveVisualization: false,
};
