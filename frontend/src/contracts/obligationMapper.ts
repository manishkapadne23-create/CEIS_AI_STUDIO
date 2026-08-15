import type { ContractAnalysis, ResponsibilityItem } from "./types";

const ACTIVITIES = [
  "Design (if applicable)",
  "Construction/Execution",
  "Procurement of materials",
  "Site access and utilities",
  "Approvals and permits",
  "Testing and commissioning",
  "Quality control and inspection",
  "Safety management",
  "Programme and scheduling",
  "Payment certification",
  "Variation approval",
  "Defect rectification (DLP)",
  "Insurance procurement",
  "As-built documentation",
];

export const buildResponsibilityMatrix = (
  analysis: ContractAnalysis
): ResponsibilityItem[] => {
  const type = analysis.contractType;

  return ACTIVITIES.map((activity) => {
    if (activity.includes("Design")) {
      return { activity, employer: type === "design-consultancy", contractor: type === "epc", engineer: type === "pmc", shared: false };
    }
    if (activity.includes("Construction")) {
      return { activity, employer: false, contractor: true, engineer: false, shared: false };
    }
    if (activity.includes("Site access")) {
      return { activity, employer: true, contractor: false, engineer: false, shared: false };
    }
    if (activity.includes("Approvals")) {
      return { activity, employer: true, contractor: false, engineer: false, shared: type === "ppp" };
    }
    if (activity.includes("Payment")) {
      return { activity, employer: false, contractor: false, engineer: true, shared: false };
    }
    if (activity.includes("Variation")) {
      return { activity, employer: false, contractor: false, engineer: true, shared: false };
    }
    if (activity.includes("Insurance")) {
      return { activity, employer: false, contractor: true, engineer: false, shared: type === "ppp" };
    }
    if (activity.includes("Quality") || activity.includes("Safety")) {
      return { activity, employer: false, contractor: true, engineer: true, shared: false };
    }
    return { activity, employer: false, contractor: true, engineer: false, shared: false };
  });
};

export const formatResponsibilityMatrix = (matrix: ResponsibilityItem[]): string => {
  const header = "Activity | Employer | Contractor | Engineer | Shared";
  const rows = matrix.map(
    (r) =>
      `${r.activity} | ${r.employer ? "✓" : "-"} | ${r.contractor ? "✓" : "-"} | ${r.engineer ? "✓" : "-"} | ${r.shared ? "✓" : "-"}`
  );
  return [header, ...rows].join("\n");
};

export const reviewDeliverables = (analysis: ContractAnalysis): string[] => {
  const deliverables = [...analysis.deliverables];
  if (deliverables.length === 0) {
    deliverables.push(
      "As-built drawings and O&M manuals",
      "Test certificates and commissioning reports",
      "Warranty documents",
      "Final account and settlement"
    );
  }
  return deliverables;
};

export const reviewTimeObligations = (analysis: ContractAnalysis): string[] => {
  const obligations: string[] = [];
  if (analysis.commencementDate) obligations.push(`Commence within: ${analysis.commencementDate}`);
  if (analysis.completionDate) obligations.push(`Complete by: ${analysis.completionDate}`);
  if (analysis.defectLiabilityPeriod) obligations.push(`DLP: ${analysis.defectLiabilityPeriod}`);
  if (obligations.length === 0) {
    obligations.push("Review contract programme and milestone dates");
    obligations.push("Identify sectional completion dates if applicable");
    obligations.push("Note liquidated damages commencement trigger");
  }
  return obligations;
};
