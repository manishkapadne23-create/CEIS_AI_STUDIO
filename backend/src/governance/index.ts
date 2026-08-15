export type {
  ApiGovernanceRule,
  ArchitectureModuleEntry,
  CodingStandardRule,
  DatabaseGovernanceRule,
  DependencyReport,
  GovernanceReport,
  ModuleCategory,
  ModuleStatus,
  QualityGateResult,
  QualityReport,
  ReleaseRecord,
  SecurityCheckResult,
} from "./types.js";

export {
  getArchitectureModule,
  getArchitectureSummary,
  listArchitectureModules,
  registerArchitectureModule,
} from "./architectureRegistry.js";

export { analyzeDependencies } from "./dependencyManager.js";
export {
  CODING_STANDARDS,
  getCodingStandardsByCategory,
  validateCodingStandards,
} from "./codingStandards.js";
export { runQualityGates } from "./qualityEngine.js";
export {
  createReleaseRecord,
  generateReleaseNotes,
  getCurrentRelease,
  getReleaseHistory,
  isBackwardCompatible,
  parseSemver,
} from "./releaseManager.js";
export { API_GOVERNANCE_RULES, getApiComplianceScore, validateApiGovernance } from "./apiGovernance.js";
export { DATABASE_GOVERNANCE_RULES, validateDatabaseGovernance } from "./databaseGovernance.js";
export { runSecurityChecks } from "./securityChecker.js";
export {
  generateAllDocumentation,
  generateApiDocumentation,
  generateArchitectureDiagram,
  generateDeveloperGuide,
} from "./documentationGenerator.js";
export { generateGovernanceReport, governanceManager, initializeGovernance } from "./governanceManager.js";
