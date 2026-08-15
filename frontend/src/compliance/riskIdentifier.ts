import type {
  ComplianceArtifactType,
  IdentifiedRisk,
  RiskCategory,
  RiskSeverity,
  StandardsValidationResult,
} from "./types";

const RISK_TEMPLATES: Array<{
  category: RiskCategory;
  patterns: RegExp[];
  severity: RiskSeverity;
  title: string;
  description: string;
  mitigation: string;
}> = [
  {
    category: "missing-clause",
    patterns: [/missing\s+clause/i, /incomplete\s+spec/i, /not\s+specified/i],
    severity: "medium",
    title: "Missing specification clause",
    description: "Required clause or specification section may be absent",
    mitigation: "Cross-reference with applicable standard and project specification index",
  },
  {
    category: "conflicting-requirement",
    patterns: [/conflict/i, /inconsisten/i, /contradict/i, /discrepanc/i],
    severity: "high",
    title: "Conflicting requirements",
    description: "Potential conflict between stated requirements or documents",
    mitigation: "Prepare clarification matrix and seek engineer/consultant resolution",
  },
  {
    category: "incomplete-information",
    patterns: [/incomplete/i, /missing\s+data/i, /not\s+provided/i, /tbd\b/i],
    severity: "medium",
    title: "Incomplete information",
    description: "Key engineering data or inputs appear incomplete",
    mitigation: "Request missing inputs before final approval",
  },
  {
    category: "engineering-risk",
    patterns: [/design\s+risk/i, /structural/i, /foundation/i, /load/i],
    severity: "high",
    title: "Engineering design risk",
    description: "Design assumptions or capacity may need verification",
    mitigation: "Perform independent check calculation and peer review",
  },
  {
    category: "constructability",
    patterns: [/construct/i, /site\s+constraint/i, /access/i, /sequence/i],
    severity: "medium",
    title: "Constructability concern",
    description: "Design or method may pose construction challenges",
    mitigation: "Conduct constructability review with site team",
  },
  {
    category: "maintainability",
    patterns: [/maintain/i, /durability/i, /service\s+life/i],
    severity: "low",
    title: "Maintainability concern",
    description: "Long-term maintenance or durability may be impacted",
    mitigation: "Review maintenance plan and material specifications",
  },
  {
    category: "safety",
    patterns: [/safety/i, /hazard/i, /risk\s+assessment/i, /ppe\b/i],
    severity: "high",
    title: "Safety concern",
    description: "Safety requirements may be inadequate or missing",
    mitigation: "Align with project safety plan and applicable safety standards",
  },
];

const ARTIFACT_RISKS: Partial<
  Record<ComplianceArtifactType, IdentifiedRisk[]>
> = {
  boq: [
    {
      id: "boq-measurement",
      category: "engineering-risk",
      severity: "medium",
      title: "BOQ measurement ambiguity",
      description: "Item descriptions or measurement rules may be unclear",
      mitigation: "Verify against method of measurement and contract conditions",
    },
  ],
  "method-statement": [
    {
      id: "ms-hazard",
      category: "safety",
      severity: "high",
      title: "Method statement hazard gaps",
      description: "Hazard identification and control measures need verification",
      mitigation: "Cross-check with HIRA and site safety requirements",
    },
  ],
  specification: [
    {
      id: "spec-gap",
      category: "missing-clause",
      severity: "medium",
      title: "Specification completeness",
      description: "Performance criteria or acceptance standards may be missing",
      mitigation: "Compare against standard specification templates",
    },
  ],
};

export const identifyComplianceRisks = (
  message: string,
  artifactType: ComplianceArtifactType,
  standardsValidation: StandardsValidationResult
): IdentifiedRisk[] => {
  const risks: IdentifiedRisk[] = [];

  for (const template of RISK_TEMPLATES) {
    if (template.patterns.some((pattern) => pattern.test(message))) {
      risks.push({
        id: `risk-${template.category}-${risks.length}`,
        category: template.category,
        severity: template.severity,
        title: template.title,
        description: template.description,
        mitigation: template.mitigation,
      });
    }
  }

  for (const missing of standardsValidation.missingReferences) {
    risks.push({
      id: `risk-std-${risks.length}`,
      category: "missing-clause",
      severity: "medium",
      title: "Standards reference gap",
      description: missing,
      mitigation: "Add explicit standard references with applicable clauses",
    });
  }

  const artifactRisks = ARTIFACT_RISKS[artifactType] ?? [];
  for (const risk of artifactRisks) {
    risks.push({ ...risk, id: `${risk.id}-${risks.length}` });
  }

  if (risks.length === 0) {
    risks.push({
      id: "risk-general",
      category: "incomplete-information",
      severity: "low",
      title: "General review required",
      description: "Perform systematic compliance review against applicable standards",
      mitigation: "Use validation checklist and document all findings",
    });
  }

  return risks.slice(0, 10);
};

export const formatRisksForPrompt = (risks: IdentifiedRisk[]): string => {
  if (risks.length === 0) return "No risks identified.";

  return risks
    .map(
      (risk) =>
        `- [${risk.severity.toUpperCase()}] ${risk.title} (${risk.category}): ${risk.description}\n  Mitigation: ${risk.mitigation}`
    )
    .join("\n");
};
