import type { TenderAnalysis } from "./types";

export const analyzeTenderScope = (analysis: TenderAnalysis): string[] => {
  const findings: string[] = [];

  if (analysis.scopeOfWork.length > 0) {
    findings.push(`Scope comprises ${analysis.scopeOfWork.length} identified work package(s)`);
  } else {
    findings.push("Scope of work not clearly identified — request clarification");
  }

  if (analysis.technicalCriteria.length > 0) {
    findings.push(`${analysis.technicalCriteria.length} technical requirement(s) identified`);
  }

  if (analysis.standardsIdentified.length > 0) {
    findings.push(`Standards referenced: ${analysis.standardsIdentified.slice(0, 5).join(", ")}`);
  } else {
    findings.push("No specific standards identified — verify applicable codes");
  }

  if (analysis.drawingReferences.length > 0) {
    findings.push(`Drawing references: ${analysis.drawingReferences.length} found`);
  }

  if (analysis.boqItems.length > 0) {
    findings.push("BOQ/schedule of quantities referenced — review quantities and units");
  } else {
    findings.push("No BOQ reference found — confirm pricing basis (lump sum vs item rate)");
  }

  return findings;
};

export const analyzeTechnicalRequirements = (
  analysis: TenderAnalysis
): string[] => {
  const requirements: string[] = [...analysis.technicalCriteria];

  if (analysis.standardsIdentified.length > 0) {
    requirements.push(
      `Compliance with: ${analysis.standardsIdentified.join(", ")}`
    );
  }

  if (requirements.length === 0) {
    requirements.push(
      "Review technical specifications annexure for material grades, testing requirements and acceptance criteria"
    );
  }

  return requirements.slice(0, 10);
};

export const identifyCriticalClauses = (rawInput: string): string[] => {
  const clauses: string[] = [];
  const patterns = [
    /(?:penalty|liquidated\s+damages)[^.]{0,120}/gi,
    /(?:termination|forfeit)[^.]{0,120}/gi,
    /(?:arbitration|dispute)[^.]{0,120}/gi,
    /(?:warranty|defect\s+liability)[^.]{0,120}/gi,
    /(?:force\s+majeure)[^.]{0,120}/gi,
    /(?:variation|change\s+order)[^.]{0,120}/gi,
    /(?:limitation\s+of\s+liability)[^.]{0,120}/gi,
  ];

  for (const pattern of patterns) {
    const matches = rawInput.match(pattern);
    if (matches) {
      clauses.push(...matches.map((m) => m.trim().slice(0, 150)));
    }
  }

  if (clauses.length === 0) {
    clauses.push(
      "Review GCC/SCC for penalty, termination, arbitration and warranty clauses"
    );
  }

  return [...new Set(clauses)].slice(0, 8);
};

export const formatScopeAnalysisForPrompt = (
  analysis: TenderAnalysis
): string =>
  [
    "SCOPE ANALYSIS:",
    ...analyzeTenderScope(analysis).map((f) => `- ${f}`),
    "",
    "TECHNICAL REQUIREMENTS:",
    ...analyzeTechnicalRequirements(analysis).map((r) => `- ${r}`),
  ].join("\n");
