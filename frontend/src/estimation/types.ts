export type EstimationDisciplineId =
  | "civil-engineering"
  | "mechanical-engineering"
  | "electrical-engineering"
  | "computer-engineering"
  | "electronics-telecommunication-engineering"
  | "chemical-engineering"
  | "environmental-engineering"
  | "mining-engineering"
  | "marine-engineering"
  | "railway-engineering"
  | "aerospace-engineering"
  | "industrial-engineering"
  | "automation-robotics"
  | "renewable-energy"
  | "architecture-planning"
  | "agricultural-engineering"
  | "oil-gas-engineering"
  | "biomedical-engineering";

export type EstimationTypeId =
  | "preliminary"
  | "detailed"
  | "boq"
  | "quantity"
  | "budget"
  | "concept"
  | "material"
  | "labour"
  | "equipment"
  | "maintenance";

export type QuantityUnitType =
  | "length"
  | "area"
  | "volume"
  | "weight"
  | "count"
  | "capacity";

export type EngineeringUnit =
  | "m"
  | "km"
  | "mm"
  | "sqm"
  | "sqft"
  | "cum"
  | "cft"
  | "kg"
  | "tonne"
  | "nos"
  | "ltr"
  | "kW"
  | "kVA";

export interface BoqItem {
  id: string;
  itemNo: string;
  description: string;
  unit: EngineeringUnit | string;
  quantity: number;
  rate: number | null;
  amount: number | null;
  category: string;
  measurementMethod: string | null;
  remarks: string;
}

export interface EngineeringEstimate {
  id: string;
  title: string;
  estimationType: EstimationTypeId;
  estimationTypeName: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
  conversationId: string | null;
  items: BoqItem[];
  materialCost: number;
  labourCost: number;
  equipmentCost: number;
  indirectCost: number;
  contingencyPercent: number;
  totalCost: number;
  engineeringRemarks: string;
  status: "draft" | "review" | "final";
  createdAt: number;
  updatedAt: number;
}

export interface EstimateTemplate {
  id: string;
  title: string;
  estimationType: EstimationTypeId;
  estimationTypeName: string;
  disciplineId: EstimationDisciplineId;
  disciplineName: string;
  suggestedWorkItems: string[];
  suggestedUnits: EngineeringUnit[];
  measurementMethods: string[];
}

export interface CostBreakdown {
  materialCost: number;
  labourCost: number;
  equipmentCost: number;
  indirectCost: number;
  contingency: number;
  subtotal: number;
  totalCost: number;
  engineeringRemarks: string;
}

export interface ValueEngineeringSuggestion {
  category: string;
  suggestion: string;
  potentialSaving: string;
}

export interface QuantityConversion {
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
}

export interface BoqReviewResult {
  missingItems: string[];
  duplicateItems: string[];
  additionalSuggestions: string[];
  optimizationHints: string[];
}

export interface EstimateReport {
  title: string;
  estimateSummary: string;
  boqSummary: string;
  quantitySummary: string;
  costSummary: string;
  valueEngineeringSummary: string;
  generatedAt: number;
}

export interface EstimationEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
  projectName: string | null;
}

export interface EstimationEngineResult {
  active: boolean;
  activeEstimate: EngineeringEstimate | null;
  estimationAction: string | null;
  reportAction: string | null;
  boqAction: string | null;
  costBreakdown: CostBreakdown | null;
  searchResultCount: number;
  promptAugmentation: string;
  summaryText: string;
}

export interface EstimationExtensionHooks {
  ssrIntegrationId?: string | null;
  sorIntegrationId?: string | null;
  governmentScheduleId?: string | null;
  vendorPriceDatabaseId?: string | null;
  liveMaterialPricesEnabled?: boolean;
  pmisCostModuleId?: string | null;
}
