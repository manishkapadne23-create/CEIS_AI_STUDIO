import type { TenderAnalysis } from "./types";

export interface EligibilityResult {
  eligible: boolean;
  score: number;
  metCriteria: string[];
  unmetCriteria: string[];
  recommendations: string[];
}

const DEFAULT_ELIGIBILITY_DOCS = [
  "Company registration certificate",
  "GST registration",
  "PAN card",
  "Audited financial statements (last 3 years)",
  "Experience certificates for similar works",
  "Valid contractor license/registration",
  "EMD/Bid security",
  "Integrity pact (if applicable)",
  "Affidavit for blacklisting",
  "Power of attorney for signatory",
];

export const checkEligibility = (
  analysis: TenderAnalysis
): EligibilityResult => {
  const metCriteria: string[] = [];
  const unmetCriteria: string[] = [];
  const recommendations: string[] = [];

  if (analysis.eligibilityCriteria.length > 0) {
    for (const criterion of analysis.eligibilityCriteria) {
      unmetCriteria.push(`Verify: ${criterion}`);
    }
    recommendations.push(
      "Prepare eligibility compliance matrix mapping each criterion to supporting documents"
    );
  } else {
    unmetCriteria.push("Eligibility criteria not extracted — review tender document Section on eligibility");
  }

  if (analysis.experienceRequirements.length > 0) {
    recommendations.push(
      `Compile experience certificates matching: ${analysis.experienceRequirements.slice(0, 2).join("; ")}`
    );
  } else {
    recommendations.push("Confirm minimum experience requirements for similar works");
  }

  if (analysis.financialCriteria.length > 0) {
    metCriteria.push("Financial criteria identified in tender");
    recommendations.push("Verify turnover and net worth against eligibility thresholds");
  } else {
    unmetCriteria.push("Financial eligibility criteria not identified");
  }

  const score = Math.max(
    0,
    Math.min(100, 50 + metCriteria.length * 10 - unmetCriteria.length * 5)
  );

  return {
    eligible: score >= 60,
    score,
    metCriteria,
    unmetCriteria: unmetCriteria.slice(0, 8),
    recommendations,
  };
};

export const getMissingDocuments = (
  analysis: TenderAnalysis
): string[] => {
  const missing: string[] = [];
  const text = [
    ...analysis.eligibilityCriteria,
    ...analysis.technicalCriteria,
    ...analysis.financialCriteria,
  ].join(" ").toLowerCase();

  const docChecks: { keyword: string; doc: string }[] = [
    { keyword: "turnover", doc: "Audited turnover certificates" },
    { keyword: "experience", doc: "Work completion certificates" },
    { keyword: "emd", doc: "EMD/Bid security instrument" },
    { keyword: "gst", doc: "GST registration certificate" },
    { keyword: "iso", doc: "ISO certification (if required)" },
    { keyword: "safety", doc: "Safety policy and HSE records" },
    { keyword: "method", doc: "Method statement" },
    { keyword: "programme", doc: "Work programme/schedule" },
    { keyword: "organogram", doc: "Organization chart and key personnel CVs" },
    { keyword: "equipment", doc: "Equipment list and ownership/hire documents" },
  ];

  for (const check of docChecks) {
    if (text.includes(check.keyword)) {
      missing.push(check.doc);
    }
  }

  if (missing.length === 0) {
    return DEFAULT_ELIGIBILITY_DOCS.slice(0, 6);
  }

  return [...new Set(missing)];
};

export const formatEligibilityReport = (result: EligibilityResult): string =>
  [
    `Eligibility Assessment: ${result.eligible ? "LIKELY ELIGIBLE" : "REVIEW REQUIRED"} (Score: ${result.score}/100)`,
    result.metCriteria.length > 0
      ? `Met:\n${result.metCriteria.map((m) => `- ${m}`).join("\n")}`
      : "",
    result.unmetCriteria.length > 0
      ? `To Verify:\n${result.unmetCriteria.map((u) => `- ${u}`).join("\n")}`
      : "",
    result.recommendations.length > 0
      ? `Recommendations:\n${result.recommendations.map((r) => `- ${r}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
