import {
  getModuleHealthSnapshot,
  getOrchestratorPublicConfig,
  runEngineeringOrchestrator,
  type EoeOrchestratorInput,
} from "../orchestrator/index.js";

export const analyzeEngineeringRequest = (input: EoeOrchestratorInput) =>
  runEngineeringOrchestrator(input);

export const getEngineeringOrchestratorConfig = () => getOrchestratorPublicConfig();

export const getEngineeringOrchestratorHealth = () => getModuleHealthSnapshot();
