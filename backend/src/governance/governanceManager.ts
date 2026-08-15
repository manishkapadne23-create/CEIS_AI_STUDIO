import { auditLogger } from "../infrastructure/logger/index.js";
import { getArchitectureSummary } from "./architectureRegistry.js";
import { validateApiGovernance } from "./apiGovernance.js";
import { validateCodingStandards } from "./codingStandards.js";
import { analyzeDependencies } from "./dependencyManager.js";
import { validateDatabaseGovernance } from "./databaseGovernance.js";
import { generateAllDocumentation } from "./documentationGenerator.js";
import { runQualityGates } from "./qualityEngine.js";
import { getCurrentRelease } from "./releaseManager.js";
import { runSecurityChecks } from "./securityChecker.js";
import type { GovernanceReport } from "./types.js";

let initialized = false;

export const initializeGovernance = async (): Promise<GovernanceReport> => {
  if (initialized) {
    return generateGovernanceReport();
  }

  const report = await generateGovernanceReport();
  initialized = true;

  auditLogger.info("governance.initialized", {
    version: report.version,
    modules: report.architecture.totalModules,
    qualityPassed: report.quality.passed,
  });

  return report;
};

export const generateGovernanceReport = async (): Promise<GovernanceReport> => {
  const release = getCurrentRelease();
  const quality = await runQualityGates();
  const documentation = generateAllDocumentation();

  return {
    version: release.version,
    architecture: getArchitectureSummary(),
    dependencies: analyzeDependencies(),
    quality,
    api: validateApiGovernance(),
    database: validateDatabaseGovernance(),
    security: runSecurityChecks(),
    codingStandards: validateCodingStandards(),
    release,
    documentation,
  };
};

export const governanceManager = {
  initialize: initializeGovernance,
  report: generateGovernanceReport,
  quality: runQualityGates,
  dependencies: analyzeDependencies,
  security: runSecurityChecks,
  documentation: generateAllDocumentation,
};
