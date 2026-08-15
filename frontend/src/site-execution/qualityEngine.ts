import type { QualityRecord } from "./types";

export const verifyMaterial = (
  material: string,
  standard: string | null
): { checks: string[]; documents: string[] } => ({
  checks: [
    `Verify ${material} conforms to specified grade and dimensions`,
    "Check visual condition — no damage, corrosion, or contamination",
    "Confirm batch/lot number matches delivery documentation",
    "Verify storage conditions (temperature, humidity, cover)",
    standard ? `Cross-reference test results against ${standard}` : "Review material test certificate values",
    "Perform site sampling if QA plan requires",
    "Tag approved material; segregate rejected stock",
  ],
  documents: [
    "Material Test Certificate (MTC)",
    "Delivery challan / goods receipt note",
    "Purchase order and specification reference",
    "Third-party inspection release note (if applicable)",
    "Mill certificate and heat number traceability",
  ],
});

export const reviewWorkmanship = (activity: string): string[] => [
  `Assess ${activity} finish against specification tolerances`,
  "Check alignment, plumb, and level within allowable deviation",
  "Inspect joints, welds, or connections for defects",
  "Verify surface preparation before subsequent layers/coating",
  "Compare with approved mock-up or benchmark sample",
  "Document any rework requirements with photographic evidence",
];

export const identifyNonConformance = (description: string): string[] => {
  const ncrs: string[] = [];
  const d = description.toLowerCase();

  if (/crack|spall|honeycomb/i.test(d)) ncrs.push("Structural defect — concrete cracking or honeycombing");
  if (/corrosion|rust/i.test(d)) ncrs.push("Material degradation — corrosion observed");
  if (/leak|seepage/i.test(d)) ncrs.push("Water ingress — leakage or seepage detected");
  if (/misalign|offset|deviation/i.test(d)) ncrs.push("Dimensional non-conformance — alignment deviation");
  if (/weld|porosity|undercut/i.test(d)) ncrs.push("Welding defect — unacceptable weld quality");
  if (/insulation|short/i.test(d)) ncrs.push("Electrical defect — insulation or continuity failure");
  if (/contamination|foreign/i.test(d)) ncrs.push("Material contamination — foreign matter in product");

  if (ncrs.length === 0) {
    ncrs.push(`Non-conformance identified: ${description}`);
    ncrs.push("Classify severity: Minor / Major / Critical");
    ncrs.push("Determine root cause before corrective action");
  }
  return ncrs;
};

export const suggestCorrectiveActions = (
  nonConformances: string[]
): string[] =>
  nonConformances.flatMap((nc) => {
    const actions: string[] = [`Corrective action for: ${nc}`];
    if (/crack|structural/i.test(nc)) {
      actions.push("Engage structural engineer for assessment and repair method");
      actions.push("Perform NDT after repair and re-inspect");
    } else if (/corrosion/i.test(nc)) {
      actions.push("Remove corrosion, apply specified surface treatment");
      actions.push("Review storage and protection procedures");
    } else if (/weld/i.test(nc)) {
      actions.push("Grind and re-weld per qualified WPS");
      actions.push("Re-inspect with appropriate NDT method");
    } else if (/leak/i.test(nc)) {
      actions.push("Identify leak source, repair sealant/joint");
      actions.push("Pressure test after repair");
    } else {
      actions.push("Document root cause analysis");
      actions.push("Implement repair per approved method statement");
      actions.push("Re-inspect and obtain QA sign-off before proceeding");
    }
    return actions;
  });

export const createQualityRecord = (
  activity: string,
  materialVerified: boolean,
  workmanshipRating: QualityRecord["workmanshipRating"],
  nonConformances: string[]
): QualityRecord => ({
  id: crypto.randomUUID(),
  activity,
  materialVerified,
  workmanshipRating,
  nonConformances,
  correctiveActions: suggestCorrectiveActions(nonConformances),
  recordedAt: Date.now(),
});

export const formatQualityGuidance = (activity: string): string =>
  [
    `QUALITY GUIDANCE — ${activity}`,
    "",
    "Material Verification:",
    ...verifyMaterial(activity, null).checks.map((c, i) => `${i + 1}. ${c}`),
    "",
    "Workmanship Review:",
    ...reviewWorkmanship(activity).map((w, i) => `${i + 1}. ${w}`),
  ].join("\n");

export const formatQualityRecord = (record: QualityRecord): string =>
  [
    `QUALITY RECORD — ${record.activity}`,
    `Material Verified: ${record.materialVerified ? "Yes" : "No"}`,
    `Workmanship: ${record.workmanshipRating}`,
    "",
    record.nonConformances.length > 0
      ? ["Non-Conformances:", ...record.nonConformances.map((n) => `- ${n}`)].join("\n")
      : "No non-conformances recorded.",
    "",
    "Corrective Actions:",
    ...record.correctiveActions.map((a) => `- ${a}`),
  ].join("\n");

export const formatNcrReport = (
  description: string,
  actions: string[]
): string =>
  [
    "NON-CONFORMANCE REPORT",
    `Issue: ${description}`,
    "",
    "Identified Non-Conformances:",
    ...identifyNonConformance(description).map((n) => `- ${n}`),
    "",
    "Suggested Corrective Actions:",
    ...actions.map((a) => `- ${a}`),
  ].join("\n");
