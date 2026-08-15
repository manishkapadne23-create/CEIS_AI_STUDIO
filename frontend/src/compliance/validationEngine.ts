import type {
  ComplianceArtifactType,
  ComplianceReviewIntent,
  ValidationCheck,
  ValidationType,
} from "./types";

const REVIEW_PATTERNS: Array<{
  intent: ComplianceReviewIntent;
  artifactType: ComplianceArtifactType;
  patterns: RegExp[];
}> = [
  { intent: "review-boq", artifactType: "boq", patterns: [/review\s+(this\s+)?boq/i, /validate\s+boq/i, /check\s+boq/i] },
  { intent: "review-specification", artifactType: "specification", patterns: [/review\s+(this\s+)?specification/i, /validate\s+spec/i] },
  { intent: "review-dpr", artifactType: "dpr", patterns: [/review\s+(this\s+)?dpr/i, /validate\s+dpr/i, /detailed\s+project\s+report/i] },
  { intent: "review-method-statement", artifactType: "method-statement", patterns: [/review\s+(this\s+)?method\s+statement/i, /validate\s+method/i] },
  { intent: "review-design-note", artifactType: "design", patterns: [/review\s+(this\s+)?design\s+note/i, /validate\s+design/i] },
  { intent: "review-technical-report", artifactType: "report", patterns: [/review\s+(this\s+)?technical\s+report/i, /validate\s+report/i] },
  { intent: "review-inspection-report", artifactType: "inspection-format", patterns: [/review\s+(this\s+)?inspection/i, /validate\s+inspection/i] },
  { intent: "review-calculation", artifactType: "calculation", patterns: [/review\s+(this\s+)?calculation/i, /validate\s+calculation/i] },
];

const COMPLIANCE_TRIGGERS =
  /\b(compliance|compliant|validate|validation|verify|review|audit|qa\s*\/\s*qc|conformance|non[\s-]?compliance)\b/i;

const ARTIFACT_PATTERNS: Array<{
  artifactType: ComplianceArtifactType;
  patterns: RegExp[];
}> = [
  { artifactType: "boq", patterns: [/\bboq\b/i, /bill\s+of\s+quantities/i] },
  { artifactType: "specification", patterns: [/specification/i, /\bspec\b/i] },
  { artifactType: "dpr", patterns: [/\bdpr\b/i, /detailed\s+project/i] },
  { artifactType: "method-statement", patterns: [/method\s+statement/i] },
  { artifactType: "design", patterns: [/design\s+note/i, /design\s+calculation/i] },
  { artifactType: "report", patterns: [/technical\s+report/i, /engineering\s+report/i] },
  { artifactType: "inspection-format", patterns: [/inspection\s+report/i, /inspection\s+format/i] },
  { artifactType: "qa-qc-document", patterns: [/qa\s*\/\s*qc/i, /quality\s+plan/i] },
  { artifactType: "calculation", patterns: [/calculation\s+sheet/i, /design\s+calculation/i] },
  { artifactType: "technical-note", patterns: [/technical\s+note/i] },
];

export const isComplianceQuery = (message: string): boolean =>
  COMPLIANCE_TRIGGERS.test(message) ||
  REVIEW_PATTERNS.some((entry) =>
    entry.patterns.some((pattern) => pattern.test(message))
  );

export const detectReviewIntent = (
  message: string
): ComplianceReviewIntent => {
  for (const entry of REVIEW_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(message))) {
      return entry.intent;
    }
  }
  return "general-compliance-review";
};

export const detectArtifactType = (
  message: string,
  reviewIntent: ComplianceReviewIntent
): ComplianceArtifactType => {
  const reviewMatch = REVIEW_PATTERNS.find((e) => e.intent === reviewIntent);
  if (reviewMatch) return reviewMatch.artifactType;

  for (const entry of ARTIFACT_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(message))) {
      return entry.artifactType;
    }
  }

  return "general";
};

export const resolveValidationTypes = (
  artifactType: ComplianceArtifactType,
  message: string
): ValidationType[] => {
  const types: ValidationType[] = [
    "standards-compliance",
    "engineering-completeness",
    "missing-information",
  ];

  if (artifactType === "specification" || artifactType === "boq") {
    types.push("specification-compliance", "document-consistency");
  }

  if (artifactType === "design" || artifactType === "calculation") {
    types.push("technical-accuracy", "engineering-consistency");
  }

  if (artifactType === "method-statement" || artifactType === "inspection-format") {
    types.push("best-practice-review", "specification-compliance");
  }

  if (artifactType === "qa-qc-document") {
    types.push("best-practice-review", "document-consistency");
  }

  if (/\bconflict|inconsisten|discrepanc/i.test(message)) {
    types.push("engineering-consistency", "document-consistency");
  }

  return [...new Set(types)];
};

export const buildValidationChecks = (
  validationTypes: ValidationType[],
  artifactType: ComplianceArtifactType
): ValidationCheck[] => {
  const checkDefinitions: Record<ValidationType, ValidationCheck> = {
    "standards-compliance": {
      id: "standards-compliance",
      type: "standards-compliance",
      label: "Standards Compliance",
      description: "Verify compliance with applicable IRC, IS, MoRTH, NBC, IEC, and discipline codes",
      status: "pending",
    },
    "specification-compliance": {
      id: "specification-compliance",
      type: "specification-compliance",
      label: "Specification Compliance",
      description: "Check alignment with project specifications and contract requirements",
      status: "pending",
    },
    "engineering-completeness": {
      id: "engineering-completeness",
      type: "engineering-completeness",
      label: "Engineering Completeness",
      description: "Verify all required sections, inputs, and deliverables are present",
      status: "pending",
    },
    "missing-information": {
      id: "missing-information",
      type: "missing-information",
      label: "Missing Information",
      description: "Identify missing data, assumptions, references, and supporting documents",
      status: "pending",
    },
    "engineering-consistency": {
      id: "engineering-consistency",
      type: "engineering-consistency",
      label: "Engineering Consistency",
      description: "Check internal consistency of values, units, and engineering logic",
      status: "pending",
    },
    "document-consistency": {
      id: "document-consistency",
      type: "document-consistency",
      label: "Document Consistency",
      description: "Cross-check consistency across related documents and drawings",
      status: "pending",
    },
    "technical-accuracy": {
      id: "technical-accuracy",
      type: "technical-accuracy",
      label: "Technical Accuracy",
      description: "Review calculations, formulas, units, and engineering methodology",
      status: "pending",
    },
    "best-practice-review": {
      id: "best-practice-review",
      type: "best-practice-review",
      label: "Best Practice Review",
      description: "Assess alignment with industry best practices and lessons learned",
      status: "pending",
    },
  };

  const artifactExtras: Partial<Record<ComplianceArtifactType, ValidationCheck[]>> = {
    boq: [
      {
        id: "boq-units",
        type: "engineering-consistency",
        label: "BOQ Unit Consistency",
        description: "Verify units, measurement rules, and item descriptions",
        status: "pending",
      },
    ],
    "method-statement": [
      {
        id: "ms-safety",
        type: "best-practice-review",
        label: "Safety & Method Review",
        description: "Verify safety measures, sequence, and plant requirements",
        status: "pending",
      },
    ],
  };

  const checks = validationTypes.map((type) => ({ ...checkDefinitions[type] }));
  const extras = artifactExtras[artifactType] ?? [];

  return [...checks, ...extras];
};

export const formatValidationChecksForPrompt = (
  checks: ValidationCheck[]
): string =>
  checks
    .map(
      (check, index) =>
        `${index + 1}. [${check.type}] ${check.label}: ${check.description}`
    )
    .join("\n");
