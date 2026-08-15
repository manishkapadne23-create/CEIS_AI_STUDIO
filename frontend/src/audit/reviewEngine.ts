import type {
  AuditType,
  ReviewCriterion,
  ReviewMode,
} from "./types";

const AUDIT_TYPE_PATTERNS: Array<{ type: AuditType; patterns: RegExp[] }> = [
  { type: "design-review", patterns: [/design\s+review/i, /review\s+design/i] },
  { type: "drawing-review", patterns: [/drawing\s+review/i, /review\s+drawing/i] },
  { type: "specification-review", patterns: [/specification\s+review/i, /review\s+spec/i] },
  { type: "boq-review", patterns: [/boq\s+review/i, /review\s+boq/i] },
  { type: "dpr-review", patterns: [/dpr\s+review/i, /review\s+dpr/i] },
  { type: "estimate-review", patterns: [/estimate\s+review/i, /cost\s+review/i] },
  { type: "method-statement-review", patterns: [/method\s+statement\s+review/i] },
  { type: "qa-qc-audit", patterns: [/qa\s*\/\s*qc\s+audit/i, /quality\s+audit/i] },
  { type: "safety-audit", patterns: [/safety\s+audit/i, /hse\s+audit/i] },
  { type: "technical-audit", patterns: [/technical\s+audit/i, /engineering\s+audit/i] },
  { type: "maintenance-audit", patterns: [/maintenance\s+audit/i, /asset\s+audit/i] },
];

const REVIEW_MODE_PATTERNS: Array<{ mode: ReviewMode; patterns: RegExp[] }> = [
  { mode: "quick-review", patterns: [/quick\s+review/i, /brief\s+review/i] },
  { mode: "detailed-review", patterns: [/detailed\s+review/i, /comprehensive\s+review/i] },
  { mode: "compliance-review", patterns: [/compliance\s+review/i] },
  { mode: "risk-review", patterns: [/risk\s+review/i, /risk[\s-]based/i] },
  { mode: "peer-review", patterns: [/peer\s+review/i] },
  { mode: "independent-review", patterns: [/independent\s+review/i, /third[\s-]party/i] },
  { mode: "final-review", patterns: [/final\s+review/i, /approval\s+review/i] },
];

const AUDIT_TRIGGERS =
  /\b(audit|review|observation|peer\s+review|independent\s+review|audit\s+report|observation\s+register|technical\s+review)\b/i;

export const isAuditQuery = (message: string): boolean =>
  AUDIT_TRIGGERS.test(message) ||
  AUDIT_TYPE_PATTERNS.some((entry) =>
    entry.patterns.some((pattern) => pattern.test(message))
  );

export const detectAuditType = (message: string): AuditType => {
  for (const entry of AUDIT_TYPE_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(message))) {
      return entry.type;
    }
  }

  if (/audit/i.test(message)) return "technical-audit";
  if (/review/i.test(message)) return "general-audit";

  return "general-audit";
};

export const detectReviewMode = (message: string): ReviewMode => {
  for (const entry of REVIEW_MODE_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(message))) {
      return entry.mode;
    }
  }

  if (/detailed|comprehensive|full/i.test(message)) return "detailed-review";
  if (/quick|brief|summary/i.test(message)) return "quick-review";
  if (/final|approval/i.test(message)) return "final-review";

  return "detailed-review";
};

export const getReviewCriteria = (
  criteria: ReviewCriterion[],
  reviewMode: ReviewMode
): ReviewCriterion[] => {
  if (reviewMode === "quick-review") {
    return criteria.filter((c) =>
      ["completeness", "technical-issue", "safety", "standards-reference"].includes(
        c.category
      )
    );
  }

  if (reviewMode === "risk-review") {
    return criteria.filter((c) =>
      ["safety", "technical-issue", "constructability", "conflicting-information"].includes(
        c.category
      )
    );
  }

  if (reviewMode === "compliance-review") {
    return criteria.filter((c) =>
      ["standards-reference", "best-practice", "completeness"].includes(c.category)
    );
  }

  return criteria;
};

export const formatReviewCriteriaForPrompt = (
  criteria: ReviewCriterion[],
  reviewMode: ReviewMode
): string => {
  const active = getReviewCriteria(criteria, reviewMode);

  return [
    `Review mode: ${reviewMode.replace(/-/g, " ")}`,
    `Criteria (${active.length}):`,
    ...active.map(
      (c, index) => `${index + 1}. [${c.category}] ${c.label}: ${c.description}`
    ),
  ].join("\n");
};
