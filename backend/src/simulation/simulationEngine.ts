import { loadFutureIntegrations } from "./loadSimulationConfig.js";
import { analyzeSimulationResults } from "./resultAnalyzer.js";
import {
  normalizeScenarioOptions,
  validateScenarioInput,
} from "./scenarioManager.js";
import type {
  EssaeRunSimulationInput,
  EssaeScenarioInput,
  EssaeSimulationPackage,
} from "./types.js";

const ENGINE_VERSION = "1.0.0";

export const runSimulationEngine = (
  scenarioInput: EssaeScenarioInput
): EssaeSimulationPackage => {
  const scenario: EssaeScenarioInput = {
    ...scenarioInput,
    options: normalizeScenarioOptions(scenarioInput.options),
  };

  const validation = validateScenarioInput(scenario);

  if (!validation.valid) {
    return {
      engine: "Engineering Simulation & Scenario Analysis Engine",
      version: ENGINE_VERSION,
      disclaimer: loadFutureIntegrations().disclaimer,
      scenario,
      validation,
      results: {
        simulationSummary: "Simulation could not run due to validation errors.",
        comparisonMatrix: { criteria: [], options: [] },
        optionComparisons: [],
        engineeringRecommendations: validation.errors.map(
          (error) => `Fix validation error: ${error}`
        ),
        decisionSupportNotes: [],
        riskAssessment: [],
        executiveSummary: "Invalid scenario input.",
        recommendedOptionId: null,
        promptAugmentation: "",
      },
      generatedAt: new Date().toISOString(),
    };
  }

  const results = analyzeSimulationResults(scenario, validation);

  return {
    engine: "Engineering Simulation & Scenario Analysis Engine",
    version: ENGINE_VERSION,
    disclaimer: loadFutureIntegrations().disclaimer,
    scenario,
    validation,
    results,
    generatedAt: new Date().toISOString(),
  };
};

export const runSimulationFromInput = (input: EssaeRunSimulationInput) => {
  if (!input.scenario) {
    throw new Error("Scenario input is required.");
  }
  return runSimulationEngine(input.scenario);
};

export const getSimulationEngineConfig = () => ({
  ...loadFutureIntegrations(),
  engine: "Engineering Simulation & Scenario Analysis Engine",
  version: ENGINE_VERSION,
});
