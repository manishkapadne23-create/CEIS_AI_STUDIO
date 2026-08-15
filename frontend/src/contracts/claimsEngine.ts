import type { ClaimAssessment, ClaimTypeId } from "./types";

export const CLAIM_TYPES: { id: ClaimTypeId; name: string }[] = [
  { id: "delay", name: "Delay Claim" },
  { id: "variation", name: "Variation Claim" },
  { id: "extra-item", name: "Extra Item Claim" },
  { id: "cost-escalation", name: "Cost Escalation" },
  { id: "time-extension", name: "Time Extension (EOT)" },
  { id: "compensation-event", name: "Compensation Event" },
];

const CLAIM_DOCS: Record<ClaimTypeId, string[]> = {
  delay: [
    "Updated programme (as-planned vs as-built)",
    "Delay analysis report (impacted as-planned or time impact)",
    "Correspondence showing cause of delay",
    "Site records/daily reports during delay period",
    "Weather records (if weather-related)",
    "Notice of claim within contractual timeframe",
  ],
  variation: [
    "Variation order / change instruction",
    "Revised drawings or specifications",
    "Cost breakdown for additional work",
    "Time impact assessment",
    "Correspondence trail",
    "Engineer's instruction or written confirmation",
  ],
  "extra-item": [
    "Engineer's written instruction for extra work",
    "BOQ comparison showing item not in original scope",
    "Quantity measurement records",
    "Rate analysis for new item",
    "Site instructions / RFIs",
  ],
  "cost-escalation": [
    "Original contract rates vs current market rates",
    "Price escalation formula per contract",
    "Material cost indices (wholesale price index)",
    "Purchase invoices for affected materials",
    "Contract clause permitting escalation",
  ],
  "time-extension": [
    "EOT application with revised completion date",
    "Cause-and-effect narrative",
    "Supporting records for qualifying event",
    "Notice served within contract period",
    "Updated critical path programme",
  ],
  "compensation-event": [
    "Event notification per contract clause",
    "Cost and time impact assessment",
    "Records of additional costs incurred",
    "Correspondence with employer/engineer",
    "Quantum calculation with supporting invoices",
  ],
};

export const resolveClaimType = (text: string): ClaimTypeId | null => {
  const normalized = text.toLowerCase();
  for (const type of CLAIM_TYPES) {
    if (normalized.includes(type.name.toLowerCase()) || normalized.includes(type.id.replace(/-/g, " "))) {
      return type.id;
    }
  }
  if (/delay|prolongation/i.test(normalized)) return "delay";
  if (/variation|change\s+order/i.test(normalized)) return "variation";
  if (/extra\s+item|additional\s+work/i.test(normalized)) return "extra-item";
  if (/escalation|price\s+adjustment/i.test(normalized)) return "cost-escalation";
  if (/eot|extension\s+of\s+time/i.test(normalized)) return "time-extension";
  if (/compensation\s+event/i.test(normalized)) return "compensation-event";
  return null;
};

export const assessClaim = (
  claimType: ClaimTypeId,
  context: string
): ClaimAssessment => {
  const typeName = CLAIM_TYPES.find((t) => t.id === claimType)?.name ?? claimType;
  const supportingDocuments = CLAIM_DOCS[claimType];

  const hasNotice = /notice|notification|within\s+\d+\s+days/i.test(context);
  const hasRecords = /record|log|report|correspondence|email|letter/i.test(context);
  const hasProgramme = /programme|schedule|critical\s+path/i.test(context);

  let merit: ClaimAssessment["merit"] = "weak";
  if (hasNotice && hasRecords) merit = "moderate";
  if (hasNotice && hasRecords && hasProgramme) merit = "strong";

  const narratives: Record<ClaimTypeId, string> = {
    delay: "Narrate: (1) baseline programme, (2) event causing delay, (3) impact on critical path, (4) extended completion date sought.",
    variation: "Narrate: (1) original scope, (2) change instruction received, (3) additional work performed, (4) cost and time impact.",
    "extra-item": "Narrate: (1) item not in original BOQ, (2) engineer's instruction to perform, (3) quantities measured, (4) rate basis.",
    "cost-escalation": "Narrate: (1) contract escalation clause, (2) baseline vs current prices, (3) eligible materials, (4) calculated adjustment.",
    "time-extension": "Narrate: (1) qualifying event per contract, (2) notice compliance, (3) delay to completion, (4) revised date requested.",
    "compensation-event": "Narrate: (1) event notification, (2) employer risk event, (3) cost/time entitlement, (4) quantum with evidence.",
  };

  return {
    claimType,
    claimTypeName: typeName,
    merit,
    supportingDocuments,
    narrativeGuidance: narratives[claimType],
    timeImpact: /time|delay|extension/i.test(context) ? "Time impact assessment required" : null,
    costImpact: /cost|amount|price|₹/i.test(context) ? "Cost quantum to be calculated" : null,
  };
};

export const formatClaimAssessment = (claim: ClaimAssessment): string =>
  [
    `Claim Type: ${claim.claimTypeName}`,
    `Merit Assessment: ${claim.merit.toUpperCase()}`,
    claim.timeImpact ? `Time Impact: ${claim.timeImpact}` : "",
    claim.costImpact ? `Cost Impact: ${claim.costImpact}` : "",
    "",
    "Narrative Guidance:",
    claim.narrativeGuidance,
    "",
    "Supporting Document Checklist:",
    ...claim.supportingDocuments.map((d) => `- [ ] ${d}`),
    "",
    "Note: This is engineering claims intelligence — not legal advice. Consult qualified legal counsel for formal claims.",
  ]
    .filter(Boolean)
    .join("\n");

export const analyzeVariation = (context: string): string[] => {
  const points: string[] = [];
  if (/verbal\s+instruction/i.test(context)) {
    points.push("Risk: Verbal instruction — obtain written confirmation before executing variation");
  }
  if (!/written|instruction|order/i.test(context)) {
    points.push("Confirm written variation order exists before claiming costs");
  }
  points.push("Assess time impact using critical path method");
  points.push("Price variation using contract rates or agreed new rates");
  points.push("Submit variation claim within contractual notice period");
  return points;
};

export const analyzeEotGuidance = (context: string): string[] => [
  "Identify qualifying event per contract clause (e.g. employer delay, force majeure, variations)",
  "Serve notice within contractual period (typically 28 days of becoming aware)",
  "Prepare delay analysis linking event to critical path impact",
  "Submit detailed EOT application with revised completion date",
  "Maintain contemporary records throughout delay period",
  ...( /weather/i.test(context) ? ["Obtain certified weather data for claimed period"] : []),
];
