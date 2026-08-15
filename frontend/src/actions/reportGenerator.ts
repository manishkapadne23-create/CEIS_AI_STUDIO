import type {
  EngineeringActionContext,
  EngineeringDeliverableType,
  EngineeringOutputType,
  GeneratedEngineeringOutput,
} from "./types";

const OUTPUT_HEADERS: Record<EngineeringOutputType, string> = {
  "professional-report": "PROFESSIONAL ENGINEERING REPORT",
  "executive-summary": "EXECUTIVE SUMMARY",
  "technical-note": "TECHNICAL NOTE",
  "bullet-points": "ENGINEERING BRIEF",
  "tabular-report": "TABULAR ENGINEERING REPORT",
  checklist: "ENGINEERING CHECKLIST",
  "step-by-step-procedure": "METHOD STATEMENT / PROCEDURE",
  "engineering-format": "ENGINEERING FORMAT",
};

const DELIVERABLE_SECTIONS: Record<EngineeringDeliverableType, string[]> = {
  report: [
    "## Executive Summary",
    "## Scope",
    "## Technical Discussion",
    "## Standards & Compliance",
    "## Recommendations",
    "## References",
  ],
  checklist: [
    "## Inspection Checklist",
    "## Pre-Work Checks",
    "## During Work Checks",
    "## Post-Work Checks",
    "## Sign-Off",
  ],
  boq: [
    "## Bill of Quantities",
    "## Item Schedule",
    "## Measurement Notes",
    "## Rate Analysis Notes",
  ],
  estimate: [
    "## Cost Estimate",
    "## Cost Breakdown",
    "## Assumptions",
    "## Contingency",
  ],
  "method-statement": [
    "## Method Statement",
    "## Scope of Work",
    "## Sequence of Operations",
    "## Plant & Equipment",
    "## Safety Measures",
    "## Quality Control",
  ],
  "inspection-format": [
    "## Inspection Format",
    "## Project Details",
    "## Inspection Items",
    "## Observations",
    "## Acceptance Criteria",
    "## Sign-Off",
  ],
  "technical-note": [
    "## Technical Note",
    "## Background",
    "## Technical Discussion",
    "## Conclusion",
  ],
  "dpr-section": [
    "## DPR Section",
    "## Work Done Today",
    "## Progress",
    "## Constraints",
    "## Plan for Next Period",
  ],
  "comparison-table": [
    "## Comparison Table",
    "## Options Compared",
    "## Evaluation Criteria",
    "## Recommendation",
  ],
  "meeting-minutes": [
    "## Meeting Minutes",
    "## Attendees",
    "## Discussion Points",
    "## Action Items",
    "## Next Meeting",
  ],
  "site-instructions": [
    "## Site Instructions",
    "## Instruction Reference",
    "## Work Description",
    "## Safety Requirements",
    "## Compliance",
  ],
  "risk-assessment": [
    "## Risk Assessment",
    "## Activity",
    "## Hazards",
    "## Risk Matrix",
    "## Control Measures",
  ],
  "material-specification": [
    "## Material Specification",
    "## Material Description",
    "## Properties",
    "## Standards",
    "## Testing Requirements",
  ],
  "test-format": [
    "## Test Format",
    "## Test Objective",
    "## Equipment",
    "## Procedure",
    "## Results Table",
    "## Acceptance",
  ],
  sop: [
    "## Standard Operating Procedure",
    "## Purpose",
    "## Scope",
    "## Procedure Steps",
    "## Records",
  ],
  "tender-queries": [
    "## Tender Queries",
    "## Query Reference",
    "## Query Details",
    "## Response Required",
  ],
  "contract-letter": [
    "## Contract Letter",
    "## Reference",
    "## Subject",
    "## Body",
    "## Closing",
  ],
  "technical-presentation": [
    "## Technical Presentation Outline",
    "## Slide Structure",
    "## Key Messages",
    "## Supporting Data",
  ],
  "calculation-sheet": [
    "## Calculation Sheet",
    "## Given Data",
    "## Formulas",
    "## Calculations",
    "## Results",
    "## Verification",
  ],
};

const buildSectionContent = (
  section: string,
  sourceContent: string,
  topic: string | null
): string => {
  const anchor = topic ? ` for ${topic}` : "";
  const excerpt = sourceContent.slice(0, 600).trim();

  if (section.includes("Summary") || section.includes("Background")) {
    return `${section}\n\nEngineering summary${anchor} based on the Sarathi AI session.\n\n${excerpt}`;
  }

  if (section.includes("Checklist") || section.includes("Checks")) {
    return `${section}\n\n- [ ] Review design assumptions\n- [ ] Verify applicable standards\n- [ ] Confirm material specifications\n- [ ] Complete field measurements\n- [ ] Document inspection results\n- [ ] Obtain engineer sign-off`;
  }

  if (
    section.includes("Table") ||
    section.includes("Schedule") ||
    section.includes("BOQ") ||
    section.includes("Breakdown")
  ) {
    return `${section}\n\n| Item | Description | Unit | Qty | Remarks |\n| --- | --- | --- | --- | --- |\n| 1 | Derived from session context | — | — | Review and complete |`;
  }

  return `${section}\n\n${excerpt || `Engineering content${anchor} — expand with project-specific details.`}`;
};

export const generateEngineeringReport = (
  context: EngineeringActionContext,
  deliverableType: EngineeringDeliverableType = "report",
  outputType: EngineeringOutputType = "professional-report"
): GeneratedEngineeringOutput => {
  const topic =
    context.sessionTopic ??
    context.metadata?.sessionTopic ??
    "Current Engineering Topic";
  const discipline = context.disciplineName ?? "Engineering";
  const sections = DELIVERABLE_SECTIONS[deliverableType] ?? DELIVERABLE_SECTIONS.report;
  const header = OUTPUT_HEADERS[outputType] ?? OUTPUT_HEADERS["professional-report"];

  const body = [
    `# ${header}`,
    "",
    `**Discipline:** ${discipline}`,
    `**Topic:** ${topic}`,
    `**Generated:** ${new Date().toLocaleString()}`,
    `**Document Type:** ${deliverableType.replace(/-/g, " ")}`,
    "",
    "---",
    "",
    ...sections.flatMap((section) => [
      buildSectionContent(section, context.content, topic),
      "",
    ]),
    "---",
    "",
    "## Source Discussion",
    "",
    context.content,
  ].join("\n");

  return {
    title: `${getDeliverableTitle(deliverableType)} — ${topic}`,
    deliverableType,
    outputType,
    content: body,
    disciplineName: context.disciplineName,
    generatedAt: Date.now(),
  };
};

const getDeliverableTitle = (
  deliverableType: EngineeringDeliverableType
): string => {
  const titles: Partial<Record<EngineeringDeliverableType, string>> = {
    report: "Engineering Report",
    checklist: "Engineering Checklist",
    boq: "Bill of Quantities",
    estimate: "Cost Estimate",
    "method-statement": "Method Statement",
    "inspection-format": "Inspection Format",
    "technical-note": "Technical Note",
    "calculation-sheet": "Calculation Sheet",
  };
  return titles[deliverableType] ?? "Engineering Deliverable";
};

export const generateExecutiveSummary = (
  context: EngineeringActionContext
): GeneratedEngineeringOutput =>
  generateEngineeringReport(context, "report", "executive-summary");

export const generateTechnicalNote = (
  context: EngineeringActionContext
): GeneratedEngineeringOutput =>
  generateEngineeringReport(context, "technical-note", "technical-note");
