import type { TenderAnalysis, TenderRisk, TenderRiskCategory } from "./types";

const addRisk = (
  risks: TenderRisk[],
  category: TenderRiskCategory,
  description: string,
  severity: TenderRisk["severity"],
  mitigation: string
): void => {
  risks.push({ category, description, severity, mitigation });
};

export const analyzeTenderRisks = (
  analysis: TenderAnalysis,
  rawInput: string
): TenderRisk[] => {
  const risks: TenderRisk[] = [];
  const text = rawInput.toLowerCase();

  if (/penalty|liquidated\s+damages/i.test(text)) {
    addRisk(
      risks,
      "contract",
      "Penalty/liquidated damages clause identified",
      "high",
      "Quantify maximum exposure and include in pricing contingency"
    );
  }

  if (/lump\s+sum|fixed\s+price/i.test(text)) {
    addRisk(
      risks,
      "commercial",
      "Lump sum/fixed price contract — cost overrun risk",
      "medium",
      "Ensure comprehensive quantity take-off and risk allowance in pricing"
    );
  }

  if (analysis.boqItems.length === 0) {
    addRisk(
      risks,
      "commercial",
      "No BOQ provided — pricing basis unclear",
      "medium",
      "Submit pre-bid query on pricing format and quantity responsibility"
    );
  }

  if (analysis.standardsIdentified.length === 0) {
    addRisk(
      risks,
      "technical",
      "Applicable standards not specified",
      "medium",
      "Clarify governing codes and standards before technical proposal"
    );
  }

  if (/short\s+completion|tight\s+schedule|\d+\s*months?\s*completion/i.test(text)) {
    addRisk(
      risks,
      "engineering",
      "Aggressive completion timeline",
      "high",
      "Prepare detailed work programme and assess resource requirements"
    );
  }

  if (analysis.experienceRequirements.length > 2) {
    addRisk(
      risks,
      "eligibility",
      "Multiple experience requirements — qualification risk",
      "medium",
      "Map each requirement to specific completed projects"
    );
  }

  if (/performance\s+guarantee|bank\s+guarantee/i.test(text)) {
    addRisk(
      risks,
      "commercial",
      "Performance/bank guarantee requirements",
      "low",
      "Confirm BG format and issuing bank acceptability with client"
    );
  }

  if (/variation|change\s+order|extra\s+item/i.test(text)) {
    addRisk(
      risks,
      "contract",
      "Variation/change order provisions",
      "low",
      "Review variation approval process and rate basis for extra items"
    );
  }

  if (risks.length === 0) {
    addRisk(
      risks,
      "engineering",
      "Full tender document review pending",
      "low",
      "Upload complete tender document for comprehensive risk analysis"
    );
  }

  return risks.slice(0, 10);
};

export const generateClarificationPoints = (
  analysis: TenderAnalysis,
  risks: TenderRisk[]
): { topic: string; question: string; priority: "low" | "medium" | "high" }[] => {
  const points: { topic: string; question: string; priority: "low" | "medium" | "high" }[] = [];

  if (!analysis.bidDueDate) {
    points.push({
      topic: "Submission",
      question: "Please confirm the exact date and time for bid submission.",
      priority: "high",
    });
  }

  if (analysis.standardsIdentified.length === 0) {
    points.push({
      topic: "Standards",
      question: "Please specify the applicable design codes and standards for this project.",
      priority: "high",
    });
  }

  if (analysis.boqItems.length === 0) {
    points.push({
      topic: "BOQ",
      question: "Please confirm whether pricing shall be item-rate or lump-sum basis.",
      priority: "medium",
    });
  }

  if (!analysis.completionPeriod) {
    points.push({
      topic: "Schedule",
      question: "Please confirm the required completion period and milestone dates.",
      priority: "medium",
    });
  }

  for (const risk of risks.filter((r) => r.severity === "high").slice(0, 3)) {
    points.push({
      topic: risk.category,
      question: `Please clarify: ${risk.description} — ${risk.mitigation}`,
      priority: "high",
    });
  }

  return points.slice(0, 8);
};

export const formatRiskReport = (risks: TenderRisk[]): string =>
  [
    "RISK ANALYSIS:",
    ...risks.map(
      (r) =>
        `- [${r.severity.toUpperCase()}] ${r.category}: ${r.description}\n  Mitigation: ${r.mitigation}`
    ),
  ].join("\n");
