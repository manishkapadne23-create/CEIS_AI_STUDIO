import { getArchitectureSummary, listArchitectureModules } from "./architectureRegistry";
import { validateCodingStandards } from "./codingStandards";
import { analyzeDependencies } from "./dependencyManager";
import { runClientQualityGates } from "./qualityEngine";
import { getCurrentRelease } from "./releaseManager";
import type { GovernanceReport } from "./types";

let initialized = false;

export const generateGovernanceReport = async (): Promise<GovernanceReport> => {
  const release = getCurrentRelease();
  return {
    version: release.version,
    architecture: getArchitectureSummary(),
    dependencies: analyzeDependencies(),
    quality: await runClientQualityGates(),
    codingStandards: validateCodingStandards(),
  };
};

export const initializeGovernance = async (): Promise<GovernanceReport> => {
  if (initialized) {
    return generateGovernanceReport();
  }
  const report = await generateGovernanceReport();
  initialized = true;
  return report;
};

export const governanceManager = {
  initialize: initializeGovernance,
  report: generateGovernanceReport,
  modules: listArchitectureModules,
  dependencies: analyzeDependencies,
  quality: runClientQualityGates,
};
