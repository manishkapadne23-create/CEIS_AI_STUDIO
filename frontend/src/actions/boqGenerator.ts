import type { EngineeringActionContext, GeneratedEngineeringOutput } from "./types";

const BOQ_COLUMNS = [
  "Item No.",
  "Description",
  "Unit",
  "Quantity",
  "Rate (₹)",
  "Amount (₹)",
  "Remarks",
];

export const generateBOQ = (
  context: EngineeringActionContext
): GeneratedEngineeringOutput => {
  const topic =
    context.sessionTopic ??
    context.metadata?.sessionTopic ??
    "Engineering Works";
  const discipline = context.disciplineName ?? "Engineering";

  const defaultRows = [
    ["1", "Preliminary & general items", "LS", "1", "—", "—", "As per scope"],
    ["2", "Earthwork / excavation", "m³", "—", "—", "—", "Measure on site"],
    ["3", "Concrete works", "m³", "—", "—", "—", "Grade as per design"],
    ["4", "Reinforcement steel", "MT", "—", "—", "—", "Fe500D or as specified"],
    ["5", "Formwork", "m²", "—", "—", "—", "As per drawing"],
    ["6", "Finishing works", "m²", "—", "—", "—", "Complete as specified"],
  ];

  const header = `| ${BOQ_COLUMNS.join(" | ")} |`;
  const separator = `| ${BOQ_COLUMNS.map(() => "---").join(" | ")} |`;
  const rows = defaultRows.map((row) => `| ${row.join(" | ")} |`).join("\n");

  const content = [
    `# BILL OF QUANTITIES (BOQ)`,
    "",
    `**Project / Topic:** ${topic}`,
    `**Discipline:** ${discipline}`,
    `**Date:** ${new Date().toLocaleDateString()}`,
    "",
    "## Measurement Notes",
    "",
    "Quantities to be verified from approved drawings and site measurements.",
    "Rates to be as per applicable DSR / market analysis.",
    "",
    "## BOQ Schedule",
    "",
    header,
    separator,
    rows,
    "",
    "## Summary",
    "",
    "| Description | Amount (₹) |",
    "| --- | --- |",
    "| Sub-total | — |",
    "| GST | — |",
    "| Grand Total | — |",
    "",
    "## Assumptions",
    "",
    "- Based on Sarathi AI engineering discussion",
    "- Subject to site verification and approved drawings",
    "- Excludes statutory approvals unless specified",
    "",
    "## Source Engineering Discussion",
    "",
    context.content,
  ].join("\n");

  return {
    title: `BOQ — ${topic}`,
    deliverableType: "boq",
    outputType: "tabular-report",
    content,
    disciplineName: context.disciplineName,
    generatedAt: Date.now(),
  };
};

export const generateEstimate = (
  context: EngineeringActionContext
): GeneratedEngineeringOutput => {
  const boq = generateBOQ(context);

  return {
    ...boq,
    title: boq.title.replace("BOQ", "Cost Estimate"),
    deliverableType: "estimate",
    content: boq.content.replace(
      "BILL OF QUANTITIES (BOQ)",
      "ENGINEERING COST ESTIMATE"
    ),
  };
};
