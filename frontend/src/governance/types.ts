export type ModuleCategory =
  | "engineering-module"
  | "ai-module"
  | "ai-agent"
  | "plugin"
  | "knowledge-service"
  | "calculator"
  | "professional-tool"
  | "workflow"
  | "template"
  | "report";

export type ModuleStatus = "active" | "beta" | "deprecated" | "planned";

export interface ArchitectureModuleEntry {
  id: string;
  name: string;
  category: ModuleCategory;
  version: string;
  path: string;
  dependencies: string[];
  status: ModuleStatus;
  description?: string;
}

export interface QualityGateResult {
  id: string;
  passed: boolean;
  message: string;
}

export interface QualityReport {
  passed: boolean;
  gates: QualityGateResult[];
  checkedAt: string;
}

export interface DependencyReport {
  modules: ArchitectureModuleEntry[];
  circularDependencies: string[][];
  unusedModules: string[];
  deprecatedModules: string[];
  sharedComponents: string[];
}

export interface CodingStandardRule {
  id: string;
  category: string;
  rule: string;
  enforced: boolean;
}

export interface GovernanceReport {
  version: string;
  architecture: {
    totalModules: number;
    byCategory: Record<string, number>;
  };
  dependencies: DependencyReport;
  quality: QualityReport;
  codingStandards: CodingStandardRule[];
}
