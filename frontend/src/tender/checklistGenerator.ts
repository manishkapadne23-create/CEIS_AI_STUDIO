import type { ChecklistType, TenderAnalysis, TenderChecklist } from "./types";

const BID_SUBMISSION_ITEMS = [
  "Technical proposal (signed and stamped)",
  "Commercial/financial bid (separate envelope if required)",
  "EMD/Bid security in prescribed format",
  "Tender document duly signed on all pages",
  "Integrity pact (if applicable)",
  "Power of attorney for authorized signatory",
  "All annexures and schedules completed",
  "Pre-bid meeting attendance confirmation (if mandatory)",
  "Online portal upload confirmation receipt",
  "Bid validity period confirmed (typically 90-180 days)",
];

const TECHNICAL_DOC_ITEMS = [
  "Method statement / work methodology",
  "Work programme / project schedule (Gantt chart)",
  "Organization chart and key personnel CVs",
  "Equipment list with capacity and availability",
  "Quality assurance plan",
  "Safety/HSE plan",
  "Technical compliance statement",
  "Material specifications and sources",
  "Testing and commissioning plan",
  "Drawings/sketches (if required)",
];

const COMMERCIAL_DOC_ITEMS = [
  "Priced BOQ / schedule of rates",
  "Price summary sheet",
  "Breakdown of overheads and profit",
  "Taxes and duties statement (GST)",
  "Bank guarantee format acceptance",
  "Payment terms compliance confirmation",
  "Insurance requirements compliance",
  "Currency and payment milestone alignment",
];

const QUALIFICATION_ITEMS = [
  "Company registration and incorporation documents",
  "GST and PAN registration",
  "Audited financial statements (3 years)",
  "Average annual turnover certificate",
  "Similar work experience certificates",
  "Valid contractor license/registration",
  "Litigation/arbitration declaration",
  "Blacklist/non-debarment affidavit",
  "OEM authorization (if applicable)",
  "ISO/quality certifications (if required)",
];

export const generateChecklist = (type: ChecklistType): TenderChecklist => {
  switch (type) {
    case "bid-submission":
      return { type, title: "Bid Submission Checklist", items: BID_SUBMISSION_ITEMS };
    case "technical-document":
      return { type, title: "Technical Document Checklist", items: TECHNICAL_DOC_ITEMS };
    case "commercial-document":
      return { type, title: "Commercial Document Checklist", items: COMMERCIAL_DOC_ITEMS };
    case "qualification":
      return { type, title: "Qualification Checklist", items: QUALIFICATION_ITEMS };
  }
};

export const generateAllChecklists = (): TenderChecklist[] =>
  (["bid-submission", "technical-document", "commercial-document", "qualification"] as ChecklistType[]).map(
    generateChecklist
  );

export const customizeChecklist = (
  checklist: TenderChecklist,
  analysis: TenderAnalysis
): TenderChecklist => {
  const extra: string[] = [];

  if (analysis.standardsIdentified.length > 0) {
    extra.push(`Standards compliance: ${analysis.standardsIdentified.join(", ")}`);
  }
  if (analysis.drawingReferences.length > 0) {
    extra.push("Reference drawings reviewed and acknowledged");
  }
  if (analysis.boqItems.length > 0) {
    extra.push("BOQ quantities verified against drawings");
  }

  return {
    ...checklist,
    items: [...checklist.items, ...extra],
  };
};

export const formatChecklistForPrompt = (checklist: TenderChecklist): string =>
  [
    checklist.title,
    ...checklist.items.map((item, i) => `${i + 1}. [ ] ${item}`),
  ].join("\n");

export const formatAllChecklistsForPrompt = (
  checklists: TenderChecklist[]
): string =>
  checklists.map(formatChecklistForPrompt).join("\n\n");

export const draftPreBidQuestion = (
  topic: string,
  context: string
): string =>
  `Subject: Pre-Bid Query — ${topic}\n\nDear Sir/Madam,\n\nWith reference to the above tender, we request clarification on the following:\n\n${context}\n\nWe would appreciate your response before the pre-bid meeting / query deadline.\n\nThanking you,\n[Bidder Name]`;
