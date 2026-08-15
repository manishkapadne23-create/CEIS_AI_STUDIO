import {
  analyzeDependencies,
  generateGovernanceReport,
  initializeGovernance,
  listArchitectureModules,
  registerArchitectureModule,
  runQualityGates,
  runSecurityChecks,
} from "../governance/index.js";
import type { ArchitectureModuleEntry, ModuleCategory } from "../governance/types.js";

export const bootstrapGovernance = async () => initializeGovernance();

export const getGovernanceReport = async () => generateGovernanceReport();

export const getQualityReport = async () => runQualityGates();

export const getDependencyReport = () => analyzeDependencies();

export const getSecurityReport = () => runSecurityChecks();

export const listModules = (category?: ModuleCategory) =>
  listArchitectureModules(category);

export const getModule = (id: string) =>
  listArchitectureModules().find((module) => module.id === id);

export const registerModule = (entry: ArchitectureModuleEntry) => {
  registerArchitectureModule(entry);
  return entry;
};
