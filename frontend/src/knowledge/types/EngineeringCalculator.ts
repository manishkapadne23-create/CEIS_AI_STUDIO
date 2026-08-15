export const ENGINEERING_CALCULATOR_CATEGORY_KEYS = {
  pavement: "pavement",
  geometric: "geometric",
  earthwork: "earthwork",
  structural: "structural",
  hydraulic: "hydraulic",
  general: "general",
} as const;

export type EngineeringCalculatorCategoryKey =
  (typeof ENGINEERING_CALCULATOR_CATEGORY_KEYS)[keyof typeof ENGINEERING_CALCULATOR_CATEGORY_KEYS];

export const ENGINEERING_CALCULATOR_CATEGORY_LABELS: Record<
  EngineeringCalculatorCategoryKey,
  string
> = {
  pavement: "Pavement",
  geometric: "Geometric Design",
  earthwork: "Earthwork",
  structural: "Structural",
  hydraulic: "Hydraulic",
  general: "General",
};

export type EngineeringCalculatorFieldType =
  | "number"
  | "text"
  | "select"
  | "boolean";

export type EngineeringCalculatorStatus =
  | "available"
  | "beta"
  | "coming-soon";

export interface EngineeringCalculatorFieldOption {
  value: string;
  label: string;
}

export interface EngineeringCalculatorField {
  id: string;
  label: string;
  type: EngineeringCalculatorFieldType;
  unit?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: EngineeringCalculatorFieldOption[];
  description?: string;
}

export interface EngineeringCalculatorOutputField {
  id: string;
  label: string;
  unit?: string;
  description?: string;
}

export interface EngineeringCalculatorStandard {
  code: string;
  title: string;
}

export interface EngineeringCalculator {
  id: string;
  key: string;
  title: string;
  description: string;
  category: EngineeringCalculatorCategoryKey;
  status: EngineeringCalculatorStatus;
  enabled: boolean;
  disciplineId: string;
  specializationId?: string;
  pluginId?: string;
  standards: EngineeringCalculatorStandard[];
  inputs: EngineeringCalculatorField[];
  outputs: EngineeringCalculatorOutputField[];
}

export interface EngineeringCalculatorCategoryGroup {
  key: EngineeringCalculatorCategoryKey;
  label: string;
  calculators: EngineeringCalculator[];
}

export interface EngineeringCalculatorRegistry {
  disciplineId: string;
  disciplineName: string;
  categories: EngineeringCalculatorCategoryGroup[];
  calculators: EngineeringCalculator[];
}

export interface EngineeringCalculatorRegistryMap {
  registries: Record<string, EngineeringCalculatorRegistry>;
  getRegistry: (
    disciplineId: string
  ) => EngineeringCalculatorRegistry | undefined;
  listRegistries: () => EngineeringCalculatorRegistry[];
}

export interface EngineeringCalculatorInputValues {
  [fieldId: string]: string | number | boolean;
}

export interface EngineeringCalculatorOutputValues {
  [fieldId: string]: string | number | boolean;
}

export interface EngineeringCalculatorPluginContext {
  calculator: EngineeringCalculator;
  disciplineId: string;
}

export interface EngineeringCalculatorPlugin {
  id: string;
  calculatorId: string;
  version: string;
  compute: (
    inputs: EngineeringCalculatorInputValues,
    context: EngineeringCalculatorPluginContext
  ) =>
    | EngineeringCalculatorOutputValues
    | Promise<EngineeringCalculatorOutputValues>;
}

export interface EngineeringCalculatorPluginRegistry {
  plugins: Record<string, EngineeringCalculatorPlugin>;
  register: (plugin: EngineeringCalculatorPlugin) => void;
  get: (calculatorId: string) => EngineeringCalculatorPlugin | undefined;
  has: (calculatorId: string) => boolean;
  list: () => EngineeringCalculatorPlugin[];
}
