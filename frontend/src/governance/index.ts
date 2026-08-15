export type {
  ModuleCategory,
  ModuleStatus,
  ArchitectureModuleEntry,
  QualityGateResult,
  QualityReport,
  DependencyReport,
  CodingStandardRule,
  GovernanceReport,
} from "./types";

export {
  listArchitectureModules,
  getArchitectureModule,
  getArchitectureSummary,
  registerArchitectureModule,
} from "./architectureRegistry";

export { analyzeDependencies } from "./dependencyManager";
export { validateCodingStandards, CODING_STANDARDS } from "./codingStandards";
export { runClientQualityGates } from "./qualityEngine";
export { getCurrentRelease, parseSemver } from "./releaseManager";
export { generateGovernanceReport, governanceManager, initializeGovernance } from "./governanceManager";
