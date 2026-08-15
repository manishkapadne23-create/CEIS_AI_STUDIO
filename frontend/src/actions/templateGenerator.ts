import type {
  EngineeringActionContext,
  EngineeringDeliverableType,
  EngineeringOutputType,
  GeneratedEngineeringOutput,
} from "./types";
import { generateBOQ, generateEstimate } from "./boqGenerator";
import { generateEngineeringReport } from "./reportGenerator";

export interface TemplateGeneratorOptions {
  deliverableType: EngineeringDeliverableType;
  outputType?: EngineeringOutputType;
}

export const generateFromTemplate = (
  context: EngineeringActionContext,
  options: TemplateGeneratorOptions
): GeneratedEngineeringOutput => {
  const { deliverableType, outputType } = options;

  if (deliverableType === "boq") {
    return generateBOQ(context);
  }

  if (deliverableType === "estimate") {
    return generateEstimate(context);
  }

  return generateEngineeringReport(
    context,
    deliverableType,
    outputType ?? resolveDefaultOutputType(deliverableType)
  );
};

const resolveDefaultOutputType = (
  deliverableType: EngineeringDeliverableType
): EngineeringOutputType => {
  const map: Partial<
    Record<EngineeringDeliverableType, EngineeringOutputType>
  > = {
    report: "professional-report",
    checklist: "checklist",
    boq: "tabular-report",
    estimate: "tabular-report",
    "method-statement": "step-by-step-procedure",
    "inspection-format": "engineering-format",
    "technical-note": "technical-note",
    "comparison-table": "tabular-report",
    "meeting-minutes": "bullet-points",
    sop: "step-by-step-procedure",
    "test-format": "engineering-format",
    "calculation-sheet": "engineering-format",
    "risk-assessment": "professional-report",
  };

  return map[deliverableType] ?? "engineering-format";
};

export const generateChecklist = (
  context: EngineeringActionContext
): GeneratedEngineeringOutput =>
  generateFromTemplate(context, {
    deliverableType: "checklist",
    outputType: "checklist",
  });

export const generateInspectionFormat = (
  context: EngineeringActionContext
): GeneratedEngineeringOutput =>
  generateFromTemplate(context, {
    deliverableType: "inspection-format",
    outputType: "engineering-format",
  });

export const generateMethodStatement = (
  context: EngineeringActionContext
): GeneratedEngineeringOutput =>
  generateFromTemplate(context, {
    deliverableType: "method-statement",
    outputType: "step-by-step-procedure",
  });

export const generateSOP = (
  context: EngineeringActionContext
): GeneratedEngineeringOutput =>
  generateFromTemplate(context, {
    deliverableType: "sop",
    outputType: "step-by-step-procedure",
  });
