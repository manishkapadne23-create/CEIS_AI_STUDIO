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
  owner?: string;
  description?: string;
}

export type QualityGateId =
  | "build"
  | "type-safety"
  | "linting"
  | "unit-tests"
  | "integration-tests"
  | "security"
  | "performance";

export interface QualityGateResult {
  id: QualityGateId;
  passed: boolean;
  message: string;
  durationMs?: number;
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
  category: "naming" | "folder-structure" | "file-organization" | "documentation" | "component" | "api" | "database";
  rule: string;
  enforced: boolean;
}

export interface ApiGovernanceRule {
  id: string;
  area: "rest" | "errors" | "validation" | "auth" | "authorization" | "rate-limiting" | "versioning";
  rule: string;
  compliant: boolean;
}

export interface DatabaseGovernanceRule {
  id: string;
  area: "migrations" | "schema-versioning" | "backup" | "rollback" | "validation";
  rule: string;
  compliant: boolean;
}

export interface SecurityCheckResult {
  id: string;
  area: "dependency-scan" | "secrets" | "audit-logs" | "roles" | "encryption" | "configuration";
  passed: boolean;
  message: string;
}

export interface ReleaseRecord {
  version: string;
  date: string;
  notes: string[];
  breakingChanges: string[];
  migrations: string[];
  backwardCompatible: boolean;
}

export interface GovernanceReport {
  version: string;
  architecture: {
    totalModules: number;
    byCategory: Record<ModuleCategory, number>;
  };
  dependencies: DependencyReport;
  quality: QualityReport;
  api: ApiGovernanceRule[];
  database: DatabaseGovernanceRule[];
  security: SecurityCheckResult[];
  codingStandards: CodingStandardRule[];
  release: ReleaseRecord;
  documentation: {
    generatedAt: string;
    artifacts: string[];
  };
}
