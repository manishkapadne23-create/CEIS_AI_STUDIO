import { buildDefaultScenario } from "./scenarioManager.js";
import { runSimulationEngine } from "./simulationEngine.js";
import { loadFutureIntegrations } from "./loadSimulationConfig.js";
import type {
  EssaeAssistantInput,
  EssaeAssistantPackage,
  EssaeScenarioInput,
  EssaeScenarioTypeId,
} from "./types.js";

const SIMULATION_KEYWORDS =
  /\b(scenario|simulation|alternative|trade-?off|what if|option\s+[abc]|compare|versus|vs\.?)\b/i;

const SCENARIO_TYPE_RULES: Array<{
  type: EssaeScenarioTypeId;
  patterns: RegExp[];
}> = [
  {
    type: "MATERIAL_ALTERNATIVES",
    patterns: [/\bmaterial/i, /\bconcrete\b/i, /\bsteel\b/i, /\bcomposite\b/i],
  },
  {
    type: "CONSTRUCTION_METHODS",
    patterns: [/\bconstruction method/i, /\bprecast\b/i, /\bcast[- ]in[- ]place\b/i],
  },
  {
    type: "EQUIPMENT_SELECTION",
    patterns: [/\bequipment\b/i, /\bmachinery\b/i, /\bpump\b/i, /\bcompressor\b/i],
  },
  {
    type: "TECHNOLOGY_COMPARISON",
    patterns: [/\btechnology\b/i, /\bsystem\b/i, /\bplatform\b/i],
  },
  {
    type: "COST_SCENARIOS",
    patterns: [/\bcost\b/i, /\bbudget\b/i, /\bfinancial\b/i, /\broi\b/i],
  },
  {
    type: "SCHEDULE_SCENARIOS",
    patterns: [/\bschedule\b/i, /\btimeline\b/i, /\bduration\b/i, /\bphasing\b/i],
  },
  {
    type: "RISK_SCENARIOS",
    patterns: [/\brisk\b/i, /\bhazard\b/i, /\bmitigation\b/i],
  },
  {
    type: "ENVIRONMENTAL_SCENARIOS",
    patterns: [/\benvironment/i, /\bsustainab/i, /\bcarbon\b/i, /\bemission/i],
  },
  {
    type: "MAINTENANCE_SCENARIOS",
    patterns: [/\bmaintenance\b/i, /\blifecycle\b/i, /\boperat/i],
  },
  {
    type: "DESIGN_ALTERNATIVES",
    patterns: [/\bdesign\b/i, /\blayout\b/i, /\bconfiguration\b/i],
  },
];

const emptyPackage = (): EssaeAssistantPackage => ({
  engine: "Engineering Simulation & Scenario Analysis Engine",
  version: "1.0.0",
  enabled: false,
  disclaimer: loadFutureIntegrations().disclaimer,
  assistantCapabilities: loadFutureIntegrations().assistantCapabilities,
  futureIntegrations: loadFutureIntegrations().futureIntegrations,
  scenario: buildDefaultScenario("DESIGN_ALTERNATIVES"),
  validation: {
    valid: false,
    errors: [],
    warnings: [],
    trackedAssumptions: [],
  },
  results: {
    simulationSummary: "",
    comparisonMatrix: { criteria: [], options: [] },
    optionComparisons: [],
    engineeringRecommendations: [],
    decisionSupportNotes: [],
    riskAssessment: [],
    executiveSummary: "",
    recommendedOptionId: null,
    promptAugmentation: "",
  },
  generatedAt: new Date().toISOString(),
});

export const isSimulationRelevant = (
  message: string,
  options?: {
    primaryIntent?: string | null;
    moduleId?: string | null;
  }
): boolean => {
  const moduleId = options?.moduleId?.toLowerCase() ?? "";
  if (
    moduleId.includes("simulation") ||
    moduleId === "simulation-engine" ||
    moduleId === "engineering-simulation-scenario-analysis"
  ) {
    return true;
  }

  if (
    options?.primaryIntent === "decision-support" ||
    options?.primaryIntent === "design"
  ) {
    return true;
  }

  return SIMULATION_KEYWORDS.test(message);
};

export const inferScenarioType = (message: string): EssaeScenarioTypeId => {
  for (const rule of SCENARIO_TYPE_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(message))) {
      return rule.type;
    }
  }
  return "DESIGN_ALTERNATIVES";
};

const extractOptionHints = (
  message: string
): Partial<EssaeScenarioInput["options"][number]>[] => {
  const hints: Partial<EssaeScenarioInput["options"][number]>[] = [];

  const optionPatterns = [
    { label: "Option A", pattern: /option\s*a[:\s-]+([^.;\n]+)/i },
    { label: "Option B", pattern: /option\s*b[:\s-]+([^.;\n]+)/i },
    { label: "Option C", pattern: /option\s*c[:\s-]+([^.;\n]+)/i },
  ];

  for (const entry of optionPatterns) {
    const match = message.match(entry.pattern);
    if (match?.[1]) {
      hints.push({
        label: entry.label,
        description: match[1].trim(),
      });
    }
  }

  return hints;
};

export const buildScenarioFromChat = (input: EssaeAssistantInput): EssaeScenarioInput => {
  const scenarioType = inferScenarioType(input.message);
  const base = buildDefaultScenario(scenarioType, input.disciplineName);
  const optionHints = extractOptionHints(input.message);

  const options = base.options.map((option, index) => {
    const hint = optionHints[index];
    if (!hint) {
      return option;
    }
    return {
      ...option,
      label: hint.label ?? option.label,
      description: hint.description ?? option.description,
    };
  });

  const title =
    input.message.length > 120
      ? `${input.message.slice(0, 117)}...`
      : input.message;

  return {
    ...base,
    title,
    disciplineId: input.disciplineId ?? null,
    disciplineName: input.disciplineName ?? null,
    description: "AI-assisted scenario generated from engineering conversation.",
    assumptions: [
      ...(base.assumptions ?? []),
      ...(input.projectContext
        ? [`Project context: ${input.projectContext}`]
        : []),
      "Scenario parameters inferred from conversation — validate before implementation.",
    ],
    options,
  };
};

export const runSimulationAssistant = (
  input: EssaeAssistantInput
): EssaeAssistantPackage => {
  const enabled = isSimulationRelevant(input.message, {
    primaryIntent: input.primaryIntent,
    moduleId: input.moduleId,
  });

  if (!enabled) {
    return emptyPackage();
  }

  const scenario = buildScenarioFromChat(input);
  const pkg = runSimulationEngine(scenario);
  const future = loadFutureIntegrations();

  return {
    ...pkg,
    enabled: true,
    assistantCapabilities: future.assistantCapabilities,
    futureIntegrations: future.futureIntegrations,
  };
};
