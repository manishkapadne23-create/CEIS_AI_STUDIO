import type { ObservationCategory, ObservationSeverity } from "./types";

const SEVERITY_PATTERNS: Array<{
  severity: ObservationSeverity;
  patterns: RegExp[];
  weight: number;
}> = [
  {
    severity: "critical",
    patterns: [/critical/i, /life[\s-]safety/i, /structural\s+failure/i, /collapse/i],
    weight: 4,
  },
  {
    severity: "high",
    patterns: [/high\s+severity/i, /major/i, /non[\s-]?compliance/i, /safety\s+risk/i],
    weight: 3,
  },
  {
    severity: "medium",
    patterns: [/medium/i, /moderate/i, /incomplete/i, /missing/i, /conflict/i],
    weight: 2,
  },
  {
    severity: "low",
    patterns: [/low/i, /minor/i, /observation/i, /suggestion/i, /improvement/i],
    weight: 1,
  },
];

const CATEGORY_SEVERITY_DEFAULTS: Partial<
  Record<ObservationCategory, ObservationSeverity>
> = {
  safety: "high",
  "technical-issue": "high",
  "conflicting-information": "high",
  "missing-information": "medium",
  constructability: "medium",
  maintainability: "low",
  "best-practice": "low",
};

export const inferObservationSeverity = (
  text: string,
  category: ObservationCategory
): ObservationSeverity => {
  let bestSeverity: ObservationSeverity = CATEGORY_SEVERITY_DEFAULTS[category] ?? "medium";
  let bestWeight = 0;

  for (const entry of SEVERITY_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(text))) {
      if (entry.weight > bestWeight) {
        bestWeight = entry.weight;
        bestSeverity = entry.severity;
      }
    }
  }

  return bestSeverity;
};

export const compareSeverity = (
  a: ObservationSeverity,
  b: ObservationSeverity
): number => {
  const order: Record<ObservationSeverity, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return order[b] - order[a];
};

export const formatSeveritySummary = (
  counts: Record<ObservationSeverity, number>
): string =>
  [
    `Critical: ${counts.critical}`,
    `High: ${counts.high}`,
    `Medium: ${counts.medium}`,
    `Low: ${counts.low}`,
  ].join(" | ");

export const getHighestSeverity = (
  severities: ObservationSeverity[]
): ObservationSeverity => {
  if (severities.length === 0) return "low";
  return severities.reduce((highest, current) =>
    compareSeverity(current, highest) > 0 ? current : highest
  );
};
