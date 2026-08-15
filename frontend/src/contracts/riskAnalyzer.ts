import type { ContractAnalysis, ContractRisk, ContractRiskCategory } from "./types";

const addRisk = (
  risks: ContractRisk[],
  category: ContractRiskCategory,
  description: string,
  severity: ContractRisk["severity"],
  mitigation: string
): void => {
  risks.push({ category, description, severity, mitigation });
};

export const analyzeContractRisks = (
  analysis: ContractAnalysis,
  rawInput: string
): ContractRisk[] => {
  const risks: ContractRisk[] = [];
  const text = rawInput.toLowerCase();

  if (/liquidated\s+damages|penalty/i.test(text)) {
    addRisk(risks, "liability", "Liquidated damages clause — quantify maximum exposure", "high", "Calculate LD cap and include contingency in pricing");
  }

  if (/unlimited\s+liability|no\s+cap/i.test(text)) {
    addRisk(risks, "liability", "Potentially unlimited liability exposure", "high", "Negotiate liability cap aligned with contract value");
  }

  if (/lump\s*sum|fixed\s*price/i.test(text) || analysis.contractType === "lump-sum") {
    addRisk(risks, "payment", "Lump sum — contractor bears quantity/cost risk", "medium", "Ensure comprehensive quantity survey and risk allowance");
  }

  if (analysis.paymentTerms.length === 0) {
    addRisk(risks, "payment", "Payment terms not clearly identified", "medium", "Clarify milestone payment schedule and certification process");
  }

  if (/short\s+completion|tight\s+schedule/i.test(text)) {
    addRisk(risks, "time", "Aggressive completion timeline", "high", "Prepare realistic programme with float analysis");
  }

  if (!/extension\s+of\s+time|eot/i.test(text)) {
    addRisk(risks, "time", "EOT provisions not identified", "medium", "Verify EOT clause and qualifying events before signing");
  }

  if (/termination.*convenience/i.test(text)) {
    addRisk(risks, "termination", "Termination for convenience by employer", "medium", "Review compensation entitlement on termination");
  }

  if (analysis.insuranceRequirements.length === 0) {
    addRisk(risks, "insurance", "Insurance requirements not specified", "low", "Confirm required insurance covers and limits");
  }

  if (/design\s+responsibility|fit\s+for\s+purpose/i.test(text)) {
    addRisk(risks, "engineering", "Design responsibility / fitness for purpose obligation", "high", "Ensure design professional indemnity and peer review process");
  }

  if (/retention.*\d{2,}/i.test(text)) {
    addRisk(risks, "payment", "High retention percentage identified", "low", "Negotiate retention release at practical completion vs DLP end");
  }

  if (risks.length === 0) {
    addRisk(risks, "engineering", "Full contract review pending", "low", "Provide complete contract for comprehensive risk analysis");
  }

  return risks.slice(0, 12);
};

export const identifyMissingClauses = (analysis: ContractAnalysis): string[] => {
  const found = new Set(analysis.clauses.map((c) => c.title.toLowerCase()));
  const expected = [
    "Payment Terms",
    "Liquidated Damages",
    "Defect Liability Period",
    "Termination Conditions",
    "Variation/Change Orders",
    "Extension of Time",
    "Insurance & Indemnity",
    "Dispute Resolution",
    "Force Majeure",
    "Performance Security",
  ];

  return expected.filter((e) => !found.has(e.toLowerCase()));
};

export const identifyCriticalClauses = (analysis: ContractAnalysis): string[] =>
  analysis.clauses
    .filter((c) => c.riskLevel === "high")
    .map((c) => `${c.title} [${c.riskLevel}]`);

export const formatRiskRegister = (risks: ContractRisk[]): string =>
  [
    "RISK REGISTER:",
    ...risks.map(
      (r) =>
        `- [${r.severity.toUpperCase()}] ${r.category}: ${r.description}\n  Mitigation: ${r.mitigation}`
    ),
  ].join("\n");
