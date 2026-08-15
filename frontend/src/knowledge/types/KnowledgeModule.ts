export interface KnowledgeNode {
  id: string;
  name: string;
  icon?: string;
  children?: KnowledgeNode[];
}

export interface KnowledgeModuleMetadata {
  description?: string;
  tags?: string[];
  lastUpdated?: string;
}

export type KnowledgeSectionType = "text" | "list" | "cards";

export interface KnowledgeModuleSectionBase {
  id: string;
  label: string;
  type: KnowledgeSectionType;
}

export interface KnowledgeTextSection extends KnowledgeModuleSectionBase {
  type: "text";
  text: string;
}

export interface KnowledgeListSection extends KnowledgeModuleSectionBase {
  type: "list";
  items: string[];
}

export interface KnowledgeCardItem {
  id: string;
  title: string;
  description?: string;
}

export interface KnowledgeCardsSection extends KnowledgeModuleSectionBase {
  type: "cards";
  items: KnowledgeCardItem[];
}

export type KnowledgeModuleSection =
  | KnowledgeTextSection
  | KnowledgeListSection
  | KnowledgeCardsSection;

export interface KnowledgeModuleContent {
  title: string;
  panelBadgeLabel: string;
  sections: KnowledgeModuleSection[];
}

export interface KnowledgeModule {
  id: string;
  disciplineId: string;
  disciplineName: string;
  version: string;
  rootNodes: KnowledgeNode[];
  metadata?: KnowledgeModuleMetadata;
}

export interface KnowledgeModuleSummary {
  id: string;
  disciplineId: string;
  disciplineName: string;
  nodeCount: number;
  isAvailable: boolean;
  version: string;
}

export interface KnowledgeModuleRegistry {
  modules: Record<string, KnowledgeModule>;
  getModule: (disciplineId: string) => KnowledgeModule | undefined;
  listDisciplines: () => KnowledgeModuleSummary[];
}

export interface KnowledgeSelection {
  disciplineId: string | null;
  nodeId: string | null;
  nodePath: KnowledgeNode[];
}
