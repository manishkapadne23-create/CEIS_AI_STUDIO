import type { DesignReport, DesignSession, DesignTemplate } from "./types";

export const buildDesignReport = (
  session: DesignSession,
  template: DesignTemplate
): DesignReport => {
  const stepData = session.stepData;

  const designSummary = [
    `Design: ${session.title}`,
    `Discipline: ${session.disciplineName ?? template.disciplineName}`,
    `Status: ${session.status}`,
    `Progress: ${session.completedStepIds.length}/${template.steps.length} steps`,
    stepData["final-design-summary"] ?? "[Final summary to be completed]",
  ].join("\n");

  const designBasis = [
    "DESIGN BASIS REPORT",
    "",
    `Problem: ${stepData["problem-definition"] ?? "[To be defined]"}`,
    `Criteria: ${stepData["design-criteria"] ?? "[To be defined]"}`,
    `Standards: ${stepData["applicable-standards"] ?? template.suggestedStandards.join(", ")}`,
    `Assumptions: ${stepData["engineering-assumptions"] ?? "[To be documented]"}`,
    `Methodology: ${stepData["design-methodology"] ?? "[To be selected]"}`,
  ].join("\n");

  const calculationSummary = [
    "CALCULATION SUMMARY",
    stepData["engineering-calculations"] ?? "[Calculations to be performed using Sarathi calculators]",
    "",
    "Suggested calculators:",
    ...template.suggestedCalculators.map((c) => `- ${c}`),
  ].join("\n");

  const checklist = template.steps.map((step) => {
    const done = session.completedStepIds.includes(step.id);
    return `${done ? "✓" : "○"} ${step.title}`;
  });

  const inputDataSheet = [
    "INPUT DATA SHEET",
    `Inputs: ${stepData["input-parameters"] ?? "[Collect load, material and geometry data]"}`,
    "",
    "Required inputs per step:",
    ...template.steps
      .filter((s) => s.id === "input-parameters" || s.requiredInputs.length > 0)
      .slice(0, 4)
      .flatMap((s) => s.requiredInputs.map((i) => `- ${i}`)),
  ].join("\n");

  const designNotes = [
    stepData["alternative-solutions"]
      ? `Alternatives: ${stepData["alternative-solutions"]}`
      : "",
    stepData["risk-considerations"]
      ? `Risks: ${stepData["risk-considerations"]}`
      : "",
    `Revisions: ${session.revisions.map((r) => `${r.revision} (${r.date})`).join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const recommendations =
    stepData["engineering-recommendations"] ??
    "Complete all design steps and validate against applicable standards before finalizing recommendations.";

  return {
    title: `Design Report — ${session.title}`,
    designSummary,
    designBasis,
    calculationSummary,
    checklist,
    inputDataSheet,
    designNotes,
    recommendations,
    generatedAt: Date.now(),
  };
};

export const formatDesignReportForPrompt = (report: DesignReport): string =>
  [
    report.title,
    "",
    "DESIGN SUMMARY:",
    report.designSummary,
    "",
    "DESIGN BASIS:",
    report.designBasis,
    "",
    "CALCULATIONS:",
    report.calculationSummary,
    "",
    "CHECKLIST:",
    ...report.checklist,
    "",
    "RECOMMENDATIONS:",
    report.recommendations,
  ].join("\n");

export const buildProgressSummary = (
  session: DesignSession,
  template: DesignTemplate
): string => {
  const current = template.steps[session.currentStepIndex];
  return [
    `Design: ${session.title}`,
    `Step ${session.currentStepIndex + 1}/${template.steps.length}: ${current?.title ?? "Complete"}`,
    `Completed: ${session.completedStepIds.length} steps`,
    `Status: ${session.status}`,
  ].join(" | ");
};
