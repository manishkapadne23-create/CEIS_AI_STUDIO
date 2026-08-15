import { inferObservationSeverity } from "./severityAnalyzer";
import type {
  AuditFollowUpSummary,
  AuditObservation,
  ObservationCategory,
  ObservationSeverity,
  ObservationStatus,
  ReviewCriterion,
} from "./types";

const STORAGE_KEY = "sarathi.audit.observations";

let observationStore: AuditObservation[] = [];
let hydrated = false;
let observationCounter = 0;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    observationStore = raw ? (JSON.parse(raw) as AuditObservation[]) : [];
    observationCounter = observationStore.reduce(
      (max, obs) => Math.max(max, obs.number),
      0
    );
  } catch {
    observationStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(observationStore));
};

const inferResponsibleDiscipline = (
  category: ObservationCategory,
  disciplineName: string | null
): string => {
  const map: Partial<Record<ObservationCategory, string>> = {
    safety: "HSE / Safety",
    constructability: "Construction",
    maintainability: "Operations & Maintenance",
    "standards-reference": "Quality / Standards",
  };
  return map[category] ?? disciplineName ?? "Engineering";
};

export const generateObservations = (
  message: string,
  auditId: string,
  criteria: ReviewCriterion[],
  disciplineName: string | null
): AuditObservation[] => {
  hydrate();
  const now = Date.now();
  const observations: AuditObservation[] = [];

  const observationTemplates: Array<{
    category: ObservationCategory;
    patterns: RegExp[];
    description: string;
    recommendation: string;
  }> = [
    {
      category: "missing-information",
      patterns: [/missing/i, /incomplete/i, /not\s+provided/i],
      description: "Required information or supporting document appears missing",
      recommendation: "Request missing data before approval",
    },
    {
      category: "conflicting-information",
      patterns: [/conflict/i, /inconsisten/i, /discrepanc/i],
      description: "Conflicting requirements or values identified",
      recommendation: "Prepare clarification matrix and resolve before proceeding",
    },
    {
      category: "standards-reference",
      patterns: [/standard/i, /\b(is|irc|iec|astm)\b/i],
      description: "Standards reference requires verification against project requirements",
      recommendation: "Confirm applicable code edition and clause references",
    },
    {
      category: "safety",
      patterns: [/safety/i, /hazard/i, /risk/i],
      description: "Safety-related observation requiring attention",
      recommendation: "Align with project safety plan and applicable safety standards",
    },
    {
      category: "technical-issue",
      patterns: [/design/i, /calculation/i, /structural/i, /technical/i],
      description: "Technical issue requiring engineering review",
      recommendation: "Perform independent check and document resolution",
    },
    {
      category: "constructability",
      patterns: [/construct/i, /site/i, /access/i],
      description: "Constructability concern identified",
      recommendation: "Conduct constructability review with site team",
    },
  ];

  for (const template of observationTemplates) {
    if (template.patterns.some((pattern) => pattern.test(message))) {
      observationCounter += 1;
      const severity = inferObservationSeverity(message, template.category);

      observations.push({
        id: crypto.randomUUID(),
        number: observationCounter,
        category: template.category,
        severity,
        description: template.description,
        recommendation: template.recommendation,
        responsibleDiscipline: inferResponsibleDiscipline(
          template.category,
          disciplineName
        ),
        status: "open",
        auditId,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  if (observations.length === 0) {
    const primaryCriterion = criteria[0];
    observationCounter += 1;
    observations.push({
      id: crypto.randomUUID(),
      number: observationCounter,
      category: primaryCriterion?.category ?? "completeness",
      severity: "low",
      description: `Systematic ${primaryCriterion?.label ?? "engineering"} review recommended`,
      recommendation: "Complete discipline checklist and document findings",
      responsibleDiscipline: disciplineName ?? "Engineering",
      status: "open",
      auditId,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const obs of observations) {
    observationStore.unshift(obs);
  }
  observationStore = observationStore.slice(0, 200);
  persist();

  return observations;
};

export const listObservations = (auditId?: string): AuditObservation[] => {
  hydrate();
  if (!auditId) return [...observationStore];
  return observationStore.filter((obs) => obs.auditId === auditId);
};

export const updateObservationStatus = (
  observationId: string,
  status: ObservationStatus
): AuditObservation | null => {
  hydrate();
  const index = observationStore.findIndex((obs) => obs.id === observationId);
  if (index < 0) return null;

  observationStore[index] = {
    ...observationStore[index],
    status,
    updatedAt: Date.now(),
  };
  persist();
  return observationStore[index];
};

export const getFollowUpSummary = (auditId?: string): AuditFollowUpSummary => {
  const observations = listObservations(auditId);

  return {
    open: observations.filter((o) => o.status === "open").length,
    resolved: observations.filter((o) => o.status === "resolved").length,
    pendingReview: observations.filter((o) => o.status === "pending-review").length,
    closed: observations.filter((o) => o.status === "closed").length,
    total: observations.length,
  };
};

export const formatObservationsForPrompt = (
  observations: AuditObservation[]
): string => {
  if (observations.length === 0) return "No observations generated.";

  return observations
    .map(
      (obs) =>
        [
          `OBS-${String(obs.number).padStart(3, "0")} [${obs.severity.toUpperCase()}] (${obs.category})`,
          `  Description: ${obs.description}`,
          `  Recommendation: ${obs.recommendation}`,
          `  Responsible: ${obs.responsibleDiscipline}`,
          `  Status: ${obs.status}`,
        ].join("\n")
    )
    .join("\n\n");
};

export const formatFollowUpForPrompt = (
  summary: AuditFollowUpSummary
): string =>
  [
    "FOLLOW-UP TRACKING:",
    `Open: ${summary.open}`,
    `Pending Review: ${summary.pendingReview}`,
    `Resolved: ${summary.resolved}`,
    `Closed: ${summary.closed}`,
    `Total: ${summary.total}`,
  ].join("\n");

export const countBySeverity = (
  observations: AuditObservation[]
): Record<ObservationSeverity, number> => ({
  low: observations.filter((o) => o.severity === "low").length,
  medium: observations.filter((o) => o.severity === "medium").length,
  high: observations.filter((o) => o.severity === "high").length,
  critical: observations.filter((o) => o.severity === "critical").length,
});
