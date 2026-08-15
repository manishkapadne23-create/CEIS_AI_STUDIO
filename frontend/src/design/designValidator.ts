import type { DesignSession, DesignTemplate, DesignValidationResult } from "./types";

export const validateDesignSession = (
  session: DesignSession,
  template: DesignTemplate
): DesignValidationResult => {
  const missingInputs: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  for (const step of template.steps) {
    if (!session.completedStepIds.includes(step.id) && step.order <= session.currentStepIndex + 1) {
      const hasData = session.stepData[step.id];
      if (!hasData) {
        missingInputs.push(...step.requiredInputs.filter((input) => {
          const data = session.stepData[step.id] ?? "";
          return !data.toLowerCase().includes(input.toLowerCase().slice(0, 8));
        }));
      }
    }
  }

  if (!session.stepData["applicable-standards"]) {
    warnings.push("Applicable standards not yet documented — design may not be code-compliant");
    recommendations.push("Identify and document all applicable IRC/IS/IEC/ASME standards");
  }

  if (!session.stepData["engineering-calculations"]) {
    warnings.push("Engineering calculations not yet recorded");
    recommendations.push("Use Sarathi calculators and document calculation results");
  }

  if (!session.stepData["risk-considerations"]) {
    warnings.push("Risk considerations not yet addressed");
    recommendations.push("Document design risks and mitigation measures");
  }

  if (session.completedStepIds.length < 4) {
    warnings.push("Design is in early stages — complete problem definition and criteria first");
  }

  const totalSteps = template.steps.length;
  const completenessScore = Math.round(
    (session.completedStepIds.length / totalSteps) * 100
  );

  return {
    isValid: missingInputs.length === 0 && completenessScore >= 80,
    completenessScore,
    missingInputs: [...new Set(missingInputs)].slice(0, 8),
    warnings,
    recommendations,
  };
};

export const formatValidationForPrompt = (
  result: DesignValidationResult
): string =>
  [
    `Design completeness: ${result.completenessScore}%`,
    result.missingInputs.length > 0
      ? `Missing inputs: ${result.missingInputs.join("; ")}`
      : "All required inputs captured for current step",
    result.warnings.length > 0
      ? `Warnings: ${result.warnings.join("; ")}`
      : "",
    result.recommendations.length > 0
      ? `Recommendations: ${result.recommendations.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

export const getDesignLimitations = (
  template: DesignTemplate,
  session: DesignSession
): string[] => {
  const limitations: string[] = [
    "This is AI-assisted design guidance — not a substitute for licensed professional engineering judgment",
    "All calculations must be independently verified by a qualified engineer",
  ];

  if (template.category === "structural") {
    limitations.push("Structural designs require peer review and code compliance checking");
  }
  if (!session.stepData["design-validation"]) {
    limitations.push("Design has not been validated — do not use for construction");
  }
  if (session.completedStepIds.length < template.steps.length / 2) {
    limitations.push("Design is less than 50% complete — conclusions are preliminary only");
  }

  return limitations;
};
